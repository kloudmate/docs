/**
 * normalize_changes.ts
 *
 * Phase 2: Normalize raw PRs and commits into the unified ChangeItem shape
 * and deduplicate commits that are already represented by merged PRs.
 */

import { readFileSync, writeFileSync } from "fs";
import type { ChangeItem, RawCommit, RawPR, PipelineState } from "./types.js";

export function normalizeChanges(state: PipelineState): void {
  const rawPRs: RawPR[] = JSON.parse(readFileSync(state.rawPRsFile, "utf8"));
  const rawCommits: RawCommit[] = JSON.parse(
    readFileSync(state.rawCommitsFile, "utf8")
  );

  const items: ChangeItem[] = [];

  // ── Normalize PRs ────────────────────────────────────────────────────────────
  for (const pr of rawPRs) {
    if (!pr.merged_at) continue;

    items.push({
      repo: pr.repo,
      sourceType: "pr",
      id: String(pr.number),
      title: pr.title,
      description: pr.body ?? undefined,
      author: pr.user?.login,
      mergedOrCommittedAt: pr.merged_at,
      labels: pr.labels.map((l) => l.name),
      changedFiles: (pr.files ?? []).map((f) => f.filename),
      additions: pr.additions,
      deletions: pr.deletions,
      evidence: {
        url: pr.html_url,
        refs: [pr.html_url],
      },
    });
  }

  // Build a set of all commit SHAs that are covered by PRs.
  const prCommitSHAs = new Set<string>();
  for (const pr of rawPRs) {
    for (const c of pr.commits ?? []) {
      prCommitSHAs.add(c.sha);
    }
  }

  // ── Normalize direct commits ─────────────────────────────────────────────────
  for (const commit of rawCommits) {
    // Skip commits already represented by a merged PR.
    if (prCommitSHAs.has(commit.sha)) continue;

    const firstLine = commit.commit.message.split("\n")[0].trim();
    const fullMessage = commit.commit.message.trim();
    const additions = (commit.files ?? []).reduce(
      (sum, f) => sum + f.additions,
      0
    );
    const deletions = (commit.files ?? []).reduce(
      (sum, f) => sum + f.deletions,
      0
    );

    items.push({
      repo: commit.repo,
      sourceType: "commit",
      id: commit.sha,
      title: firstLine,
      description: fullMessage !== firstLine ? fullMessage : undefined,
      author:
        commit.author?.login ?? commit.commit.author?.name,
      mergedOrCommittedAt:
        commit.commit.author?.date ?? new Date().toISOString(),
      labels: [],
      changedFiles: (commit.files ?? []).map((f) => f.filename),
      additions,
      deletions,
      evidence: {
        url: commit.html_url,
        refs: [commit.html_url],
      },
    });
  }

  // Sort by date descending (most recent first).
  items.sort(
    (a, b) =>
      new Date(b.mergedOrCommittedAt).getTime() -
      new Date(a.mergedOrCommittedAt).getTime()
  );

  writeFileSync(state.normalizedFile, JSON.stringify(items, null, 2));
  console.log(`[normalize] ✓ ${items.length} change items written.`);
}
