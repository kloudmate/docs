---
title: FAQ
description: Answers to frequently asked questions about KloudMate.
---

# FAQ

## General

### What is KloudMate?

KloudMate is a unified observability platform for cloud infrastructure and applications. It provides logs, metrics, traces, dashboards, alerts, and synthetic monitoring in a single product.

### Is there a free plan?

Yes. The Free plan supports up to 3 users, 7-day data retention, and the most commonly used integrations. See [Billing overview](/billing/overview) for details.

### Where is my data stored?

For SaaS customers, data is stored in KloudMate-managed infrastructure in the region you select at workspace creation. For on-premises customers, data stays entirely within your own environment.

## Integrations

### Which AWS services does KloudMate support?

KloudMate supports over 200 AWS services through CloudWatch. See the [AWS integration](/integrations/aws) guide for details.

### Can I use KloudMate with Prometheus?

Yes. KloudMate accepts Prometheus remote-write. Configure your Prometheus instance to remote-write to the KloudMate ingest endpoint.

## Alerts

### How quickly are alerts triggered?

Alert rules are evaluated every minute by default. The actual time to notification also depends on your alert channel's delivery latency.

### Can I silence alerts during maintenance?

Yes. You can set a silence window on any alert rule from the Alerts page.

## Related

- [Common issues](/troubleshooting/common-issues)
- [Getting Started](/getting-started/overview)
- [Billing overview](/billing/overview)
