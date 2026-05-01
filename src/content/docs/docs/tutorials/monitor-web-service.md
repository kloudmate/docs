---
title: Monitor a web service
description: A step-by-step tutorial for setting up full observability on a web service using KloudMate.
---

This tutorial walks you through connecting a simple Node.js web service to KloudMate and setting up logs, metrics, traces, and a dashboard.

## Prerequisites

- A KloudMate account ([sign up](https://app.kloudmate.com/signup))
- A Node.js application
- `npm` installed

## Steps

### 1. Instrument the application

Install the OpenTelemetry SDK:

```bash
npm install @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node
```

Configure the SDK at application startup:

```js
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();
```

Set environment variables:

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.kloudmate.com/otlp
export OTEL_EXPORTER_OTLP_HEADERS=Authorization=Bearer <API_KEY>
export OTEL_SERVICE_NAME=my-web-service
```

### 2. Start the application

Run your application. Traces and metrics start flowing to KloudMate immediately.

### 3. Verify data in KloudMate

Open KloudMate and go to **Traces**. You should see spans from your service within a few seconds.

### 4. Create an alert

Go to **Alerts → Create rule** and set an alert for error rate > 1% over the last 5 minutes.

### 5. Build a dashboard

Go to **Dashboards → New dashboard** and add panels for request rate, error rate, and p99 latency.

## Related

- [Distributed tracing](/docs/traces/distributed-tracing)
- [OpenTelemetry integration](/docs/integrations/opentelemetry)
- [Create an alert rule](/docs/alerts/create-alert-rule)
- [Create a dashboard](/docs/dashboards/create-dashboard)
