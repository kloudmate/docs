---
title: Search logs
description: Use KloudMate's log search to filter and explore log data across your services.
---

# Search logs

## Overview

The KloudMate log search lets you query logs using full-text search, structured filters, and time range selectors.

## Prerequisites

- At least one log source connected

## Steps

### 1. Open the Logs page

In the left navigation, select **Logs**.

### 2. Set a time range

Use the time picker in the top-right to select a time range (for example, last 1 hour).

### 3. Enter a search query

Type a search term or a structured query in the search bar. Examples:

- `error` — match logs containing the word "error"
- `level:ERROR service:api` — structured filter for ERROR-level logs from the `api` service

### 4. Add filters

Use the filter panel on the left to narrow results by service, level, or any indexed field.

### 5. Inspect a log entry

Click any log entry to expand it and see all parsed fields. From here you can:

- Jump to the linked trace (if a `trace_id` is present)
- Create an alert based on this log pattern

## Examples

Find all errors from the payment service in the last 30 minutes:

```text
level:ERROR service:payment
```

## Troubleshooting

If no results appear, confirm your time range includes when the logs were emitted and that the log source is connected.

## Related

- [Log-based alerts](/logs/log-based-alerts)
- [Logs overview](/logs/overview)
- [Traces overview](/traces/overview)
