---
title: Distributed tracing
description: Instrument your services and explore distributed traces in KloudMate.
---

# Distributed tracing

## Overview

This guide explains how to instrument your services for distributed tracing and visualise request flows in KloudMate.

## Prerequisites

- An OpenTelemetry-compatible SDK installed in your application
- The KloudMate OTLP endpoint configured

## Steps

### 1. Instrument your application

Install the OpenTelemetry SDK for your language and configure auto-instrumentation or manual spans.

Example for Node.js:

```bash
npm install @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node
```

### 2. Configure the OTLP exporter

Set the exporter endpoint in your SDK configuration:

```bash
OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.kloudmate.com/otlp
OTEL_EXPORTER_OTLP_HEADERS=Authorization=Bearer <API_KEY>
```

### 3. Propagate trace context

Ensure your services pass trace context headers (`traceparent`, `tracestate`) between HTTP calls. Most auto-instrumentation libraries do this automatically.

### 4. View traces in KloudMate

Go to **Traces** in the KloudMate console. Use the search to find traces by service, duration, or status.

## Troubleshooting

If traces do not appear, verify the OTLP endpoint URL and confirm your API key is correct.

## Related

- [Trace search](/traces/trace-search)
- [OpenTelemetry integration](/integrations/opentelemetry)
- [Traces overview](/traces/overview)
