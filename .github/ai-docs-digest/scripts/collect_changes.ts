/**
 * collect_changes.ts
 *
 * Phase 1: Collect merged PRs and direct commits for each configured repository
 * within the weekly window.  Saves raw JSON to the artifacts directory.
 */

import { Octokit } from "@octokit/rest";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
import type { RawPR, RawCommit, PipelineState } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Root of the docs repository (two levels above scripts/). */
const REPO_ROOT = resolve(__dirname, "..", "..", "..");

/** Maximum number of files to fetch per PR (to keep prompt size bounded). */
const MAX_PR_FILES = 50;

/** Maximum number of items fetched per repo. */
const MAX_PRS_PER_REPO = 100;
const MAX_COMMITS_PER_REPO = 200;

export async function collectChanges(state: PipelineState): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN environment variable is required");

  const octokit = new Octokit({ auth: token });

  // Load repo list.
  const reposConfig = yaml.load(
    readFileSync(
      resolve(REPO_ROOT, ".github", "ai-docs-digest", "repos.yml"),
      "utf8"
    )
  ) as { repositories: string[] };

  const repos = reposConfig.repositories;
  console.log(`[collect] Repositories: ${repos.join(", ")}`);
  console.log(
    `[collect] Window: ${state.weekStart} → ${state.weekEnd} (UTC)`
  );

  const since = `${state.weekStart}T00:00:00Z`;
  const until = `${state.weekEnd}T23:59:59Z`;

  const allRawPRs: RawPR[] = [];
  const allRawCommits: RawCommit[] = [];
  const errors: string[] = [];

  for (const repoEntry of repos) {
    // Support both "owner/repo" and bare "repo" formats.
    const slashIdx = repoEntry.indexOf("/");
    const owner = slashIdx !== -1 ? repoEntry.slice(0, slashIdx) : "kloudmate";
    const repoName = slashIdx !== -1 ? repoEntry.slice(slashIdx + 1) : repoEntry;

    try {
      console.log(`[collect] Processing ${owner}/${repoName} …`);

      // Resolve default branch.
      let defaultBranch = "main";
      try {
        const { data: repoMeta } = await octokit.repos.get({
          owner,
          repo: repoName,
        });
        defaultBranch = repoMeta.default_branch;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(
          `[collect]  ⚠ Could not fetch repo metadata for ${owner}/${repoName}: ${msg}`
        );
        errors.push(`${owner}/${repoName}: failed to fetch repo metadata — ${msg}`);
        continue;
      }

      // ── Collect merged PRs ──────────────────────────────────────────────────
      const prs = await collectMergedPRs(
        octokit,
        owner,
        repoName,
        defaultBranch,
        since,
        until
      );
      console.log(`[collect]  PRs merged: ${prs.length}`);
      allRawPRs.push(...prs);

      // Build a set of merge commit SHAs so we can skip them in direct commits.
      const prMergeSHAs = new Set<string>();
      for (const pr of prs) {
        if (pr.commits) {
          for (const c of pr.commits) prMergeSHAs.add(c.sha);
        }
      }

      // ── Collect direct commits ──────────────────────────────────────────────
      const commits = await collectDirectCommits(
        octokit,
        owner,
        repoName,
        defaultBranch,
        since,
        until,
        prMergeSHAs
      );
      console.log(`[collect]  Direct commits: ${commits.length}`);
      allRawCommits.push(...commits);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[collect]  ✗ Error processing ${owner}/${repoName}: ${msg}`);
      errors.push(`${owner}/${repoName}: ${msg}`);
    }
  }

  // Persist raw data.
  mkdirSync(dirname(state.rawPRsFile), { recursive: true });
  writeFileSync(state.rawPRsFile, JSON.stringify(allRawPRs, null, 2));
  writeFileSync(state.rawCommitsFile, JSON.stringify(allRawCommits, null, 2));

  if (errors.length > 0) {
    writeFileSync(
      resolve(dirname(state.rawPRsFile), "collect-errors.json"),
      JSON.stringify(errors, null, 2)
    );
    console.warn(`[collect] ⚠ Completed with ${errors.length} error(s).`);
  }

  console.log(
    `[collect] ✓ Saved ${allRawPRs.length} PRs and ${allRawCommits.length} direct commits.`
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

async function collectMergedPRs(
  octokit: Octokit,
  owner: string,
  repo: string,
  base: string,
  since: string,
  until: string
): Promise<RawPR[]> {
  const results: RawPR[] = [];
  let page = 1;

  while (results.length < MAX_PRS_PER_REPO) {
    const { data: prs } = await octokit.pulls.list({
      owner,
      repo,
      state: "closed",
      base,
      sort: "updated",
      direction: "desc",
      per_page: 100,
      page,
    });

    if (prs.length === 0) break;

    let reachedWindow = false;
    for (const pr of prs) {
      if (!pr.merged_at) continue;
      if (pr.merged_at < since) {
        reachedWindow = true;
        break;
      }
      if (pr.merged_at > until) continue;

      // Fetch file list and commit list for this PR.
      const files = await fetchPRFiles(octokit, owner, repo, pr.number);
      const commits = await fetchPRCommitSHAs(octokit, owner, repo, pr.number);

      // Fetch full PR details to get additions/deletions (not available in list response).
      let additions = 0;
      let deletions = 0;
      let changed_files = 0;
      try {
        const { data: full } = await octokit.pulls.get({
          owner,
          repo,
          pull_number: pr.number,
        });
        additions = full.additions ?? 0;
        deletions = full.deletions ?? 0;
        changed_files = full.changed_files ?? 0;
      } catch {
        /* non-fatal — leave as 0 */
      }

      results.push({
        repo,
        number: pr.number,
        title: pr.title,
        body: pr.body,
        state: pr.state,
        merged_at: pr.merged_at,
        user: pr.user ? { login: pr.user.login } : null,
        labels: (pr.labels ?? []).map((l) => ({ name: l.name ?? "" })),
        html_url: pr.html_url,
        additions,
        deletions,
        changed_files,
        files,
        commits,
      });
    }

    if (reachedWindow || prs.length < 100) break;
    page++;
  }

  return results;
}

async function fetchPRFiles(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number
): Promise<Array<{ filename: string }>> {
  try {
    const { data } = await octokit.pulls.listFiles({
      owner,
      repo,
      pull_number: prNumber,
      per_page: MAX_PR_FILES,
    });
    return data.map((f) => ({ filename: f.filename }));
  } catch {
    return [];
  }
}

async function fetchPRCommitSHAs(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number
): Promise<Array<{ sha: string }>> {
  try {
    const { data } = await octokit.pulls.listCommits({
      owner,
      repo,
      pull_number: prNumber,
      per_page: 250,
    });
    return data.map((c) => ({ sha: c.sha }));
  } catch {
    return [];
  }
}

async function collectDirectCommits(
  octokit: Octokit,
  owner: string,
  repo: string,
  branch: string,
  since: string,
  until: string,
  skipSHAs: Set<string>
): Promise<RawCommit[]> {
  const results: RawCommit[] = [];
  let page = 1;

  while (results.length < MAX_COMMITS_PER_REPO) {
    const { data: commits } = await octokit.repos.listCommits({
      owner,
      repo,
      sha: branch,
      since,
      until,
      per_page: 100,
      page,
    });

    if (commits.length === 0) break;

    for (const c of commits) {
      // Skip merge commits that are already represented by PRs.
      if (skipSHAs.has(c.sha)) continue;
      // Skip typical merge commit messages.
      const msg = c.commit.message ?? "";
      if (/^Merge pull request #\d+/i.test(msg)) continue;

      // Fetch file details for this commit (abbreviated).
      let files: Array<{ filename: string; additions: number; deletions: number }> = [];
      try {
        const { data: detail } = await octokit.repos.getCommit({
          owner,
          repo,
          ref: c.sha,
        });
        files = (detail.files ?? []).slice(0, MAX_PR_FILES).map((f) => ({
          filename: f.filename ?? "",
          additions: f.additions ?? 0,
          deletions: f.deletions ?? 0,
        }));
      } catch {
        /* non-fatal */
      }

      results.push({
        repo,
        sha: c.sha,
        commit: {
          message: c.commit.message ?? "",
          author: c.commit.author
            ? { name: c.commit.author.name ?? "", date: c.commit.author.date ?? "" }
            : null,
        },
        author: c.author ? { login: c.author.login } : null,
        html_url: c.html_url,
        files,
      });
    }

    if (commits.length < 100) break;
    page++;
  }

  return results;
}
