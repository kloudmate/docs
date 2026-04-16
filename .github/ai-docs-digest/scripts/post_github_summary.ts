/**
 * post_github_summary.ts
 *
 * Phase 7: Post a concise weekly summary as a comment to the dedicated
 * "Weekly Product + Docs Digest" tracking issue in the docs repository.
 *
 * - Creates the issue if it doesn't exist.
 * - Appends a comment each week.
 */

import { Octokit } from "@octokit/rest";
import type { ChangeItem, PipelineState } from "./types.js";
import { readFileSync } from "fs";

const TRACKING_ISSUE_TITLE = "Weekly Product + Docs Digest";
const TRACKING_ISSUE_LABEL = "weekly-digest";

export async function postGithubSummary(
  state: PipelineState,
  digestContent: string
): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN environment variable is required");

  const repoFull = process.env.GITHUB_REPOSITORY ?? "";
  if (!repoFull.includes("/")) {
    throw new Error(
      "GITHUB_REPOSITORY must be set in the form owner/repo (e.g. kloudmate/docs)"
    );
  }
  const [owner, repo] = repoFull.split("/");

  const octokit = new Octokit({ auth: token });

  // Load classified items for summary stats.
  let items: ChangeItem[] = [];
  try {
    items = JSON.parse(readFileSync(state.classifiedFile, "utf8"));
  } catch {
    /* non-fatal — proceed without stats */
  }

  const issueNumber = await findOrCreateTrackingIssue(
    octokit,
    owner,
    repo
  );

  const commentBody = buildCommentBody(state, items, digestContent);

  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body: commentBody,
  });

  console.log(
    `[post] ✓ Summary comment posted to issue #${issueNumber}`
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Find or create the tracking issue
// ──────────────────────────────────────────────────────────────────────────────

async function findOrCreateTrackingIssue(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<number> {
  // Search open issues first.
  const { data: open } = await octokit.issues.listForRepo({
    owner,
    repo,
    state: "open",
    labels: TRACKING_ISSUE_LABEL,
    per_page: 10,
  });

  const existing = open.find((i) => i.title === TRACKING_ISSUE_TITLE);
  if (existing) {
    console.log(`[post] Found tracking issue #${existing.number}`);
    return existing.number;
  }

  // Ensure the label exists.
  await ensureLabel(octokit, owner, repo);

  // Create the issue.
  const { data: created } = await octokit.issues.create({
    owner,
    repo,
    title: TRACKING_ISSUE_TITLE,
    labels: [TRACKING_ISSUE_LABEL],
    body: [
      "## Weekly Product + Docs Digest — Tracking Issue",
      "",
      "This issue collects weekly AI-generated product + documentation digests for the KloudMate team.",
      "",
      "Each week, a comment is automatically added below with a summary of customer-facing changes and docs impact.",
      "",
      "**Do not close this issue** — it is the running broadcast channel for the digest workflow.",
    ].join("\n"),
  });

  console.log(`[post] Created tracking issue #${created.number}`);
  return created.number;
}

async function ensureLabel(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<void> {
  try {
    await octokit.issues.getLabel({ owner, repo, name: TRACKING_ISSUE_LABEL });
  } catch (err: unknown) {
    const status = (err as { status?: number }).status;
    if (status === 404) {
      await octokit.issues.createLabel({
        owner,
        repo,
        name: TRACKING_ISSUE_LABEL,
        color: "0075ca",
        description: "Automated weekly product digest",
      });
    }
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Build comment body
// ──────────────────────────────────────────────────────────────────────────────

function buildCommentBody(
  state: PipelineState,
  items: ChangeItem[],
  _digestContent: string
): string {
  const breaking = items.filter((i) => i.category === "breaking" && i.visibility !== "internal");
  const newItems = items.filter((i) => i.category === "new" && i.visibility !== "internal");
  const fixes = items.filter((i) => i.category === "fix" && i.visibility !== "internal");
  const changed = items.filter((i) => i.category === "changed" && i.visibility !== "internal");
  const docsImpact = items.filter(
    (i) => i.docsArea && i.docsArea.length > 0 && i.visibility !== "internal"
  );

  const lines: string[] = [
    `## Weekly Digest — ${state.weekLabel}`,
    ``,
    `**Period:** ${state.weekStart} → ${state.weekEnd}`,
    ``,
  ];

  if (breaking.length > 0) {
    lines.push(`- ⚠️ **${breaking.length} breaking change(s)** — on-prem or API users may be affected`);
  }
  if (newItems.length > 0) {
    lines.push(`- 🆕 **${newItems.length} new customer-facing feature(s)/improvement(s)**`);
  }
  if (fixes.length > 0) {
    lines.push(`- 🐛 **${fixes.length} fix(es)** worth noting`);
  }
  if (changed.length > 0) {
    lines.push(`- 🔄 **${changed.length} behavioral/config change(s)**`);
  }
  if (docsImpact.length > 0) {
    lines.push(`- 📝 **${docsImpact.length} doc area(s) likely need review**`);
  }

  if (
    breaking.length === 0 &&
    newItems.length === 0 &&
    fixes.length === 0 &&
    changed.length === 0
  ) {
    lines.push("- _No significant customer-facing changes this week._");
  }

  lines.push(``, `**Full digest:** \`${state.digestFile}\``);

  return lines.join("\n");
}
