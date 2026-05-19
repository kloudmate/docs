/**
 * send_slack_notification.ts
 *
 * Phase 8: Send the weekly digest summary and inline changelog text to a Slack
 * channel via an incoming webhook.
 *
 * Requires:
 *   SLACK_WEBHOOK_URL — Slack incoming webhook URL (stored as a GitHub secret)
 */

import { readFileSync } from "fs";
import type { ChangeItem, PipelineState } from "./types.js";

const SLACK_SECTION_TEXT_LIMIT = 2_800;
const SLACK_MAX_BLOCKS = 50;
const SLACK_BASE_BLOCK_COUNT = 3; // header + summary + divider
const SLACK_MAX_DIGEST_CHARS = 20_000;

interface SlackTextObject {
  type: "plain_text" | "mrkdwn";
  text: string;
  emoji?: boolean;
}

type SlackBlock =
  | { type: "header"; text: SlackTextObject & { type: "plain_text" } }
  | { type: "section"; text: SlackTextObject & { type: "mrkdwn" } }
  | { type: "divider" };

export interface SlackPayload {
  text: string;
  blocks: SlackBlock[];
}

export async function sendSlackNotification(
  state: PipelineState,
  digestContent: string
): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[slack] SLACK_WEBHOOK_URL is not set — skipping Slack notification.");
    return;
  }

  // Load classified items for summary stats.
  let items: ChangeItem[] = [];
  try {
    items = JSON.parse(readFileSync(state.classifiedFile, "utf8"));
  } catch {
    /* non-fatal — proceed without stats */
  }

  const payload = buildSlackPayload(state, items, digestContent);

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Slack webhook returned ${response.status}: ${body}`);
  }

  console.log("[slack] ✓ Notification sent to Slack.");
}

// ──────────────────────────────────────────────────────────────────────────────
// Build Slack Block Kit payload
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Build the Slack webhook payload for the weekly digest notification.
 */
export function buildSlackPayload(
  state: PipelineState,
  items: ChangeItem[],
  digestContent: string
): SlackPayload {
  const breaking = items.filter((i) => i.category === "breaking" && i.visibility !== "internal");
  const newItems = items.filter((i) => i.category === "new" && i.visibility !== "internal");
  const fixes = items.filter((i) => i.category === "fix" && i.visibility !== "internal");
  const changed = items.filter((i) => i.category === "changed" && i.visibility !== "internal");
  const docsImpact = items.filter(
    (i) => i.docsArea && i.docsArea.length > 0 && i.visibility !== "internal"
  );

  const summaryLines: string[] = [];
  if (breaking.length > 0) summaryLines.push(`⚠️ *${breaking.length} breaking change(s)*`);
  if (newItems.length > 0) summaryLines.push(`🆕 *${newItems.length} new feature(s)/improvement(s)*`);
  if (fixes.length > 0) summaryLines.push(`🐛 *${fixes.length} fix(es)*`);
  if (changed.length > 0) summaryLines.push(`🔄 *${changed.length} behavioral/config change(s)*`);
  if (docsImpact.length > 0) summaryLines.push(`📝 *${docsImpact.length} doc area(s) need review*`);
  if (summaryLines.length === 0) summaryLines.push("_No significant customer-facing changes this week._");

  const digestSections = buildDigestBlocks(digestContent);
  const blocks: SlackBlock[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `📋 Weekly Digest — ${state.weekLabel}`,
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Period:* ${state.weekStart} → ${state.weekEnd}\n\n${summaryLines.join("\n")}`,
      },
    },
    { type: "divider" },
    ...digestSections,
  ];

  return {
    text: `Weekly Digest ${state.weekLabel}: ${summaryLines.join(" | ")}`,
    blocks,
  };
}

/**
 * Convert digest markdown into Slack-compatible blocks while staying within
 * Block Kit size limits.
 */
