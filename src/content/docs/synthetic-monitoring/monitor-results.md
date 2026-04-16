---
title: Monitor results
description: View and interpret synthetic monitor results and uptime history in KloudMate.
---

# Monitor results

## Overview

The monitor results page shows the history of check runs, uptime percentage, response times, and any failures.

## Prerequisites

- At least one synthetic monitor configured

## Understanding results

### Status indicators

| Status | Meaning |
|---|---|
| Up | The check passed within threshold |
| Down | The check failed (unexpected status code or timeout) |
| Degraded | The check passed but response time exceeded the threshold |

### Uptime percentage

KloudMate calculates uptime as the percentage of successful checks over the selected time period.

### Response time chart

The response time chart shows how long each check took to complete. Use this to identify latency trends.

## Steps

### 1. Open a monitor

Go to **Synthetic Monitoring** and click a monitor name.

### 2. Select a time range

Use the time picker to view results for a specific period.

### 3. Inspect a failed check

Click any red (down) data point to see the full response details, including status code and response body.

## Troubleshooting

If results look inconsistent across locations, it may indicate regional routing or CDN issues.

## Related

- [Create a monitor](/synthetic-monitoring/create-monitor)
- [Synthetic monitoring overview](/synthetic-monitoring/overview)
- [Alert channels](/alerts/alert-channels)
