---
title: Log-based alerts
description: Create alert rules that trigger when log queries match specific patterns in KloudMate.
---

# Log-based alerts

## Overview

Log-based alerts allow you to trigger notifications when a log query returns results — for example, when a specific error message appears in your logs.

## Prerequisites

- At least one log source connected
- An alert channel configured (see [Alert channels](/alerts/alert-channels))

## Steps

### 1. Create an alert rule

Go to **Alerts → Create rule** and select **Log-based** as the rule type.

### 2. Write a log query

Enter the log query that should trigger the alert. For example:

```text
level:ERROR message:"OutOfMemoryError"
```

### 3. Set the evaluation window

Choose how far back to search when evaluating the condition (for example, last 5 minutes).

### 4. Set the threshold

Define how many matching log entries should trigger the alert (for example, more than 0 occurrences).

### 5. Assign channels and save

Assign one or more alert channels and click **Save**.

## Troubleshooting

If the alert never fires, test your query in the Logs page to confirm it returns results during the expected window.

## Related

- [Search logs](/logs/search-logs)
- [Create an alert rule](/alerts/create-alert-rule)
- [Alert channels](/alerts/alert-channels)
