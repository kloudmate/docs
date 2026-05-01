---
title: Ask AI
description: Use the KloudMate AI Assistant to ask questions about your infrastructure using natural language.
---

The Ask AI interface lets you type free-form questions and receive answers grounded in your real observability data.

## Prerequisites

- AI Assistant feature enabled for your workspace
- At least one data source connected

## Steps

### 1. Open the AI Assistant

Click the AI Assistant icon in the left navigation or press `Cmd+K` / `Ctrl+K`.

### 2. Type your question

Enter a question in plain language. Examples:

- "Show me the top 5 error messages from the last hour"
- "Is the checkout service responding slower than usual today?"
- "What changed in the API service between 2pm and 3pm?"

### 3. Review the response

The AI Assistant returns a direct answer and, where applicable, shows the underlying query it used. You can click **Open in Logs** or **Open in Metrics** to explore the data further.

### 4. Iterate

Follow-up questions are supported. The AI retains context within a single session.

## Troubleshooting

If the AI Assistant returns "I don't have enough data", ensure your data sources are connected and have data in the requested time range.

## Related

- [AI Assistant overview](/docs/ai-assistant/overview)
- [Search logs](/docs/logs/search-logs)
- [Metrics explorer](/docs/metrics/metrics-explorer)
