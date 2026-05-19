import assert from "node:assert/strict";
import test from "node:test";

import {
  buildSlackPayload,
  formatDigestForSlack,
} from "./send_slack_notification.js";
import type { ChangeItem, PipelineState } from "./types.js";

const baseState: PipelineState = {
  weekStart: "2026-05-18",
  weekEnd: "2026-05-24",
  weekLabel: "2026-05-18",
  org: "kloudmate",
  rawPRsFile: "/tmp/raw-prs.json",
  rawCommitsFile: "/tmp/raw-commits.json",
  normalizedFile: "/tmp/normalized.json",
  classifiedFile: "/tmp/classified.json",
  promptFile: "/tmp/prompt.txt",
  llmResponseFile: "/tmp/llm-response.md",
  digestFile: "content/engineering-digests/2026/2026-05-18-weekly-digest.md",
  digestAbsPath: "/tmp/2026-05-18-weekly-digest.md",
};

test("formatDigestForSlack removes wrapper metadata and source references", () => {
  const digest = `---
title: Weekly Product Digest — 2026-05-18
summary: Customer-facing product and documentation-impact summary.
---

# Weekly KloudMate Product Digest
Period: 2026-05-18 to 2026-05-24

## Executive Summary
Digest summary text.

## Changed
- **Progress styling** – Updated the appearance of progress bars.

## Source References
- https://github.com/kloudmate/kloudmate-frontend/commit/123
`;

  const formatted = formatDigestForSlack(digest);

  assert.equal(
    formatted,
    [
      "*Executive Summary*",
      "Digest summary text.",
      "",
      "*Changed*",
      "- **Progress styling** – Updated the appearance of progress bars.",
    ].join("\n")
  );
});

test("buildSlackPayload inlines digest blocks instead of a repo link", () => {
  const items: ChangeItem[] = [
    {
      repo: "kloudmate-frontend",
      sourceType: "commit",
      id: "abc123",
      title: "Adjust progress styling",
      mergedOrCommittedAt: "2026-05-19T00:00:00Z",
      labels: [],
      changedFiles: ["src/components/PercentageProgress/index.js"],
      category: "changed",
      visibility: "customer",
      evidence: {
        refs: ["https://github.com/kloudmate/kloudmate-frontend/commit/abc123"],
      },
    },
  ];

  const digest = `---
title: Weekly Product Digest — 2026-05-18
summary: Customer-facing product and documentation-impact summary.
---

# Weekly KloudMate Product Digest
Period: 2026-05-18 to 2026-05-24

## Executive Summary
Digest summary text.

## Changed
- **Progress styling** – Updated the appearance of progress bars.
`;

  const payload = buildSlackPayload(baseState, items, digest);

  assert.match(payload.text, /Weekly Digest 2026-05-18/u);
  assert.equal(payload.blocks[2]?.type, "divider");

  const digestSection = payload.blocks[3];
  assert.equal(digestSection?.type, "section");
  assert.match(
    String("text" in (digestSection ?? {}) ? digestSection.text.text : ""),
    /\*Executive Summary\*/u
  );

  const serialized = JSON.stringify(payload);
  assert.doesNotMatch(serialized, /View full digest/u);
});
