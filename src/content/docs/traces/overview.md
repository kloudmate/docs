---
title: Traces overview
description: Learn how distributed tracing works in KloudMate and how to explore request flows across services.
---

# Traces overview

## Overview

KloudMate collects distributed traces that show the full journey of a request across your services. Traces help you identify latency bottlenecks and root-cause errors quickly.

## How tracing works

1. Your application emits spans using an OpenTelemetry SDK.
2. Spans are sent to the KloudMate OTLP endpoint.
3. KloudMate assembles spans into traces, linking them by `trace_id`.
4. You can search and view traces in the KloudMate console.

## Key concepts

| Term | Description |
|---|---|
| Trace | The full lifecycle of a single request |
| Span | A single unit of work within a trace |
| Parent span | The span that initiated a child span |
| Trace context | Propagated headers that link spans across services |

## Prerequisites

- At least one service instrumented with OpenTelemetry

## Next steps

- [Distributed tracing](/traces/distributed-tracing)
- [Trace search](/traces/trace-search)

## Related

- [Logs overview](/logs/overview)
- [OpenTelemetry integration](/integrations/opentelemetry)
