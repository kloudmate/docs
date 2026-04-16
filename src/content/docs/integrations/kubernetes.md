---
title: Kubernetes integration
description: Monitor your Kubernetes clusters, nodes, and pods with KloudMate.
---

# Kubernetes integration

## Overview

The KloudMate Kubernetes integration deploys a lightweight agent into your cluster using Helm. The agent collects node, pod, and container metrics, forwards logs, and exports traces via OpenTelemetry.

## Prerequisites

- A running Kubernetes cluster (EKS, GKE, AKS, or self-managed)
- `kubectl` and `helm` installed locally
- A KloudMate workspace and API key

## Steps

### 1. Add the Helm repository

```bash
helm repo add kloudmate https://charts.kloudmate.com
helm repo update
```

### 2. Install the agent

```bash
helm install kloudmate-agent kloudmate/kloudmate-agent \
  --namespace kloudmate --create-namespace \
  --set apiKey=<YOUR_API_KEY>
```

### 3. Verify the agent is running

```bash
kubectl get pods -n kloudmate
```

All pods should show `Running` status within two minutes.

### 4. View data in KloudMate

Go to **Metrics** and filter by `k8s.cluster.name` to confirm cluster data is flowing.

## Troubleshooting

If pods are in `CrashLoopBackOff`, check the agent logs with `kubectl logs -n kloudmate deployment/kloudmate-agent` and verify the API key is correct.

## Related

- [Integrations overview](/integrations/overview)
- [OpenTelemetry integration](/integrations/opentelemetry)
- [Metrics overview](/metrics/overview)
