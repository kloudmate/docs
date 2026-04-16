---
title: Logs overview
description: Understand how KloudMate collects and lets you search log data from your services.
---

# Logs overview

## Overview

KloudMate centralises logs from all your services and infrastructure into a single searchable interface. You can filter, search, and analyse logs in real time or explore historical data.

## How log ingestion works

Logs are ingested via:

- **CloudWatch Logs** — for AWS-native services
- **Kubernetes log forwarding** — via the KloudMate agent or Fluent Bit
- **OpenTelemetry Logs** — via an OTLP endpoint

Logs are parsed, indexed, and made available within seconds.

## Log fields

Every log entry includes:

| Field | Description |
|---|---|
| `timestamp` | When the log was emitted |
| `level` | Severity (INFO, WARN, ERROR) |
| `message` | The log text |
| `service` | Source service name |
| `trace_id` | Linked trace ID (if available) |

## Prerequisites

- At least one log source connected

## Next steps

- [Search logs](/logs/search-logs)
- [Log-based alerts](/logs/log-based-alerts)

## Related

- [Traces overview](/traces/overview)
- [Alerts overview](/alerts/overview)
