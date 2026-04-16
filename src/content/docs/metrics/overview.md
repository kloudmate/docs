---
title: Metrics overview
description: Learn how KloudMate collects, stores, and lets you visualise metrics from your cloud infrastructure.
---

# Metrics overview

## Overview

KloudMate collects metrics from your infrastructure and applications, stores them as time-series data, and lets you explore them through the Metrics Explorer or custom dashboards.

## Metric sources

- **AWS CloudWatch** — EC2, RDS, Lambda, and 200+ AWS services
- **Kubernetes** — node, pod, and container metrics via kube-state-metrics
- **OpenTelemetry** — custom application metrics via OTLP
- **Prometheus** — remote-write compatible ingestion

## Metric types

| Type | Description |
|---|---|
| Counter | Monotonically increasing value (for example, request count) |
| Gauge | Point-in-time value (for example, memory usage) |
| Histogram | Distribution of values (for example, request latency) |

## Prerequisites

- At least one metrics source connected

## Next steps

- [Metrics explorer](/metrics/metrics-explorer)
- [Custom metrics](/metrics/custom-metrics)

## Related

- [Dashboards overview](/dashboards/overview)
- [Alerts overview](/alerts/overview)
