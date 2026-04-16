/**
 * main.ts
 *
 * Orchestrates the AI docs digest pipeline phases in sequence.
 *
 * Usage:
 *   npx tsx main.ts            # Run all phases
 *   npx tsx main.ts collect    # Collect changes only
 *   npx tsx main.ts generate   # Generate digest only (assumes collect ran)
 *   npx tsx main.ts commit     # Commit digest only
 *   npx tsx main.ts post       # Post GitHub summary only
 *
 * Environment variables:
 *   GITHUB_TOKEN          — required for collection, commit, and issue posting
 *   OPENROUTER_API_KEY    — required for LLM generation (skips to fallback if absent)
 *   OPENROUTER_MODEL      — optional model override (default: anthropic/claude-3.5-sonnet)
 *   OPENROUTER_BASE_URL   — optional base URL override
 *   GITHUB_REPOSITORY     — owner/repo (set automatically by GitHub Actions)
 *   WEEK_START            — optional YYYY-MM-DD; defaults to previous Monday
 *   ARTIFACTS_DIR         — directory for intermediate files (default: /tmp/digest-artifacts)
 */

import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

import { collectChanges } from "./collect_changes.js";
import { normalizeChanges } from "./normalize_changes.js";
import { classifyChanges } from "./classify_changes.js";
import { buildPrompt } from "./build_prompt.js";
import { generateDigest } from "./generate_digest.js";
import { commitDigest } from "./commit_digest.js";
import { postGithubSummary } from "./post_github_summary.js";
import type { PipelineState } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..", "..");

// ──────────────────────────────────────────────────────────────────────────────
// Date helpers
// ──────────────────────────────────────────────────────────────────────────────

/** Parse a YYYY-MM-DD string into a UTC Date at midnight. */
function parseUTCDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** Format a Date as YYYY-MM-DD in UTC. */
function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Compute the most recent Monday (inclusive of today if today is Monday).
 * Returns YYYY-MM-DD.
 */
function previousMonday(from: Date = new Date()): string {
  const d = new Date(from);
  // JavaScript: 0=Sun, 1=Mon, … 6=Sat
  const dayOfWeek = d.getUTCDay();
  const daysBack = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  d.setUTCDate(d.getUTCDate() - daysBack);
  return formatDate(d);
}

function addDays(dateStr: string, days: number): string {
  const d = parseUTCDate(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  return formatDate(d);
}

// ──────────────────────────────────────────────────────────────────────────────
// State setup
// ──────────────────────────────────────────────────────────────────────────────

function buildState(): PipelineState {
  const artifactsDir =
    process.env.ARTIFACTS_DIR ?? "/tmp/digest-artifacts";
  mkdirSync(artifactsDir, { recursive: true });

  // Determine the weekly window.
  let weekStart: string;
  if (process.env.WEEK_START) {
    weekStart = process.env.WEEK_START;
  } else {
    // Default: previous Monday relative to now.
    weekStart = previousMonday();
  }
  const weekEnd = addDays(weekStart, 6); // Sunday

  // File paths for intermediate artifacts.
  const year = weekStart.slice(0, 4);
  const weekLabel = weekStart; // same as YYYY-MM-DD of Monday

  const digestFile = `content/engineering-digests/${year}/${weekLabel}-weekly-digest.md`;
  const digestAbsPath = resolve(REPO_ROOT, digestFile);

  return {
    weekStart,
    weekEnd,
    weekLabel,
    org: "kloudmate",
    rawPRsFile: resolve(artifactsDir, "raw-prs.json"),
    rawCommitsFile: resolve(artifactsDir, "raw-commits.json"),
    normalizedFile: resolve(artifactsDir, "normalized-changes.json"),
    classifiedFile: resolve(artifactsDir, "classified-changes.json"),
    promptFile: resolve(artifactsDir, "llm-prompt.txt"),
    llmResponseFile: resolve(artifactsDir, "llm-response.md"),
    digestFile,
    digestAbsPath,
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// Phase runners
// ──────────────────────────────────────────────────────────────────────────────

async function runCollect(state: PipelineState): Promise<void> {
  console.log("\n── Phase 1: Collect ──────────────────────────────────────");
  await collectChanges(state);
  console.log("── Phase 2: Normalize ────────────────────────────────────");
  normalizeChanges(state);
  console.log("── Phase 3: Classify ─────────────────────────────────────");
  classifyChanges(state);
}

async function runGenerate(state: PipelineState): Promise<string> {
  console.log("\n── Phase 4: Build prompt ─────────────────────────────────");
  const prompt = buildPrompt(state);
  console.log("── Phase 5: Generate digest ──────────────────────────────");
  return generateDigest(state, prompt);
}

async function runCommit(
  state: PipelineState,
  digest: string
): Promise<void> {
  console.log("\n── Phase 6: Commit digest ────────────────────────────────");
  await commitDigest(state, digest);
}

async function runPost(
  state: PipelineState,
  digest: string
): Promise<void> {
  console.log("\n── Phase 7: Post GitHub summary ──────────────────────────");
  await postGithubSummary(state, digest);
}

// ──────────────────────────────────────────────────────────────────────────────
// Entry point
// ──────────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const phase = process.argv[2] ?? "all";
  const state = buildState();

  // Write state file so phases can be run independently.
  const stateFile = resolve(
    process.env.ARTIFACTS_DIR ?? "/tmp/digest-artifacts",
    "pipeline-state.json"
  );
  writeFileSync(stateFile, JSON.stringify(state, null, 2));

  console.log(`\n🗓  Weekly window: ${state.weekStart} → ${state.weekEnd}`);
  console.log(`📁  Artifacts dir: ${dirname(state.rawPRsFile)}`);
  console.log(`📄  Digest path:   ${state.digestFile}`);

  let digest = "";

  try {
    switch (phase) {
      case "collect":
        await runCollect(state);
        break;

      case "generate":
        digest = await runGenerate(state);
        break;

      case "commit":
        digest = readFileSync(state.digestAbsPath, "utf8");
        await runCommit(state, digest);
        break;

      case "post":
        digest = readFileSync(state.digestAbsPath, "utf8");
        await runPost(state, digest);
        break;

      case "all":
      default:
        await runCollect(state);
        digest = await runGenerate(state);
        await runCommit(state, digest);
        await runPost(state, digest);
        break;
    }

    console.log("\n✅ Pipeline complete.\n");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`\n❌ Pipeline failed: ${msg}`);
    if (err instanceof Error && err.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

main();
