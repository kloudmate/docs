---
title: Quickstart
description: Connect your first service to KloudMate in minutes.
---

This guide walks you through connecting your first service to KloudMate and viewing your first observability data.

## Prerequisites

- A KloudMate account
- An active AWS account or a Kubernetes cluster (or any OpenTelemetry-compatible service)
- Permissions to create IAM roles or deploy agents

## Steps

### 1. Create a KloudMate account

Go to [app.kloudmate.com/signup](https://app.kloudmate.com/signup) and create your account.

### 2. Create a workspace

After signing in, you are prompted to create a workspace. Give it a descriptive name such as `production` or `staging`.

### 3. Connect a data source

In the left navigation, go to **Integrations** and select your platform:

- **AWS** — follow the CloudFormation stack instructions to grant read access.
- **Kubernetes** — install the KloudMate Helm chart.
- **OpenTelemetry** — configure your collector to send data to the KloudMate endpoint.

### 4. Verify data is flowing

After connecting, go to **Logs** or **Metrics** to confirm data is arriving. Allow up to five minutes for the first data points to appear.

### 5. Set up your first alert

Navigate to **Alerts → Create alert rule** and set a threshold on a metric that matters to your team.

## Examples

See the [Monitor a web service](/docs/tutorials/monitor-web-service) tutorial for a complete end-to-end example.

## Troubleshooting

If no data appears after ten minutes, check the [Common issues](/docs/troubleshooting/common-issues) guide.

## Related

- [Integrations overview](/docs/integrations/overview)
- [Create an alert rule](/docs/alerts/create-alert-rule)
- [Tutorials](/docs/tutorials/overview)
