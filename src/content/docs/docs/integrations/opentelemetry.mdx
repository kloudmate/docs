---
title: OpenTelemetry integration
description: Send traces, metrics, and logs to KloudMate using the OpenTelemetry OTLP protocol.
---

KloudMate is fully compatible with the OpenTelemetry (OTel) standard. You can send traces, metrics, and logs to KloudMate from any OTel-instrumented application or from an OpenTelemetry Collector.

## OTLP endpoint

```text
https://ingest.kloudmate.com/otlp
```

Authentication: pass your API key as the `Authorization: Bearer <API_KEY>` header.

## Prerequisites

- A KloudMate workspace and API key
- An application instrumented with an OpenTelemetry SDK, or an OTel Collector deployment

## Steps

### Option A: Direct from application SDK

Configure the OTLP exporter in your application using environment variables:

```bash
OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.kloudmate.com/otlp
OTEL_EXPORTER_OTLP_HEADERS=Authorization=Bearer <API_KEY>
OTEL_SERVICE_NAME=my-service
```

### Option B: Via OpenTelemetry Collector

Add a KloudMate exporter to your collector configuration:

```yaml
exporters:
  otlphttp/kloudmate:
    endpoint: https://ingest.kloudmate.com/otlp
    headers:
      Authorization: "Bearer <API_KEY>"

service:
  pipelines:
    traces:
      exporters: [otlphttp/kloudmate]
    metrics:
      exporters: [otlphttp/kloudmate]
    logs:
      exporters: [otlphttp/kloudmate]
```

## Troubleshooting

If data does not appear within five minutes, check that your network allows outbound HTTPS to `ingest.kloudmate.com` and that your API key is valid.

## Related

- [Distributed tracing](/docs/traces/distributed-tracing)
- [Custom metrics](/docs/metrics/custom-metrics)
- [Integrations overview](/docs/integrations/overview)
