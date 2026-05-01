---
title: Alerts overview
description: Understand how KloudMate alerts work and how to get started with alert rules and channels.
---

KloudMate alerts notify your team when something goes wrong in your infrastructure or applications. You define thresholds or anomaly conditions, and KloudMate sends notifications through your preferred channels.

## How alerts work

1. You create an **alert rule** — a condition evaluated on a metric, log query, or trace data.
2. When the condition is met, KloudMate triggers an **alert event**.
3. The alert event is routed to one or more **alert channels** (Slack, PagerDuty, email, and so on).

## Alert types

| Type | Description |
|---|---|
| Threshold | Triggers when a value crosses a fixed threshold |
| Anomaly | Triggers when a value deviates from baseline |
| Log-based | Triggers when a log pattern matches |
| Composite | Combines multiple conditions |

## Prerequisites

- At least one connected data source
- An alert channel configured

## Next steps

- [Create an alert rule](/docs/alerts/create-alert-rule)
- [Configure alert channels](/docs/alerts/alert-channels)

## Related

- [Logs overview](/docs/logs/overview)
- [Metrics overview](/docs/metrics/overview)
