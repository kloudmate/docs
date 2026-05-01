---
title: Usage and limits
description: Monitor your KloudMate data ingestion usage and understand plan limits.
---

KloudMate tracks your monthly data ingestion across logs, metrics, and traces. You can view your current usage and remaining allowance in the billing dashboard.

## Viewing usage

Go to **Settings → Billing → Usage**. The usage page shows:

- Ingested logs (GB) for the current billing period
- Ingested metrics (million data points) for the current billing period
- Ingested traces (million spans) for the current billing period
- Percentage of plan limit consumed

## Plan limits

| Plan | Logs | Metrics | Traces |
|---|---|---|---|
| Free | 5 GB/month | 100M points/month | 50M spans/month |
| Pro | 100 GB/month | 1B points/month | 500M spans/month |
| Enterprise | Custom | Custom | Custom |

## What happens when you exceed limits

- **Free** — ingestion is paused until the next billing period.
- **Pro** — additional usage is charged at the overage rate shown in your plan details.
- **Enterprise** — governed by your contract terms.

## Reducing usage

To reduce ingestion volume:

- Filter unnecessary logs at the source
- Increase metrics scrape intervals
- Use head-based sampling for traces

## Related

- [Manage subscription](/docs/billing/manage-subscription)
- [Billing overview](/docs/billing/overview)
