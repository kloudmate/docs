---
title: On-premises overview
description: Understand the KloudMate on-premises deployment option for organisations with data residency requirements.
---

# On-premises overview

## Overview

KloudMate offers an on-premises deployment for organisations that cannot send data to a SaaS service due to security, compliance, or data residency requirements. The on-premises version runs entirely within your own infrastructure.

## What is included

- Full KloudMate application stack
- Local data storage (no data leaves your environment)
- Same feature set as the SaaS offering
- Support for air-gapped deployments

## Architecture

The on-premises deployment uses Docker Compose or Kubernetes (Helm chart). All components run as containers in your environment.

## Licensing

On-premises deployments require an Enterprise licence. Contact [sales@kloudmate.com](mailto:sales@kloudmate.com) for details.

## Prerequisites

- Docker (20.10+) or Kubernetes (1.24+)
- Minimum 4 vCPUs, 16 GB RAM, 200 GB SSD storage per node
- A valid KloudMate Enterprise licence key

## Next steps

- [Installation](/on-prem/installation)
- [Configuration](/on-prem/configuration)

## Related

- [Getting Started](/getting-started/overview)
- [Integrations overview](/integrations/overview)
