/**
 * generate_digest.ts
 *
 * Phase 5: Call the OpenRouter LLM API with the built prompt, validate the
 * returned markdown structure, and write the final digest file.
 * Falls back to a heuristic-based digest if the LLM call fails.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import type { BuiltPrompt } from "./build_prompt.js";
import type { ChangeItem, PipelineState } from "./types.js";

const OPENROUTER_BASE_URL =
  process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1";

const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL ?? "anthropic/claude-3.5-sonnet";

/** Required section headings that must be present in the digest. */
const REQUIRED_HEADINGS = [
  "## Executive Summary",
  "## New",
  "## Changed",
  "## Breaking Changes",
  "## Fixes",
  "## Docs Impact",
  "## Internal / Excluded Notes",
  "## Source References",
];

export async function generateDigest(
  state: PipelineState,
  prompt: BuiltPrompt
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  let markdown: string;

  if (!apiKey) {
    console.warn(
      "[generate] ⚠ OPENROUTER_API_KEY not set — using fallback digest."
    );
    markdown = buildFallbackDigest(state);
  } else {
    try {
      markdown = await callOpenRouter(apiKey, prompt, state);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[generate] ✗ LLM call failed: ${msg}`);
      console.warn("[generate] ⚠ Falling back to heuristic digest.");
      markdown = buildFallbackDigest(state);
    }
  }

  // Validate structure.
  const missing = REQUIRED_HEADINGS.filter((h) => !markdown.includes(h));
  if (missing.length > 0) {
    console.warn(
      `[generate] ⚠ Digest missing sections: ${missing.join(", ")} — repairing.`
    );
    markdown = repairDigest(markdown, missing);
  }

  // Persist.
  mkdirSync(dirname(state.digestAbsPath), { recursive: true });
  writeFileSync(state.digestAbsPath, markdown);
  console.log(`[generate] ✓ Digest written to ${state.digestAbsPath}`);

  return markdown;
}

// ──────────────────────────────────────────────────────────────────────────────
// OpenRouter API call
// ──────────────────────────────────────────────────────────────────────────────

async function callOpenRouter(
  apiKey: string,
  prompt: BuiltPrompt,
  state: PipelineState
): Promise<string> {
  console.log(
    `[generate] Calling OpenRouter model: ${OPENROUTER_MODEL} …`
  );

  const body = {
    model: OPENROUTER_MODEL,
    messages: [
      { role: "system", content: prompt.systemPrompt },
      { role: "user", content: prompt.userPrompt },
    ],
    temperature: 0.2,
    max_tokens: 4096,
  };

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://github.com/kloudmate/docs",
      "X-Title": "KloudMate AI Docs Digest",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenRouter API error ${response.status}: ${text}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message: string };
  };

  if (json.error) {
    throw new Error(`OpenRouter error: ${json.error.message}`);
  }

  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenRouter returned an empty response");
  }

  // Save raw LLM response for debugging.
  writeFileSync(state.llmResponseFile, content);
  console.log(`[generate] ✓ Received ${content.length} chars from LLM.`);

  return content.trim();
}

// ──────────────────────────────────────────────────────────────────────────────
// Repair digest if headings are missing
// ──────────────────────────────────────────────────────────────────────────────

function repairDigest(markdown: string, missingHeadings: string[]): string {
  let repaired = markdown;
  for (const heading of missingHeadings) {
    repaired += `\n\n${heading}\n_None this week._\n`;
  }
  return repaired;
}

// ──────────────────────────────────────────────────────────────────────────────
// Fallback heuristic digest (used when LLM is unavailable)
// ──────────────────────────────────────────────────────────────────────────────

function buildFallbackDigest(state: PipelineState): string {
  let items: ChangeItem[] = [];
  try {
    items = JSON.parse(readFileSync(state.classifiedFile, "utf8"));
  } catch {
    /* fallback with empty items */
  }

  const byCategory = groupBy(items, (i) => i.category ?? "internal");
  const breaking = byCategory.get("breaking") ?? [];
  const newItems = byCategory.get("new") ?? [];
  const fixes = byCategory.get("fix") ?? [];
  const changed = byCategory.get("changed") ?? [];
  const internal = byCategory.get("internal") ?? [];

  const docsImpactItems = items.filter(
    (i) => i.docsArea && i.docsArea.length > 0 && i.visibility !== "internal"
  );

  const allCustomerFacing = [...breaking, ...newItems, ...fixes, ...changed];
  const refs = allCustomerFacing.map(
    (i) =>
      `- ${i.repo} ${i.sourceType === "pr" ? `PR #${i.id}` : `commit ${i.id.slice(0, 8)}`}${i.evidence.url ? ` — ${i.evidence.url}` : ""}`
  );

  const lines: string[] = [
    `---`,
    `title: Weekly Product Digest — ${state.weekLabel}`,
    `summary: Customer-facing product and documentation-impact summary for the week.`,
    `date: ${state.weekLabel}`,
    `period_start: ${state.weekStart}`,
    `period_end: ${state.weekEnd}`,
    `type: engineering-digest`,
    `generated_by: fallback-heuristic`,
    `---`,
    ``,
    `# Weekly KloudMate Product Digest`,
    `Period: ${state.weekStart} to ${state.weekEnd}`,
    ``,
    `> ⚠️ This digest was generated using heuristics because the LLM call was unavailable.`,
    ``,
    `## Executive Summary`,
    `${allCustomerFacing.length} customer-relevant change(s) collected across ${new Set(allCustomerFacing.map((i) => i.repo)).size} repository/repositories. See sections below for details.`,
    ``,
    `## New`,
    formatItems(newItems) || "_None this week._",
    ``,
    `## Changed`,
    formatItems(changed) || "_None this week._",
    ``,
    `## Breaking Changes`,
    formatItems(breaking) || "_None this week._",
    ``,
    `## Fixes`,
    formatItems(fixes) || "_None this week._",
    ``,
    `## Docs Impact`,
    docsImpactItems.length > 0
      ? docsImpactItems
          .map(
            (i) =>
              `- **${i.productArea ?? "Unknown"}**\n  - Reason: ${i.title}\n  - Likely docs area: ${(i.docsArea ?? []).join(", ")}\n  - Confidence: Low (heuristic)\n  - Evidence: ${i.repo} ${i.sourceType === "pr" ? `PR #${i.id}` : `commit ${i.id.slice(0, 8)}`}`
          )
          .join("\n")
      : "_None identified._",
    ``,
    `## Internal / Excluded Notes`,
    `Excluded ${internal.length} internal change(s) from primary summary.`,
    ``,
    `## Source References`,
    refs.length > 0 ? refs.join("\n") : "_No sources._",
  ];

  return lines.join("\n");
}

function formatItems(items: ChangeItem[]): string {
  return items
    .map(
      (i) =>
        `- **[${i.repo}]** ${i.title}${i.evidence.url ? ` ([ref](${i.evidence.url}))` : ""}`
    )
    .join("\n");
}

function groupBy<T, K>(
  items: T[],
  keyFn: (item: T) => K
): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return map;
}
