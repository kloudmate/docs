---
title: Trace search
description: Search and filter distributed traces in KloudMate to diagnose performance issues.
---

# Trace search

## Overview

The KloudMate trace search lets you find specific traces by service, operation, duration, status, or any span attribute.

## Prerequisites

- At least one service sending traces to KloudMate

## Steps

### 1. Open the Traces page

In the left navigation, select **Traces**.

### 2. Set a time range

Use the time picker to select the period to search.

### 3. Filter by service or operation

Use the filter bar to narrow results:

- **Service** — filter to a specific upstream or downstream service
- **Operation** — filter by span name or HTTP route
- **Status** — show only failed traces (`status:error`)
- **Duration** — show only slow traces (for example, `duration:>500ms`)

### 4. Select a trace

Click any trace in the list to open the flame graph. The flame graph shows each span, its duration, and parent-child relationships.

### 5. Jump to logs

From a span, click **View logs** to see correlated log entries for the same `trace_id`.

## Troubleshooting

If expected traces are missing, verify that trace context propagation is correctly configured in your services.

## Related

- [Distributed tracing](/traces/distributed-tracing)
- [Search logs](/logs/search-logs)
- [Traces overview](/traces/overview)
