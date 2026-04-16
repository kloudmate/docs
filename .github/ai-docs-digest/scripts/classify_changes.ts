/**
 * classify_changes.ts
 *
 * Phase 3: Apply heuristics to score each change item:
 *   - Docs area from file-path mappings
 *   - Visibility (customer | internal | mixed | unknown)
 *   - Category (new | changed | breaking | fix | internal)
 *   - Product area is left for the LLM to infer
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
import { minimatch } from "minimatch";
import type {
  ChangeItem,
  DocsAreaMappingRule,
  PipelineState,
} from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..", "..");
const CONFIG_DIR = resolve(REPO_ROOT, ".github", "ai-docs-digest");

// ──────────────────────────────────────────────────────────────────────────────
// Internal-only signals
// ──────────────────────────────────────────────────────────────────────────────

const INTERNAL_LABEL_PATTERNS = [
  /^internal$/i,
  /^chore$/i,
  /^refactor$/i,
  /^ci$/i,
  /^cd$/i,
  /^deps$/i,
  /^dependencies$/i,
  /^dev-deps$/i,
  /^no-release$/i,
];

const INTERNAL_PATH_GLOBS = [
  ".github/**",
  ".circleci/**",
  ".travis.yml",
  "tests/**",
  "test/**",
  "__tests__/**",
  "spec/**",
  "scripts/**",
  "*.lock",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "go.sum",
  "Cargo.lock",
  ".eslintrc*",
  ".prettierrc*",
  "jest.config*",
  "vitest.config*",
];

const INTERNAL_TITLE_PATTERNS = [
  /^(chore|ci|test|refactor|style|build)\b/i,
  /\[skip release\]/i,
  /\[internal\]/i,
  /bump .* from .* to /i,
];

// ──────────────────────────────────────────────────────────────────────────────
// Customer-facing signals
// ──────────────────────────────────────────────────────────────────────────────

const CUSTOMER_LABEL_PATTERNS = [
  /^feature$/i,
  /^feat$/i,
  /^enhancement$/i,
  /^bug$/i,
  /^fix$/i,
  /^breaking$/i,
  /^breaking-change$/i,
  /^customer-facing$/i,
  /^security$/i,
  /^deprecation$/i,
  /^migration$/i,
  /^upgrade$/i,
];

const CUSTOMER_TITLE_PATTERNS = [
  /^(feat|feature|add|added|adds|introduce|support|enable|allow)\b/i,
  /^(fix|fixes|fixed|resolve|resolved|resolves|close|closes|closed)\b/i,
  /^(improve|improved|improves|enhance|enhanced|update|updated|updates)\b/i,
  /^(deprecate|deprecates|deprecated|remove|removes|removed|rename|renames|renamed)\b/i,
  /\bbreaking\b/i,
  /\bmigration\b/i,
  /\bbreaking change/i,
];

// ──────────────────────────────────────────────────────────────────────────────
// Category signals
// ──────────────────────────────────────────────────────────────────────────────

function inferCategory(
  item: ChangeItem
): ChangeItem["category"] {
  const text = `${item.title} ${item.description ?? ""}`.toLowerCase();
  const labelNames = item.labels.map((l) => l.toLowerCase());

  // Breaking first — highest priority.
  if (
    labelNames.some((l) => /breaking/.test(l)) ||
    /breaking|migration required|deprecated|removed?\b/.test(text)
  ) {
    return "breaking";
  }

  // New features.
  if (
    labelNames.some((l) => /^(feature|feat|enhancement)$/.test(l)) ||
    /^(feat|feature|add|adds|added|introduce|support|enable|allow)\b/.test(
      item.title.toLowerCase()
    )
  ) {
    return "new";
  }

  // Bug fixes.
  if (
    labelNames.some((l) => /^(bug|fix|bugfix)$/.test(l)) ||
    /^(fix|fixes|fixed|resolve|resolves|resolved|close|closes|closed)\b/.test(
      item.title.toLowerCase()
    )
  ) {
    return "fix";
  }

  // Internal.
  if (isLikelyInternal(item)) return "internal";

  // Default: changed.
  return "changed";
}

function isLikelyInternal(item: ChangeItem): boolean {
  // Label check.
  const hasInternalLabel = item.labels.some((l) =>
    INTERNAL_LABEL_PATTERNS.some((p) => p.test(l))
  );
  if (hasInternalLabel) return true;

  // Title check.
  if (INTERNAL_TITLE_PATTERNS.some((p) => p.test(item.title))) return true;

  // File path check: if ALL changed files are in internal paths, it's internal.
  if (item.changedFiles.length > 0) {
    const allInternal = item.changedFiles.every((f) =>
      INTERNAL_PATH_GLOBS.some((g) => minimatch(f, g, { dot: true }))
    );
    if (allInternal) return true;
  }

  return false;
}

function inferVisibility(item: ChangeItem): ChangeItem["visibility"] {
  // Check labels.
  const hasCustomerLabel = item.labels.some((l) =>
    CUSTOMER_LABEL_PATTERNS.some((p) => p.test(l))
  );
  const hasInternalLabel = item.labels.some((l) =>
    INTERNAL_LABEL_PATTERNS.some((p) => p.test(l))
  );

  if (hasCustomerLabel && hasInternalLabel) return "mixed";
  if (hasCustomerLabel) return "customer";
  if (hasInternalLabel) return "internal";

  // Title-based signals.
  const titleCustomer = CUSTOMER_TITLE_PATTERNS.some((p) =>
    p.test(item.title)
  );
  const titleInternal = INTERNAL_TITLE_PATTERNS.some((p) =>
    p.test(item.title)
  );

  if (titleCustomer && !titleInternal) return "customer";
  if (titleInternal && !titleCustomer) return "internal";
  if (titleCustomer && titleInternal) return "mixed";

  // File path signals.
  if (item.changedFiles.length > 0) {
    const internalFiles = item.changedFiles.filter((f) =>
      INTERNAL_PATH_GLOBS.some((g) => minimatch(f, g, { dot: true }))
    );
    const ratio = internalFiles.length / item.changedFiles.length;
    if (ratio === 1) return "internal";
    if (ratio > 0.5) return "mixed";
    if (ratio < 0.5) return "customer";
  }

  return "unknown";
}

// ──────────────────────────────────────────────────────────────────────────────
// Docs area mapping
// ──────────────────────────────────────────────────────────────────────────────

function loadDocsAreaMap(): DocsAreaMappingRule[] {
  const raw = yaml.load(
    readFileSync(
      resolve(CONFIG_DIR, "docs-area-map.yml"),
      "utf8"
    )
  ) as { mappings: DocsAreaMappingRule[] };
  return raw.mappings ?? [];
}

function applyDocsAreaMapping(
  item: ChangeItem,
  rules: DocsAreaMappingRule[]
): void {
  const docsAreas = new Set<string>(item.docsArea ?? []);

  for (const rule of rules) {
    const matched = item.changedFiles.some((f) =>
      rule.match.paths.some((g) => minimatch(f, g, { dot: true }))
    );
    if (!matched) continue;
    docsAreas.add(rule.docs_area);
  }

  if (docsAreas.size > 0) {
    item.docsArea = [...docsAreas];
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Main export
// ──────────────────────────────────────────────────────────────────────────────

export function classifyChanges(state: PipelineState): void {
  const items: ChangeItem[] = JSON.parse(
    readFileSync(state.normalizedFile, "utf8")
  );

  const docsAreaRules = loadDocsAreaMap();

  for (const item of items) {
    applyDocsAreaMapping(item, docsAreaRules);
    item.visibility = inferVisibility(item);
    item.category = inferCategory(item);
  }

  writeFileSync(state.classifiedFile, JSON.stringify(items, null, 2));

  const customerFacing = items.filter(
    (i) => i.visibility === "customer" || i.visibility === "mixed"
  );
  const internal = items.filter((i) => i.visibility === "internal");
  const unknown = items.filter((i) => i.visibility === "unknown");

  console.log(
    `[classify] ✓ ${items.length} items — customer: ${customerFacing.length}, internal: ${internal.length}, unknown: ${unknown.length}`
  );
}
