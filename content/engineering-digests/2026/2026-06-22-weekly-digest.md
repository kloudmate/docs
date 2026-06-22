---
title: Weekly Product Digest — 2026-06-22
summary: Customer-facing product and documentation-impact summary for the week of 2026-06-22.
date: 2026-06-22
period_start: 2026-06-22
period_end: 2026-06-28
type: engineering-digest
---

# Weekly KloudMate Product Digest
Period: 2026-06-22 to 2026-06-28

## Executive Summary
This week’s customer-facing updates include a fix for RUM stat panels that incorrectly showed “0” when no data was available, the addition of filter and sort capabilities to the Issue Tracker, and a change to the default time range across API Monitoring, Logs, and Traces modules to 1 hour.

## New
_None this week._

## Changed
- **Issue Tracker**: Added filter and sort capabilities to the issues list.
- **UI Time Range**: Changed default time range to 1 hour for API Monitoring, Logs, and Traces modules.

## Breaking Changes
_None this week._

## Fixes
- **RUM**: Fixed stat panels showing "0" instead of "No Data" when no data is available.

## Docs Impact
- **RUM (Real User Monitoring)**
  - Reason: UI text change from showing "0" to "No Data" in stat panels when no data is present.
  - Likely docs area: RUM dashboard documentation, stat panel reference.
  - Confidence: Medium
  - Evidence: kloudmate-frontend PR #938, `src/modules/rum/components/NetworkResponseTime.js`, `src/modules/rum/components/Stats.js`
- **Issue Tracker**
  - Reason: Added filter and sort UI controls to the issues list, changing how users interact with issue data.
  - Likely docs area: Issue Tracker user guide, filtering and sorting section.
  - Confidence: Medium
  - Evidence: kloudmate-frontend commit 2b95832, `src/graphql/issues/queries.js`, `src/modules/api-monitoring/components/EndpointsTable.tsx`, `src/modules/issue-tracker/Issues.js`
- **UI Time Range (API Monitoring, Logs, Traces)**
  - Reason: Changed default time range from unspecified to 1 hour across multiple modules, affecting initial view.
  - Likely docs area: Time picker settings documentation for each module; default configuration.
  - Confidence: Medium
  - Evidence: kloudmate-frontend commit e7c9ce4, `src/modules/api-monitoring/containers/ApiMonitoring.tsx`, `src/modules/logs/Logs.js`, `src/modules/traces/components/SearchBar/index.js`, `src/modules/traces/components/TraceGroups/index.tsx`, `src/modules/traces/containers/Traces.js`, `src/modules/traces/utils/filterStore.js`

## Internal / Excluded Notes
_None._ (All changes in the data are customer-facing; no internal-only changes were excluded.)

## Source References
- https://github.com/kloudmate/kloudmate-frontend/pull/938
- https://github.com/kloudmate/kloudmate-frontend/commit/2b958321d09cdaa5699da3db5392d7a7058389ec
- https://github.com/kloudmate/kloudmate-frontend/commit/e7c9ce443bab0d9a38d58745f0b16c9ae6fdb606