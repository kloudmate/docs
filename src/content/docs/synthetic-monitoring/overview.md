---
title: Synthetic monitoring overview
description: Understand how KloudMate synthetic monitoring helps you proactively test uptime and API health.
---

# Synthetic monitoring overview

## Overview

Synthetic monitoring lets you run automated tests against your public-facing services from multiple locations. You define what to check, KloudMate runs the checks on a schedule, and you are alerted when something fails.

## What you can monitor

- **HTTP checks** — verify a URL returns the expected status code and response body
- **API checks** — send parameterised HTTP requests and validate JSON responses
- **SSL checks** — confirm TLS certificates are valid and not expiring soon

## How it works

1. You create a monitor with a target URL and check configuration.
2. KloudMate runs the check from one or more global locations on your chosen schedule.
3. Results are stored and displayed in the monitor dashboard.
4. If a check fails, an alert is triggered on your configured channels.

## Prerequisites

- A KloudMate workspace
- A publicly reachable URL or API endpoint

## Next steps

- [Create a monitor](/synthetic-monitoring/create-monitor)
- [Monitor results](/synthetic-monitoring/monitor-results)

## Related

- [Alerts overview](/alerts/overview)
- [Alert channels](/alerts/alert-channels)
