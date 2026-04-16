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
This week focused on improving the reliability of the KloudMate Agent release process, particularly around RPM signing and dependency management. Several CI workflow fixes and Go dependency updates were applied to ensure consistent builds and correct packaging. Documentation for on‑premises installation may need updates due to changes in Dockerfiles, Helm charts, and install scripts.

## New
_None this week._

## Changed
- **KloudMate Agent** – Updated RPM spec and release workflow to improve signing reliability. (PR #111)
- **KloudMate Agent** – Updated Go dependencies and updater Docker image to latest versions. (PR #109)
- **KloudMate Agent** – Fixed Go dependencies in multiple Dockerfiles and release workflow to ensure correct builds. (PR #108)

## Breaking Changes
_None this week._

## Fixes
- **KloudMate Agent** – Fixed GPG signing in release workflow to run non‑interactively. (PR #113)
- **KloudMate Agent** – Fixed GitHub workflows for publishing config updater and release. (PR #112)
- **KloudMate Agent** – Updated CI runner to use Go 1.25.8 for builds. (PR #107)
- **KloudMate Agent** – Removed unnecessary dependency in RPM signing workflow. (PR #106)
- **KloudMate Agent** – Fixed RPM signing process, including Helm chart and install script updates. (PR #105)

## Docs Impact
- **KloudMate Agent – On‑Prem / Installation**
  - Reason: Changes to Dockerfiles, Helm chart, and install scripts affect how customers install and run the agent.
  - Likely docs area: Installation and configuration guides for Linux/Kubernetes.
  - Confidence: Medium
  - Evidence: km-agent PR #108, `Dockerfile`, `kube.Dockerfile`, `updater.Dockerfile`; PR #105, `deployment/helm/km-kube-agent/Chart.yaml`, `scripts/install_linux.sh`
- **KloudMate Agent – Dependency & Compatibility**
  - Reason: Go version and dependency updates may impact build compatibility notes.
  - Likely docs area: Build prerequisites and compatibility matrix.
  - Confidence: Low
  - Evidence: km-agent PR #107, `.github/workflows/release.yml`, `go.mod`; PR #109, `go.mod`, `go.sum`, `updater.Dockerfile`

## Internal / Excluded Notes
_No internal-only changes were excluded; all listed changes have visibility or impact on customer‑facing artifacts (packages, images, installation)._

## Source References
- https://github.com/kloudmate/km-agent/pull/113
- https://github.com/kloudmate/km-agent/pull/112
- https://github.com/kloudmate/km-agent/pull/111
- https://github.com/kloudmate/km-agent/pull/109
- https://github.com/kloudmate/km-agent/pull/108
- https://github.com/kloudmate/km-agent/pull/107
- https://github.com/kloudmate/km-agent/pull/106
- https://github.com/kloudmate/km-agent/pull/105