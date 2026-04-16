/**
 * send_slack_notification.ts
 *
 * Phase 8: Send a concise weekly digest summary to a Slack channel via an
 * incoming webhook.
 *
 * Requires:
 *   SLACK_WEBHOOK_URL — Slack incoming webhook URL (stored as a GitHub secret)
 */

import { readFileSync } from "fs";
import type { ChangeItem, PipelineState } from "./types.js";

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

function buildSlackPayload(
  state: PipelineState,
  items: ChangeItem[],
  _digestContent: string
): object {
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

  const repoUrl = process.env.GITHUB_REPOSITORY
    ? `https://github.com/${process.env.GITHUB_REPOSITORY}/blob/main/${state.digestFile}`
    : undefined;

  const blocks: object[] = [
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
  ];

  if (repoUrl) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<${repoUrl}|View full digest>`,
      },
    });
  }

  return { blocks };
}
