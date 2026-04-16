---
title: Weekly Product Digest — 2026-04-13
summary: Customer-facing product and documentation-impact summary for the week of 2026-04-13.
date: 2026-04-13
period_start: 2026-04-13
period_end: 2026-04-19
type: engineering-digest
---

# Weekly KloudMate Product Digest
Period: 2026-04-13 to 2026-04-19

## Executive Summary
This week focused on improving the reliability of RPM packaging and signing for the KloudMate Agent, along with dependency updates that affect container images used in installation. Several workflow fixes were made to ensure smooth releases, while documentation for Helm, Docker, and RPM installation may need updates.

## New
_None this week._

## Changed
- **KloudMate Agent**: Updated RPM spec to fix signing issues (PR #111).
- **KloudMate Agent**: Dependency updates in go.mod/go.sum and updater Dockerfile (PR #109).
- **KloudMate Agent**: Updated Dockerfiles and Kubernetes Dockerfile to align with Go dependency changes (PR #108).

## Breaking Changes
_None this week._

## Fixes
- **KloudMate Agent**: Fixed GPG signing to work non-interactively in RPM release workflow (PR #113).
- **KloudMate Agent**: Resolved RPM signing issues by updating Helm chart, install script, and signing script (PR #105).

## Docs Impact
- **KloudMate Agent – Installation (Docker/Kubernetes)**
  - Reason: Updated Dockerfile, kube.Dockerfile, and updater.Dockerfile reflect new base images and dependency changes.
  - Likely docs area: On-Prem / Installation (Container Images)
  - Confidence: High
  - Evidence: km-agent PR #108, `Dockerfile`, `kube.Dockerfile`, `updater.Dockerfile`

- **KloudMate Agent – Helm Chart**
  - Reason: Helm chart version and dependencies adjusted for RPM signing fix.
  - Likely docs area: On-Prem / Installation (Helm)
  - Confidence: Medium
  - Evidence: km-agent PR #105, `deployment/helm/km-kube-agent/Chart.yaml`

- **KloudMate Agent – RPM Packaging**
  - Reason: RPM spec file modified to correct signing and build process.
  - Likely docs area: On-Prem / Installation (RPM Packages)
  - Confidence: Medium
  - Evidence: km-agent PR #111, `build/linux/rpm/kmagent.spec`

- **KloudMate Agent – Updater Dockerfile**
  - Reason: Dependency updates in go.mod reflected in updater.Dockerfile.
  - Likely docs area: Updater / Installation (Container Image)
  - Confidence: Low
  - Evidence: km-agent PR #109, `updater.Dockerfile`

- **KloudMate Agent – RPM Signing Script**
  - Reason: GPG signing script adjusted for non-interactive execution.
  - Likely docs area: On-Prem / Installation (RPM Signing)
  - Confidence: Low
  - Evidence: km-agent PR #113, `scripts/sign_rpm.exp`

## Internal / Excluded Notes
Excluded PR #112, #107, and #106 as they involve only CI/CD workflow changes with no direct user impact. No lock-file bumps or internal-only tooling changes were considered customer‑facing.

## Source References
- https://github.com/kloudmate/km-agent/pull/113
- https://github.com/kloudmate/km-agent/pull/112
- https://github.com/kloudmate/km-agent/pull/111
- https://github.com/kloudmate/km-agent/pull/109
- https://github.com/kloudmate/km-agent/pull/108
- https://github.com/kloudmate/km-agent/pull/107
- https://github.com/