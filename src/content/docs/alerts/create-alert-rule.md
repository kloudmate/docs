---
title: Create an alert rule
description: Learn how to create and configure alert rules in KloudMate.
---

# Create an alert rule

## Overview

Alert rules define the conditions that trigger notifications. You can create rules based on metrics, log patterns, or trace data.

## Prerequisites

- A connected data source
- At least one alert channel configured (see [Alert channels](/alerts/alert-channels))

## Steps

### 1. Open the Alerts page

In the left navigation, select **Alerts → Alert rules**.

### 2. Click Create rule

Select **Create rule** in the top-right corner.

### 3. Choose a rule type

Select one of:

- **Threshold** — triggers when a metric value crosses a limit
- **Anomaly** — triggers when behaviour deviates from baseline
- **Log-based** — triggers when a log query returns results

### 4. Configure the condition

Set the metric, query, or log filter. Define the threshold value and the evaluation window (for example, last 5 minutes).

### 5. Set severity

Choose **Critical**, **Warning**, or **Info** to reflect how urgent the alert is.

### 6. Assign channels

Select one or more alert channels to receive notifications when this rule fires.

### 7. Save the rule

Click **Save**. The rule becomes active immediately.

## Examples

Alert when error rate exceeds 5% over the last 10 minutes:

- Metric: `http.server.errors`
- Threshold: `> 5`
- Window: `10m`
- Severity: `Critical`

## Troubleshooting

If the rule never fires, verify that your data source is sending data and that the metric name is correct.

## Related

- [Alert channels](/alerts/alert-channels)
- [Alerts overview](/alerts/overview)
