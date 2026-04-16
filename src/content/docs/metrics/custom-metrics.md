---
title: Custom metrics
description: Send custom application metrics to KloudMate using OpenTelemetry or the KloudMate API.
---

# Custom metrics

## Overview

In addition to infrastructure metrics, you can send custom application-level metrics to KloudMate using OpenTelemetry SDKs or the KloudMate ingest API.

## Prerequisites

- A KloudMate workspace
- An API key (found under **Settings → API keys**)

## Steps

### Option A: OpenTelemetry SDK

1. Add the OpenTelemetry SDK for your language.
2. Configure the OTLP exporter endpoint to `https://ingest.kloudmate.com/otlp`.
3. Set your API key as the `Authorization` header.
4. Emit metrics using the standard OTel Meter API.

### Option B: KloudMate ingest API

Send a POST request to the metrics ingest endpoint:

```text
POST https://ingest.kloudmate.com/v1/metrics
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

## Troubleshooting

If custom metrics do not appear, check that:

- The API key is valid.
- The metric name uses the allowed format (`namespace.metric_name`).
- Your service can reach `ingest.kloudmate.com` over HTTPS.

## Related

- [Metrics explorer](/metrics/metrics-explorer)
- [OpenTelemetry integration](/integrations/opentelemetry)
- [Metrics overview](/metrics/overview)
