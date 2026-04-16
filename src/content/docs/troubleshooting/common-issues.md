---
title: Common issues
description: Troubleshoot the most common problems encountered when using KloudMate.
---

# Common issues

## Overview

This page lists the most common issues reported by KloudMate users and their solutions.

## No data in logs, metrics, or traces

**Symptoms:** Dashboards show "No data" or the Logs page is empty.

**Checklist:**

1. Confirm the integration is connected under **Integrations**.
2. Verify the selected time range includes when the data was emitted.
3. Check that the data source is actively sending data (for example, CloudWatch logs are being written to the configured log group).
4. Confirm there are no ingestion quota limits exceeded under **Settings → Billing → Usage**.

## Alert rule never fires

**Symptoms:** An alert rule is active but no notifications are received.

**Checklist:**

1. Confirm the alert channel is correctly configured and the test notification succeeds.
2. Verify the metric or log query used in the rule returns data in the Metrics Explorer or Logs page.
3. Check that the evaluation window is long enough to capture the data.

## Integration connection fails

**Symptoms:** An AWS or Kubernetes integration shows a connection error.

**Checklist:**

1. For AWS, confirm the IAM role trust policy includes the KloudMate principal.
2. For Kubernetes, confirm the Helm chart is installed and all pods are running.
3. Verify your API key is valid and has not been revoked.

## Related

- [FAQ](/troubleshooting/faq)
- [Getting Started](/getting-started/overview)