function buildDigestBlocks(digestContent: string): SlackBlock[] {
  const digestText = capSlackDigestText(formatDigestForSlack(digestContent));
  const chunks = chunkSlackText(digestText, SLACK_SECTION_TEXT_LIMIT);
  const maxDigestBlocks = SLACK_MAX_BLOCKS - SLACK_BASE_BLOCK_COUNT;

  return chunks.slice(0, maxDigestBlocks).map((chunk) => ({
    type: "section",
    text: {
      type: "mrkdwn",
      text: chunk,
    },
  }));
}

/**
 * Strip frontmatter and low-signal metadata so Slack receives the digest body
 * rather than repo-centric wrapper content.
 */
export function formatDigestForSlack(digestContent: string): string {
  const withoutFrontmatter = digestContent
    .replace(/^---\n[\s\S]*?\n---\n*/u, "")
    .trim();

  const withoutTitle = withoutFrontmatter
    .replace(/^# .+\n+/u, "")
    .replace(/^Period: .+\n+/u, "")
    .trim();

  const withoutReferences = withoutTitle
    .replace(/\n## Source References[\s\S]*$/u, "")
    .trim();

  if (!withoutReferences) {
    return "_Digest content unavailable._";
  }

  return withoutReferences
    .split("\n")
    .map((line) => {
      if (line.startsWith("## ")) {
        return `*${line.slice(3).trim()}*`;
      }
      if (line.startsWith("### ")) {
        return `*${line.slice(4).trim()}*`;
      }
      return line;
    })
    .join("\n")
    .trim();
}

function capSlackDigestText(text: string): string {
  if (text.length <= SLACK_MAX_DIGEST_CHARS) {
    return text;
  }

  const truncatedNotice =
    "\n\n_Trimmed for Slack length limits. The full digest remains in the weekly digest file._";
  const maxBodyLength = SLACK_MAX_DIGEST_CHARS - truncatedNotice.length;
  const cutIndex = findSafeCutIndex(text, maxBodyLength);

  return `${text.slice(0, cutIndex).trimEnd()}${truncatedNotice}`;
}

function chunkSlackText(text: string, maxChunkLength: number): string[] {
  const paragraphs = text
    .split(/\n{2,}/u)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    if (paragraph.length > maxChunkLength) {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = "";
      }
      chunks.push(...splitLongParagraph(paragraph, maxChunkLength));
      continue;
    }

    const candidate = currentChunk ? `${currentChunk}\n\n${paragraph}` : paragraph;
    if (candidate.length <= maxChunkLength) {
      currentChunk = candidate;
      continue;
    }

    chunks.push(currentChunk);
    currentChunk = paragraph;
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

function splitLongParagraph(paragraph: string, maxChunkLength: number): string[] {
  const lines = paragraph.split("\n");
  const chunks: string[] = [];
  let currentChunk = "";

  for (const line of lines) {
    if (line.length > maxChunkLength) {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = "";
      }
      chunks.push(...splitLongLine(line, maxChunkLength));
      continue;
    }

    const candidate = currentChunk ? `${currentChunk}\n${line}` : line;
    if (candidate.length <= maxChunkLength) {
      currentChunk = candidate;
      continue;
    }

    chunks.push(currentChunk);
    currentChunk = line;
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

function splitLongLine(line: string, maxChunkLength: number): string[] {
  const chunks: string[] = [];
  let remaining = line.trim();

  while (remaining.length > maxChunkLength) {
    const cutIndex = findSafeCutIndex(remaining, maxChunkLength);
    chunks.push(remaining.slice(0, cutIndex).trimEnd());
    remaining = remaining.slice(cutIndex).trimStart();
  }

  if (remaining) {
    chunks.push(remaining);
  }

  return chunks;
}

function findSafeCutIndex(text: string, maxLength: number): number {
  const preferredBreaks = ["\n\n", "\n", " "];

  for (const separator of preferredBreaks) {
    const index = text.lastIndexOf(separator, maxLength);
    if (index > 0) {
      return index;
    }
  }

  return Math.max(1, maxLength);
}
