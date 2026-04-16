/**
 * build_prompt.ts
 *
 * Phase 4: Build the system + user prompts from classified change items and
 * the prompt templates.  Writes the combined prompt to an artifact file.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import type { ChangeItem, PipelineState } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..", "..");
const PROMPTS_DIR = resolve(
  REPO_ROOT,
  ".github",
  "ai-docs-digest",
  "prompts"
);

/**
 * Approximate token count heuristic (1 token ≈ 4 chars).
 * Used to cap prompt size before sending to the LLM.
 */
const MAX_PROMPT_CHARS = 120_000; // ~30k tokens — safe for most models with 128k context

/** Maximum number of changed files listed per change item in the prompt. */
const MAX_FILES_PER_ITEM = 15;

export interface BuiltPrompt {
  systemPrompt: string;
  userPrompt: string;
}

export function buildPrompt(state: PipelineState): BuiltPrompt {
  const allItems: ChangeItem[] = JSON.parse(
    readFileSync(state.classifiedFile, "utf8")
  );

  // Separate customer-relevant from clearly internal.
  const relevant = allItems.filter(
    (i) => i.visibility !== "internal" || i.category !== "internal"
  );
  const excluded = allItems.filter(
    (i) => i.visibility === "internal" && i.category === "internal"
  );

  console.log(
    `[build-prompt] Items in prompt: ${relevant.length}, excluded: ${excluded.length}`
  );

  // Build a summary of product / docs areas for the prompt header.
  const areaSummary = buildAreaSummary(relevant);

  // Trim changed file lists to keep prompt size reasonable.
  const trimmedItems = relevant.map((item) => ({
    ...item,
    changedFiles: item.changedFiles.slice(0, MAX_FILES_PER_ITEM),
    description:
      item.description && item.description.length > 800
        ? item.description.slice(0, 800) + " …[truncated]"
        : item.description,
  }));

  const changesJson = JSON.stringify(trimmedItems, null, 2);
  const areaSummaryJson = JSON.stringify(areaSummary, null, 2);

  const systemTemplate = readFileSync(
    resolve(PROMPTS_DIR, "summarize-system.txt"),
    "utf8"
  );
  const userTemplate = readFileSync(
    resolve(PROMPTS_DIR, "summarize-user.txt"),
    "utf8"
  );

  const userPrompt = userTemplate
    .replace(/\{\{PERIOD_START\}\}/g, state.weekStart)
    .replace(/\{\{PERIOD_END\}\}/g, state.weekEnd)
    .replace(/\{\{WEEK_LABEL\}\}/g, state.weekLabel)
    .replace(/\{\{CHANGES_JSON\}\}/g, changesJson)
    .replace(/\{\{AREA_SUMMARY_JSON\}\}/g, areaSummaryJson);

  // Enforce token cap — trim the middle of the changes JSON if necessary.
  const combined = systemTemplate + userPrompt;
  const finalPrompt =
    combined.length > MAX_PROMPT_CHARS
      ? capPrompt(systemTemplate, userTemplate, trimmedItems, areaSummary, state)
      : { systemPrompt: systemTemplate, userPrompt };

  // Persist for debugging.
  mkdirSync(dirname(state.promptFile), { recursive: true });
  writeFileSync(
    state.promptFile,
    `=== SYSTEM PROMPT ===\n${finalPrompt.systemPrompt}\n\n=== USER PROMPT ===\n${finalPrompt.userPrompt}`
  );

  console.log(
    `[build-prompt] ✓ Prompt size: ${(finalPrompt.systemPrompt + finalPrompt.userPrompt).length} chars`
  );

  return finalPrompt;
}

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

interface AreaSummaryEntry {
  productArea: string;
  docsAreas: string[];
  itemCount: number;
  repos: string[];
}

function buildAreaSummary(items: ChangeItem[]): AreaSummaryEntry[] {
  const map = new Map<string, AreaSummaryEntry>();

  for (const item of items) {
    const area = item.productArea ?? "Unknown";
    if (!map.has(area)) {
      map.set(area, { productArea: area, docsAreas: [], itemCount: 0, repos: [] });
    }
    const entry = map.get(area)!;
    entry.itemCount++;
    if (!entry.repos.includes(item.repo)) entry.repos.push(item.repo);
    for (const da of item.docsArea ?? []) {
      if (!entry.docsAreas.includes(da)) entry.docsAreas.push(da);
    }
  }

  return [...map.values()].sort((a, b) => b.itemCount - a.itemCount);
}

/** Hard-cap the prompt by reducing the number of items included. */
function capPrompt(
  systemTemplate: string,
  userTemplate: string,
  items: ChangeItem[],
  areaSummary: ReturnType<typeof buildAreaSummary>,
  state: PipelineState
): BuiltPrompt {
  // Keep only the most relevant items (customer/mixed first, breaking first).
  const priority = ["breaking", "new", "fix", "changed", "internal"];
  const sorted = [...items].sort(
    (a, b) =>
      priority.indexOf(a.category ?? "internal") -
      priority.indexOf(b.category ?? "internal")
  );

  let subset = sorted;
  let userPrompt = "";

  while (subset.length > 0) {
    const changesJson = JSON.stringify(subset, null, 2);
    const areaSummaryJson = JSON.stringify(areaSummary, null, 2);
    userPrompt = userTemplate
      .replace(/\{\{PERIOD_START\}\}/g, state.weekStart)
      .replace(/\{\{PERIOD_END\}\}/g, state.weekEnd)
      .replace(/\{\{WEEK_LABEL\}\}/g, state.weekLabel)
      .replace(/\{\{CHANGES_JSON\}\}/g, changesJson)
      .replace(/\{\{AREA_SUMMARY_JSON\}\}/g, areaSummaryJson);

    if ((systemTemplate + userPrompt).length <= MAX_PROMPT_CHARS) break;
    subset = subset.slice(0, Math.floor(subset.length * 0.8));
  }

  if (subset.length < items.length) {
    console.warn(
      `[build-prompt] ⚠ Prompt capped: ${subset.length}/${items.length} items included.`
    );
  }

  return { systemPrompt: systemTemplate, userPrompt };
}
