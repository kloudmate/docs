---
title: Weekly Product Digest — 2026-06-29
summary: Customer-facing product and documentation-impact summary for the week of 2026-06-29.
date: 2026-06-29
period_start: 2026-06-29
period_end: 2026-07-05
type: engineering-digest
---

# Weekly KloudMate Product Digest
Period: 2026-06-29 to 2026-07-05

## Executive Summary
This week saw the Profiling feature finalized and a CPU profile exporter typo fixed, enhancing observability capabilities. Additionally, report generation and loading issues were resolved, and alert notification links were corrected to point to the correct group.

## New
_None this week._

## Changed
- **Profiling feature** – Finalized the Profiling feature, adding new endpoints and query capabilities.
- **CPU profile exporter** – Fixed a typo in the CPU profile exporter configuration (`exporter_profiles.go`).

## Breaking Changes
_None this week._

## Fixes
- **Report generation** – Fixed a bug causing report generation failures in the dashboard panel.
- **Report loading** – Fixed report loading issues and corrected alert notification links to point to the appropriate group.

## Docs Impact
- **Profiling feature**
  - Reason: Finalizing the Profiling feature adds new capabilities and may change existing behavior.
  - Likely docs area: Profiling documentation
  - Confidence: High
  - Evidence: kloudmate-backend PR #762, `src/datasources/kloudmate/profiles/index.ts`, `src/datasources/kloudmate/profiles/queries.ts`
- **CPU profile exporter**
  - Reason: Fixes a typo in the CPU profile exporter configuration; may affect documentation of exporter settings.
  - Likely docs area: OTel Exporter configuration
  - Confidence: Low
  - Evidence: kloudmate-otel-backend PR #622, `packages/otel-collector/exporters/kmexporter/exporter_profiles.go`
- **Report generation**
  - Reason: Fixes a bug in report generation UI; may clarify usage instructions.
  - Likely docs area: Dashboard reports guide
  - Confidence: Low
  - Evidence: kloudmate-frontend commit a6809dfc822bc056cd59866100d17fb1782110ef, `src/modules/dashboards/components/Panel.js`
- **Report loading and alert notifications**
  - Reason: Fixes report loading and corrects alert notification links; impacts user guides.
  - Likely docs area: Reports and Alerting documentation
  - Confidence: Medium
  - Evidence: kloudmate-backend commit 02499b4fbdc6b72a0aadfeacf4aad348382dcc33, `src/services/reports/DashboardReport.ts`, `src/services/grouping/lifecyclePayload.ts`

## Internal / Excluded Notes
_None._ All changes in this period were customer-facing; no internal-only changes were identified.

## Source References
- https://github.com/kloudmate/kloudmate-frontend/commit/a6809dfc822bc056cd59866100d17fb1782110ef
- https://github.com/kloudmate/kloudmate-backend/commit/02499b4fbdc6b72a0aadfeacf4aad348382dcc33
- https://github.com/kloudmate/kloudmate-backend/pull/762
- https://github.com/kloudmate/kloudmate-otel-backend/pull/622