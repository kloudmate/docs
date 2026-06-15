---
title: Weekly Product Digest — 2026-06-15
summary: Customer-facing product and documentation-impact summary for the week of 2026-06-15.
date: 2026-06-15
period_start: 2026-06-15
period_end: 2026-06-21
type: engineering-digest
---

# Weekly KloudMate Product Digest
Period: 2026-06-15 to 2026-06-21

## Executive Summary
This week focused on improving alert group functionality: backend aggregation of instance counts, UI fixes for display and navigation, and bug fixes to alert grouping logic and root cause analysis. No breaking changes were introduced.

## New
_None this week._

## Changed
- **Alert Groups**: Added instance count aggregation for alarm groups in the backend.
- **Alert Groups**: Fixed alert group instance count display in the UI.
- **Alert Groups UI**: Applied UI fixes to alert group detail pages (tabs, panels, sidebar).

## Breaking Changes
_None this week._

## Fixes
- **Alert Grouping**: Fixed RCA bug that caused incorrect root cause analysis in alert groups.
- **Alert Grouping**: Fixed alert grouping bug affecting notification and state handling.

## Docs Impact
- **Alarm Groups**
  - Reason: Backend addition of instance count aggregation and frontend fix for instance count display may require updates to documentation describing alarm group metrics and UI.
  - Likely docs area: Alerting > Alarm Groups documentation (e.g., "Alarm Groups Overview", "Viewing Alarm Group Details")
  - Confidence: High
  - Evidence: kloudmate-backend commit fd0ef86f053c72ec48ed4745e8335dea65a5df17, kloudmate-frontend commit c6ad1ba703667ae190f9a13773399ae5b1974b31; `hasura-kloudmate/metadata/databases/default/tables/public_alarm_groups.yaml`, `src/modules/alarms/groups/instances.ts`
- **Alarm Groups UI**
  - Reason: UI fixes to alarm group tabs, panels, and sidebar may affect screenshots and step-by-step guides in the UI documentation.
  - Likely docs area: Alerting > Alarm Groups UI guide
  - Confidence: Medium
  - Evidence: kloudmate-frontend commit 812e7933ce21a503df12f41e5e26580fa365f86a; `src/modules/alarms/components/groups/GroupAlertsTab.tsx`, `src/modules/alarms/components/groups/GroupInstancesPanel.tsx`
- **Alert Grouping Logic**
  - Reason: Fixes to RCA bug and general alert grouping behavior may impact documentation on alert grouping rules, RCA, and incident correlation.
  - Likely docs area: Alerting > Alert Grouping and RCA
  - Confidence: Medium
  - Evidence: kloudmate-backend commit a680907daac73955b11bd06cc775808551800872, kloudmate-backend commit a2540271d8904de64211161c83dc564917ebb180; `src/apps/alarms-service/src/grouping/lib/dispatch.ts`, `src/apps/alarms-service/src/lib/notifiableStates.ts`

## Internal / Excluded Notes
_None._  

## Source References
- https://github.com/kloudmate/kloudmate-frontend/commit/c6ad1ba703667ae190f9a13773399ae5b1974b31
- https://github.com/kloudmate/kloudmate-backend/commit/fd0ef86f053c72ec48ed4745e8335dea65a5df17
- https://github.com/kloudmate/kloudmate-backend/commit/a680907daac73955b11bd06cc775808551800872
- https://github.com/kloudmate/kloudmate-frontend/commit/812e7933ce21a503df12f41e5e26580fa365f86a
- https://github.com/kloudmate/kloudmate-backend/commit/a2540271d8904de64211161c83dc564917ebb180