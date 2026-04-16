/**
 * commit_digest.ts
 *
 * Phase 6: Commit the generated markdown digest to the docs repository.
 * Uses the GitHub REST API (createOrUpdateFileContents) so that authentication
 * works transparently from the GITHUB_TOKEN environment variable.
 *
 * Behaviour:
 * - If the file does not yet exist, create it.
 * - If the file already exists with the same content, skip the commit (idempotent).
 * - If the file already exists with different content, update it.
 */

import { readFileSync } from "fs";
import { Octokit } from "@octokit/rest";
import type { PipelineState } from "./types.js";

export async function commitDigest(
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

  const filePath = state.digestFile; // e.g. content/engineering-digests/2026/2026-04-13-weekly-digest.md
  const commitMessage = `docs: add weekly digest for ${state.weekLabel} [skip ci]`;
  const encodedContent = Buffer.from(digestContent).toString("base64");

  // Check if the file already exists so we can get its SHA (required for updates).
  let existingSha: string | undefined;
  let existingContent: string | undefined;

  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: filePath,
    });

    if (!Array.isArray(data) && data.type === "file") {
      existingSha = data.sha;
      existingContent = data.encoding === "base64"
        ? Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf8")
        : undefined;
    }
  } catch (err: unknown) {
    const status = (err as { status?: number }).status;
    if (status !== 404) throw err;
    // 404 → file doesn't exist yet, proceed to create.
  }

  // Skip commit if content is unchanged.
  if (existingContent !== undefined && existingContent === digestContent) {
    console.log(
      "[commit] ✓ Digest content unchanged — skipping commit."
    );
    return;
  }

  const action = existingSha ? "Updating" : "Creating";
  console.log(`[commit] ${action} ${filePath} …`);

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: commitMessage,
    content: encodedContent,
    sha: existingSha,
    committer: {
      name: "github-actions[bot]",
      email: "github-actions[bot]@users.noreply.github.com",
    },
    author: {
      name: "github-actions[bot]",
      email: "github-actions[bot]@users.noreply.github.com",
    },
  });

  console.log(`[commit] ✓ Digest committed: ${filePath}`);
}
