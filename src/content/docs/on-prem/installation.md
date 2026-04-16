---
title: On-premises installation
description: Install KloudMate on your own infrastructure using Docker Compose or Kubernetes.
---

# On-premises installation

## Overview

This guide walks you through installing KloudMate on-premises using the provided Docker Compose bundle or the official Helm chart.

## Prerequisites

- A valid KloudMate Enterprise licence key
- Docker 20.10+ or Kubernetes 1.24+
- Minimum 4 vCPUs, 16 GB RAM, 200 GB SSD per node

## Steps

### Option A: Docker Compose

#### 1. Download the bundle

Contact [support@kloudmate.com](mailto:support@kloudmate.com) to receive the installation bundle and licence key.

#### 2. Extract the bundle

```bash
tar -xzf kloudmate-onprem.tar.gz
cd kloudmate-onprem
```

#### 3. Set the licence key

```bash
echo "KLOUDMATE_LICENCE_KEY=<YOUR_KEY>" > .env
```

#### 4. Start the services

```bash
docker compose up -d
```

#### 5. Access the console

Open `http://localhost:3000` in your browser.

### Option B: Kubernetes (Helm)

#### 1. Add the Helm repository

```bash
helm repo add kloudmate https://charts.kloudmate.com
helm repo update
```

#### 2. Install the chart

```bash
helm install kloudmate kloudmate/kloudmate-onprem \
  --namespace kloudmate --create-namespace \
  --set licence.key=<YOUR_KEY>
```

#### 3. Check pod status

```bash
kubectl get pods -n kloudmate
```

## Troubleshooting

If services fail to start, verify resource limits and check logs with `docker compose logs` or `kubectl logs`.

## Related

- [Configuration](/on-prem/configuration)
- [On-premises overview](/on-prem/overview)
