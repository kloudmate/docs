---
title: Weekly Product Digest — 2026-07-20
summary: Customer-facing product and documentation-impact summary for the week of 2026-07-20.
date: 2026-07-20
period_start: 2026-07-20
period_end: 2026-07-26
type: engineering-digest
---

# Weekly KloudMate Product Digest
Period: 2026-07-20 to 2026-07-26

## Executive Summary
This week, KloudMate enhanced its eBPF-based network monitoring in the km-agent, adding VPC details and enabling the feature by default. Updates include daemonset configuration changes and documentation revisions for the eBPF network flows guide. No new features, breaking changes, or user-visible fixes were reported.

## New
_None this week._

## Changed
- **eBPF network monitoring**: Added daemonset configuration for eBPF network monitoring and updated default settings.
- **eBPF VPC details**: Enabled eBPF monitoring by default and added VPC details to the collected data.

## Breaking Changes
_None this week._

## Fixes
_None this week._

## Docs Impact
- **eBPF network monitoring (Agent)**
  - Reason: Documentation file for eBPF network flows was updated alongside code changes.
  - Likely docs area: Agent v2 LLD eBPF network flows
  - Confidence: High
  - Evidence: km-agent commit fc90fd6652c3fbbed7ac1b9547d27ab22afae316, `docs/agentv2/lld/lld-ebpf-network-flows.md`

- **eBPF network monitoring (Agent)**
  - Reason: Documentation updated to reflect VPC details and default enablement.
  - Likely docs area: Agent v2 LLD eBPF network flows
  - Confidence: High
  - Evidence: km-agent commit 8bbaf0e3d0e6912bf94beaef18ab18adff82f5d8, `docs/agentv2/lld/lld-ebpf-network-flows.md`

## Internal / Excluded Notes
_None._

## Source References
- https://github.com/kloudmate/km-agent/commit/fc90fd6652c3fbbed7ac1b9547d27ab22afae316
- https://github.com/kloudmate/km-agent/commit/8bbaf0e3d0e6912bf94beaef18ab18adff82f5d8