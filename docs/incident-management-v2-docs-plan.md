# Incident Management v2 — Documentation Plan & Handoff

**Status:** Ready for docs execution
**Owner of this brief:** Engineering (handoff to docs)
**Last updated:** 2026-06-01

This is an internal planning/handoff document (it lives in `docs/`, not in `src/content/docs/`, so it is **not** published). It tells whoever writes the docs exactly which pages to create or update for the Incident Management (IM) v2 redesign, and points each one at the source code so the writing stays grounded in real behavior. Read Section 2 before touching any page.

---

## 1. What shipped in Incident Management v2

IM grew from a basic "alerts → incidents → escalation" flow into a full incident-response suite. Three features are brand new; the rest were reworked.

**New surfaces (no docs exist yet):**

- **On-Call Schedules** — layered rotations with daily/weekly/custom cadence, time restrictions, overrides, a live rotation preview, and a "who's on call now" view. *This is the largest and most complex addition — see the dedicated deep-dive in Section 5.*
- **Routing Rules (IM)** — a rule engine that decides, when an alert reaches IM, which service/escalation policy/severity an incident gets, whether to suppress it, and who to add or notify. **Not the same feature as the existing `alerts/routing-rules.mdx`** — see the disambiguation in Section 2.4.
- **Status Pages** — branded public status pages (components, incident/maintenance updates, 90-day uptime history, RSS/Atom), custom domains with DNS verification, and one-click "publish this incident to a status page."

**Reworked surfaces (docs exist, need updating):**

- **Incidents** — new activity **timeline** that merges lifecycle events and per-channel notification deliveries; responders; severity/summary editing; bulk acknowledge/resolve; incident **number** + **key**; "publish to status page."
- **Escalation Policies** — steps now target **users, on-call schedules, and Slack channels**; per-step notify methods (email/SMS/voice); retries on no-acknowledgement (ack timeout + max retries); policy-level initial wait and repeat count.
- **Alert Sources (Integrations)** — the nav now calls this **"Alert Sources"**; webhook integrations gained a **Liquid templating** system with a live template tester and sample payloads.
- **Services** — owner, default escalation policy, and SLA target.
- **Slack** — single app for both notifications and ChatOps (minor changes).

**Plan gating:** On-Call Schedules, Routing Rules, and Status Pages are gated behind workspace capabilities — see `kloudmate-frontend/src/hooks/useImFeature.ts`, which exposes `canUseOncall`, `canUseRoutingRules`, `canUseStatusPages`, plus `canUseSms`/`canUseVoice` for the SMS/voice notify methods. Treat them as paid/Pro features and add a short availability `:::note` at the top of each gated page. Confirm the exact plan names with product before publishing.

---

## 2. Before you write: grounding and conventions

### 2.1 Source code — where to verify behavior

Two repos, two feature branches. Always check the branch, not `develop`/`main`.

| Repo | Path | Branch with this work |
|---|---|---|
| Frontend | `/Users/amitava/work/kloudmate-frontend` | `feat/incident-v2` |
| Backend | `/Users/amitava/work/kloudmate-backend` | `feat/oncall-v2` |

Frontend IM module root: `src/modules/im/`. Backend IM roots: `src/routes/incident-management.ts`, `src/routes/status-page-public.ts`, `src/functions/incident-management/`, `src/services/incident-management/`, `src/dal/`.

Every page section below lists the **exact files** to read before writing it. Enumerated values (severities, statuses, rotation types, etc.) should be copied from the constants/model files in Section 6, never invented.

### 2.2 Authoring conventions (from `AGENTS.md`)

- **Format:** `.mdx`. Don't add a manual `# H1` — the `title` frontmatter renders it. Start body headings at `##`.
- **Required frontmatter:** `title` and `description` (enforced by `npm run validate:frontmatter`). Use `sidebar.label` and `sidebar.order` to control the sidebar.
- **Drafts:** add `draft: true` to keep a page out of the production build while it's missing screenshots or under review. (The existing `integrating-with-kloudmate-alerts.mdx` and `alerts/routing-rules.mdx` already use this.)
- **Folder ordering:** each section folder has a `_meta.json` like `{ "label": "...", "order": N, "collapsed": true }`. Sidebar order = folder `_meta.json` order for folders, `sidebar.order` frontmatter for leaf pages. **New folders need a `_meta.json`.**
- **Components:** `import { Steps, Tabs, TabItem, LinkCard, CardGrid } from '@astrojs/starlight/components';`. Use `<Steps>` for procedures, `:::note` / `:::tip` / `:::caution` for asides (sparingly).
- **Voice:** second person, active voice, concrete values, varied sentence length. Avoid the banned words list (powerful, seamless, leverage, simply, just, robust, …). Run the Section 9 self-review.
- **Validation before done:** `npm run validate:frontmatter`, `npm run lint:md`, `npm run build`, `npm run check:links`.

### 2.3 Images and placeholders

- Real screenshots: store next to the page in an `images/` subfolder, reference with `![alt](./images/<name>.png)`.
- **Placeholders (use these everywhere a screenshot is needed for now):** a shared placeholder image already exists at `src/content/docs/docs/_placeholders/screenshot-placeholder.png`. Follow the pattern already used in `integrating-with-kloudmate-alerts.mdx`:

  ```mdx
  :::note[Placeholder image]
  Screenshot pending — <one line describing exactly what the screenshot should show>.
  :::
  ![<alt text>](../../_placeholders/screenshot-placeholder.png)
  ```

- **Relative depth matters.** The placeholder lives in `docs/_placeholders/`. From a page inside an IM **subfolder** (e.g. `incident-management/oncall/overview.mdx`) the path is `../../_placeholders/screenshot-placeholder.png`. From a page directly under `incident-management/` (e.g. `what-is-incident-management.mdx`) it is `../_placeholders/screenshot-placeholder.png`. Verify with `npm run build` — broken image links fail the build.
- Every screenshot needed across this work is listed in the Section 7 checklist so nothing is missed when real captures arrive.

### 2.4 Terminology decisions to make first

These three naming issues will cause reader confusion if not handled deliberately. Decide each with product before writing.

1. **"Integrations" → "Alert Sources".** The product left-nav (`src/components/Sidebar/IncidentsSubMenu.js:19`) labels the integrations section **"Alert Sources"**, though the URL is still `/im/integrations`. Existing docs say "Integrations." **Recommendation:** rename the docs section heading/label to **"Alert Sources"** to match the UI, keep the folder name `integrations/`, and add a one-line "(formerly Integrations)" note in the overview. Update cross-links accordingly.

2. **Two different "Routing Rules."** There are two unrelated features with the same name:
   - **Alerts → Routing Rules** (`src/content/docs/docs/alerts/routing-rules.mdx`, already drafted): routes *alert notifications* to channels using label matchers, group-by, and cadence. Part of the alerting/notification-policy system.
   - **IM → Routing Rules** (NEW, `src/modules/im/containers/routing-rules/`): routes an *incoming alert into an incident* — picks the service, escalation policy, severity; can suppress, add responders, or notify on-call. Part of the incident pipeline.

   These are genuinely different. **Do not merge them.** The new IM page (Section 4.7) must open with a one-paragraph "this is incident routing inside IM, not alert-notification routing — see [Alerts → Routing Rules] for that" disambiguation, and the alerts page should get the reciprocal note. Mirror the product's own labels.

3. **"Alarm" → "Alert."** A recent docs commit renamed alarm → alert across the site. Keep new IM copy on **"alert"** and **"Alert Sources,"** but note that integration *types* in code still use the value `cloudwatch`/`kloudmate` and the UI labels are "CloudWatch Alarm" / "KloudMate Alarm" (Section 6). Document the labels as the user sees them.

---

## 3. Information architecture — proposed sidebar

### 3.1 Mirror the product nav

The in-product IM nav order (`src/components/Sidebar/IncidentsSubMenu.js`) is the canonical order users already know:

`Overview · Incidents · Services · Alert Sources · Escalation Policies · On-Call Schedules · Routing Rules · Status Pages · Settings`

Align the docs sidebar with this. Keep the two conceptual pages (**What Is IM?**, **Incident Lifecycle**) near the top because new readers need them before the feature pages.

### 3.2 Current vs proposed order (`incident-management/`)

| Order | Page / folder | Now | Action |
|---|---|---|---|
| 1 | `index.mdx` (Overview) | exists | **Update** (add new sections to the lists) |
| 2 | `what-is-incident-management.mdx` | exists | **Update** |
| 3 | `incident-lifecycle.mdx` | exists | **Update** (add routing rules + on-call to the flow) |
| 4 | `incidents/` | exists (order 4) | **Update** |
| 5 | `services/` | exists (order 5) | **Update** |
| 6 | `integrations/` → relabel **Alert Sources** | exists (order 7) | **Update** + change `_meta.json` order to 6, label to "Alert Sources" |
| 7 | `escalation-policy/` | exists (order 6) | **Update** + change `_meta.json` order to 7 |
| 8 | `oncall/` | — | **Create** (new folder, `_meta.json` order 8) |
| 9 | `routing-rules/` | — | **Create** (new folder, `_meta.json` order 9) |
| 10 | `status-pages/` | — | **Create** (new folder, `_meta.json` order 10) |
| 11 | `slack-integration.mdx` | exists (order 8) | **Update** + change `sidebar.order` to 11 |

The only existing `_meta.json`/order edits required: swap Alert Sources (7→6) and Escalation Policies (6→7), bump Slack to 11, and add three new folder `_meta.json` files. New `_meta.json` templates:

```json
// incident-management/oncall/_meta.json
{ "label": "On-Call Schedules", "order": 8 }
```
```json
// incident-management/routing-rules/_meta.json
{ "label": "Routing Rules", "order": 9 }
```
```json
// incident-management/status-pages/_meta.json
{ "label": "Status Pages", "order": 10 }
```

---

## 4. Page-by-page work plan

Each entry gives the action, file, what to cover, the **grounding files** to read, and the screenshots to placeholder. Reuse the existing page patterns (`incidents/creating-an-incident.mdx`, etc.) for tone and structure.

### 4.1 Overview & conceptual pages — UPDATE

**`incident-management/index.mdx`** — add the new sections to both lists.
- "In This Section": add **On-Call Schedules**, **Routing Rules**, **Status Pages**; rename **Integrations → Alert Sources**.
- Keep "Related Resources" but add a line distinguishing IM Routing Rules from Alerts Routing Rules.

**`incident-management/what-is-incident-management.mdx`** — extend "Key Components" to cover On-Call, Routing Rules, and Status Pages in one or two sentences each. Frame the full pipeline: *alert source → routing rule → service → escalation policy → on-call → incident → (optional) status page.*

**`incident-management/incident-lifecycle.mdx`** — the lifecycle diagram and prose currently go alert → integration → incident → service → escalation. Insert the **routing-rule** decision step (between alert source and incident) and the **on-call resolution** step (escalation step targets a schedule → schedule resolves to a person). Update the diagram image (placeholder for now). Add a short "Where on-call fits" and "Where routing rules fit" paragraph.
- **Grounding:** `kloudmate-backend/src/services/incident-management/integrations/webhook.ts` (the ingestion→routing→incident→escalation pipeline), Section 5 of this doc.

### 4.2 Incidents — UPDATE

**`incidents/index.mdx`** — statuses are still **Triggered → Acknowledged → Resolved**, but add: bulk acknowledge/resolve and bulk severity change from the list; filters by service, alert source, escalation policy, and "My incidents"; the incident **number** and **key** columns.
- **Grounding (frontend):** `src/modules/im/containers/incidents/List.js`, `src/modules/im/components/incidents/IncidentsTable.js`.

**`incidents/incident-details.mdx`** — this is the biggest incidents change. Cover:
- The **activity timeline** (the headline new feature): it merges *lifecycle events* (Created, Acknowledged, UnAcknowledged, Resolved, UnResolved, Assigned, Unassigned, SeverityChanged, SummaryUpdated) with *notification delivery events* (per channel: email/SMS/voice/Slack/Teams/webhook/Jira/SNS; per status: queued/sent/delivered/failed/skipped_unverified/skipped_no_credits), including step order, retry attempt, and fallback order. Explain how to read it as a single audit trail.
- **Responders** (add/remove), **severity** edit, **summary** edit.
- **Alarms** tab — the raw alert payloads that fed the incident.
- **Notes** tab.
- **"Publish to status page"** — link to the Status Pages page; this opens the publish modal.
- **Grounding (frontend):** `src/modules/im/containers/incidents/Details.js`; `src/modules/im/components/incidents/` → `IncidentLog.js` (event + delivery rendering and the channel/status enums), `incidentTimeline.js` (merge + sort logic), `IncidentNotes.js`, `AddRespondersModal.js`, `EditSeverityModal.js`, `EditSummaryModal.js`, `IncidentAlarms.js`, `PublishToStatusPageModal` (under `status-pages/`).
- **Grounding (backend):** incident model + `incident_logs`, `escalation_step_deliveries`, `incident_responders` in `kloudmate-backend/src/dal/`; actions handled at `routes/incident-management.ts` (`POST /incidents/:id/:action` → acknowledge/resolve/unacknowledge/unresolve).
- **Screenshots:** timeline with mixed lifecycle + delivery rows; responders panel; publish-to-status-page modal.

### 4.3 Services — UPDATE

**`services/index.mdx`** and **`services/creating-services.mdx`** — service now carries **owner**, **default escalation policy** (required), and **SLA target** (0–100%). The create form has: name, description (required), owner, escalation policy (with an inline "create new escalation policy" link), SLA target. Detail view lists the service's alert sources and links the escalation policy.
- **Grounding (frontend):** `src/modules/im/components/services/ServiceForm.js`, `src/modules/im/containers/services/ServiceDetails.js`, `List.js`.
- **Grounding (backend):** `im_service` model (`owner_id`, `escalation_policy_id`, `sla_target`) in `src/dal/im_service/`.
- **Screenshots:** updated create form (owner + SLA fields); service detail with alert sources table.

### 4.4 Alert Sources (Integrations) — UPDATE + relabel

**`integrations/_meta.json`** — `label` → `"Alert Sources"`, `order` → `6`.

**`integrations/index.mdx`** — relabel to Alert Sources; add the "(formerly Integrations)" note. Types: **CloudWatch Alarm**, **KloudMate Alarm**, **Webhook**. Each alert source maps an inbound payload to incident fields, routes to a **service** (required), and may set a default **escalation policy** (optional).

**`integrations/adding-integrations.mdx`** — expand the Webhook section with the new **templating system**:
- Liquid templates for **Title**, **Description**, **Severity**, **Grouping**, and **Auto-Resolve**.
- The **template tester**: pick a sample payload (CloudWatch alarm or KloudMate alarm), edit a payload, run the template, see rendered output, and open the syntax reference (variables `{{ field }}`, conditions `{% if %}`, loops `{% for %}`, filters like `| raw`).
- Note the inbound webhook URL is generated per source (a hashed `/hooks/:hash` endpoint) and CloudWatch uses SNS.
- **Grounding (frontend):** `src/modules/im/components/Integrations/IntegrationForm.js`, `TemplateTester.js`, `templateValidation.js`, and `sample-payloads/cw-alarm.json`, `km-alarm.json`.
- **Grounding (backend):** `src/services/incident-management/integrations/webhook.ts` (ingestion), `mapping.ts` (Liquid → fields); `im_integrations` model (`type`, `hash`, `config`, `service_id`, `escalation_policy_id`) in `src/dal/im_integrations/`; route `POST /hooks/:hash`.
- **Screenshots:** webhook form with template fields; template tester with a rendered result; syntax reference dialog.

**`integrations/integrating-with-kloudmate-alerts.mdx`** (currently `draft: true`) — revisit after the IM Routing Rules page (4.7) exists. This page describes wiring KloudMate alerts into IM via a notification channel + the **alerts-side** routing rule. Make sure its "Routing Rule" references clearly point at `alerts/routing-rules/` and add a "see also IM Routing Rules" cross-link so readers don't confuse the two. Keep it draft until its screenshots land.

### 4.5 Escalation Policies — UPDATE (substantial)

**`escalation-policy/index.mdx`** and **`escalation-policy/adding-escalation-policy.mdx`** — rewrite around the new model:
- **Policy** = name, description, an initial **wait time** (minutes before step 1), and a **repeat count** (how many times to loop the whole policy if nobody acknowledges).
- **Step** = one or more **recipients** plus an **escalate-after** delay (minutes before the next step fires). Recipients can be:
  - **Users** — each with notify methods **email / SMS / voice** (SMS and voice are plan- and phone-verification-gated; the UI disables them with a tooltip when unavailable).
  - **On-call schedules** — the step pages whoever is on call at fire time (gated by `canUseOncall`; UI says "On-call schedules require the Pro plan").
  - **Slack channels** — with a `fallback_order`.
- **Retries within a step** — optional ack timeout (minutes) + max retries: re-notify the same recipients until acknowledged or retries run out. Call out the gotcha the UI itself warns about: if the ack timeout ≥ escalate-after, the first retry may never run.
- Explain the end-to-end timing with a concrete example (wait 0m → Step 1 pages on-call + a backup user → 5m no ack → Step 2 pages a Slack channel + manager → repeat ×1).
- **Grounding (frontend):** `src/modules/im/components/escalation-policies/` → `PolicyForm.js`, `StepEditor.js`, `StepConnector.js` (the "escalate after / repeat from step 1" connector copy), `NotifyCheckboxes.tsx`, `RePageConfig.tsx`, `SchedulePicker.tsx`, `editorModel.js` (defaults, validation, field names). Tests in `editorModel.test.js` show the exact rules.
- **Grounding (backend):** DAL modules `escalation_policies`, `escalation_policy_logs`, `escalation_policy_step_schedules`, `escalation_step_deliveries` in `src/dal/` (step users/channels live within the escalation-policy schema/service layer); execution engine `src/services/incident-management/escalation-policy/policy.service.ts` + `queue.ts` (BullMQ delays = `wait_time_minutes`, `escalate_after_minutes`, `ack_timeout_minutes`); dispatch `src/services/notifications/handlers/incidents/escalation-policy-step/started.ts`.
- **Screenshots:** policy form with wait/repeat; a step with users + on-call schedule + Slack channel; retry config; the step connector between two steps.

### 4.6 On-Call Schedules — CREATE (new folder `oncall/`)

This is the most important new area and the one new users struggle with most. Give it **four pages** plus the worked examples from Section 5. Add the gating note at the top of each: *Available on <plan>.*

1. **`oncall/index.mdx`** (Overview, `sidebar.order: 1`) — what on-call schedules are, the mental model (schedule → layers → rotation → restrictions → overrides), the schedules list, "who's on call now" and the handoff countdown, and how schedules get used (escalation-policy steps and routing-rule on-call notifications target a schedule, which resolves to a person at notification time).
2. **`oncall/creating-a-schedule.mdx`** (`order: 2`) — the create flow end to end: name, **timezone** (everything is computed in this timezone), then add a layer. Walk the layer fields: **rotation type** (daily/weekly/custom), **rotation length** (custom only, 1–365 days), **handoff time**, **start date**, **participants** (ordered — order sets who takes which shift), and the **rotation preview** calendar. Lead with the simplest possible schedule (one weekly layer, three people) — that is the 80% case.
3. **`oncall/layers-and-restrictions.mdx`** (`order: 3`) — layered schedules and time restrictions. Explain **layer priority** (top layer wins when more than one covers a moment) and **restrictions** (none / time-of-day / day-of-week; windows may cross midnight). This is where follow-the-sun and "business hours primary + 24/7 backup" patterns live (Section 5 examples 2 and 4).
4. **`oncall/overrides.mdx`** (`order: 4`) — temporary coverage swaps: pick a user, a start/end, an optional reason. Overrides beat all layers for their window. Show the "cover a vacation" case and how to remove an override.

- **Grounding (frontend):** `src/modules/im/containers/oncall/` (`List.tsx`, `Create.tsx`, `Edit.tsx`, `Details.tsx`); `src/modules/im/components/oncall/` (`ScheduleForm.tsx` — every field, default, and validation rule; `LayerEditor.tsx`, `RestrictionsEditor.tsx`, `RotationPreview.tsx`, `OverrideDialog.tsx`, `UserPicker.tsx`, `WhoIsOnCall.tsx`); `mappers.ts` + `mappers.test.ts` (the canonical mapping of form → API, including weekly handoff-day derivation); `constants.js` (`RotationTypes`, `RestrictionTypes`, `DaysOfWeek`).
- **Grounding (backend, critical):** `kloudmate-backend/src/services/incident-management/oncall/resolver.ts` — `resolveAt` (who's on call at instant T) and `previewRange` (calendar preview). The `oncall_schedules` DAL module in `src/dal/` (layers, participants, and overrides live within the on-call schema/service layer). Routes under `/oncall/schedules` in `routes/incident-management.ts` (`/whos-on-call`, `/preview`, `/overrides`).
- **Screenshots (lots — see Section 7):** schedules list with "who's on call"; create form; layer editor with rotation type; restrictions editor; rotation preview calendar; override dialog; schedule detail with current on-call + overrides list.

Write Section 5's worked examples into pages 2–4 (don't dump them all in one place). The user specifically asked for strong examples here — they are the difference between a reader "getting" on-call and bouncing.

### 4.7 Routing Rules (IM) — CREATE (new folder `routing-rules/`)

One page is enough to start; split later if it grows. Gating note at top (`canUseRoutingRules`). **Open with the disambiguation from Section 2.4.**

**`routing-rules/index.mdx`** — cover:
- What an IM routing rule does: when an alert reaches IM (from an alert source), rules decide the incident's **service**, **escalation policy**, and **severity**, whether to **suppress** it, and whether to **add responders** or **notify on-call schedules**.
- **Scope:** workspace-wide or a single service. **Priority:** lower wins. **Enabled** toggle.
- **Matcher:** mode is **All events** / **All conditions (AND)** / **Any condition (OR)**. Conditions match on **severity**, **service**, **alert source (integration)**, **tag.<key>**, or **payload.<path>**, with operators **eq / neq / contains / regex / in / gt / lt** (availability varies by field — see Section 6).
- **Actions** and their semantics: **suppress**, **set severity**, **assign service**, **assign escalation policy** are *first-match-wins*; **add responders** and **notify on-call schedules** *accumulate* across all matching rules. (The action's code key is still `page_oncall_schedule_ids`; the UI label is "Notify on-call schedules.")
- **Rule tester:** feed a sample severity/service/payload and see the resulting routing decision (matched rules, final service/policy/severity, suppress, responders, notified on-call schedules) before saving.
- **Resolution precedence** to state plainly: rule action → alert source default → service default (for escalation policy and severity).
- **Grounding (frontend):** `src/modules/im/containers/routing-rules/` (`List.tsx`, `Create.tsx`, `Edit.tsx`); `src/modules/im/components/routing-rules/` (`RuleForm.tsx`, `MatcherBuilder.tsx`, `Condition.tsx` — per-field operator lists, `ActionPicker.tsx` — action definitions + first-match vs accumulate, `RuleTester.tsx`, `editorModel.ts` — the **authoritative** field/operator/serialization model). **Note:** `src/modules/im/constants.js` also has a `RoutingRuleFields` list, but it is stale for v2 (it shows `time_of_day`); trust `editorModel.ts` and `Condition.tsx`.
- **Grounding (backend):** routing engine `src/services/incident-management/routing/engine.ts`; `evaluateRoutingRules` called from `integrations/webhook.ts`; `incident_routing_rules` model (`matcher`, `actions`, `priority`, `service_id`) in `src/dal/`; routes `GET/POST/PATCH/DELETE /routing-rules` and `POST /routing-rules/test`.
- **Screenshots:** rules list with priority/scope; rule editor with matcher modes + conditions; action picker; rule tester with a decision result.

### 4.8 Status Pages — CREATE (new folder `status-pages/`)

Three pages: managing the page, communicating incidents, and going live on a custom domain. Gating note at top (`canUseStatusPages`).

1. **`status-pages/index.mdx`** (Overview, `order: 1`) — what a status page is and what visitors see (overall status banner, components grouped with 90-day uptime strips, active incidents, history, RSS/Atom). The editor's three tabs: **Incidents**, **Components**, **Settings**. Creating a page: name, slug, description, primary color. **Components:** name, optional group, optional **linked service** (links a component to an IM service so its status tracks the service), display order; component statuses are **operational / degraded / partial outage / major outage**. Publish/unpublish (draft vs public).
2. **`status-pages/posting-incidents.mdx`** (`order: 2`) — communicating during an incident: create a status-page incident (title, **status**: investigating/identified/monitoring/resolved; **impact**: none/minor/major/critical; affected components; public/hidden), then post **updates** over time. Also document **"Publish to status page" from an incident** (the modal pre-fills affected components from the incident's service; it is idempotent — re-publishing updates rather than duplicates).
3. **`status-pages/branding-and-custom-domain.mdx`** (`order: 3`) — branding (logo PNG/JPEG/WebP ≤2 MB ≤512 px; favicon ≤1 MB square ≤256 px; primary color; "Hide *Powered by KloudMate*" as a paid toggle) and **custom domain** setup: add a subdomain → KloudMate returns **CNAME + TXT** records → add them at your DNS provider → **Verify** → status goes pending → active; TLS is provisioned automatically. Custom domain actions are **org-owner only**. Mention the free `{slug}.{base-domain}` URL as the no-DNS option.
- **Grounding (frontend):** `src/modules/im/containers/status-pages/` (`List.tsx`, `Editor.tsx`); `src/modules/im/components/status-pages/` (all of: `PageForm.tsx`, `ComponentList.tsx`, `BrandingSection.tsx`, `LogoUploadField.tsx`, `ImageCropDialog.tsx`, `CustomDomainPanel.tsx`, `SettingsPanel.tsx`, `IncidentEditor.tsx`, `UpdateComposer.tsx`, `PublishToStatusPageModal.tsx`, `StatusBadge.tsx`, `UptimeStrip.tsx`, `StatusPagesWidget.tsx`); `statusPagesApi.ts` (every endpoint + the impact→overall-status mapping); `constants.js` (`StatusPageIncidentStatuses`, `ImpactTypes`, `ComponentStatuses`). The **public visitor view** is the separate `src/status-page-lite/` app (`StatusPage.tsx`, `IncidentPage.tsx`, `HistorySection.tsx`, `UptimeStrip.tsx`, `api.ts`) — read it to describe what visitors see, but it is internal build detail, not something to document as a feature.
- **Grounding (backend):** `src/routes/status-page-public.ts` (public `/resolve`, `/:slug`, `/history`, `/rss`, `/atom`, `/assets/:hash`, `/tls-authorize`); `src/services/incident-management/status-pages/public.ts` + `resolve.ts` (host→page resolution, custom-domain verification, caching); the `status_pages` DAL module in `src/dal/` (page fields incl. `custom_domain`, `custom_domain_status`, verification token; components, incidents, and updates live within the status-pages schema/service layer); admin routes under `/status-pages` in `routes/incident-management.ts`.
- **Note the admin/public status vocabulary mismatch:** the admin component status `degraded` is surfaced to visitors as `degraded_performance` (the public overall status enum is `operational / degraded_performance / partial_outage / major_outage`). Document the labels the relevant audience sees; don't expose internal wire values.
- **Screenshots:** pages list with health + active incidents; editor Components tab; editor Incidents tab with the update composer; Settings → Branding; Settings → Custom domain showing DNS records + verify; the public-facing status page; an uptime strip hover; an incident permalink page.

### 4.9 Slack / ChatOps — UPDATE (light)

**`slack-integration.mdx`** — bump `sidebar.order` to 11. Confirm against the current UI that the "single app for notifications + ChatOps," org-level connect, and per-user account linking still match; refresh the screenshot if the flow changed. Cross-link from Escalation Policies (Slack channel recipients) and Status Pages.
- **Grounding (frontend):** `src/modules/im/components/settings/chatOps/`, `src/modules/im/containers/settings/`.
- **Grounding (backend):** `src/services/incident-management/chat-ops/`.

---

## 5. On-call deep-dive (write these into Section 4.6 pages)

The user flagged on-call as the area most in need of clear docs and examples. This section is the spec to write from — concepts first, then a field reference, then four worked examples graded from simple to advanced. Verify every value against `ScheduleForm.tsx`, `mappers.ts`, and the backend `resolver.ts`.

### 5.1 Mental model

- A **Schedule** is a named, timezone-bound container. Everything inside is computed in the schedule's **timezone**.
- A schedule has one or more **Layers**. Each layer rotates its own ordered list of **participants** on its own cadence. Layers are **prioritized top to bottom**: when more than one layer would be on call at a moment, the **top-most layer that has someone active wins.**
- A **rotation** advances the active participant every *rotation length* at the **handoff time**, starting from the **start date**. Daily = every 1 day, weekly = every 7 days (the handoff weekday is derived from the start date), custom = every N days (1–365).
- **Restrictions** limit when a layer is "active." With no restriction the layer is always on. *Time-of-day* applies the same window every day; *day-of-week* sets per-weekday windows. Windows may cross midnight. Outside its restriction windows, a layer yields to the next layer down.
- An **Override** replaces whoever would be on call for a specific time window (optional reason). Overrides beat every layer for that window.
- **Resolution precedence:** override → layer 1 (if active) → layer 2 (if active) → … → nobody (a real, documentable outcome — if all layers are restricted out and no override covers the moment, no one is on call).

State this precedence explicitly. The single most common confusion is expecting a lower layer to be ignored when a higher layer exists, when in fact the lower layer only takes over where the higher one is restricted out or empty.

### 5.2 Field reference (one table, copy values from code)

Build a table from `ScheduleForm.tsx` and `constants.js`: Schedule (name, description, timezone); Layer (name, rotation type ∈ daily/weekly/custom, rotation length 1–365 for custom, handoff time HH:MM, start date YYYY-MM-DD, restriction type ∈ none/time-of-day/day-of-week, participants ordered); Restriction window (start, end, day 0=Sun…6=Sat for day-of-week); Override (user, start, end, reason). Note the defaults the form ships with (a new layer is weekly, 7 days, 09:00 handoff, start = today, no restriction).

### 5.3 Worked examples

Write each as a short scenario + the exact field values + what the rotation produces. Use real names and times.

**Example 1 — Simple weekly rotation (the 80% case).** One layer, weekly, handoff Monday 09:00, participants [Alice, Bob, Carol]. Result: Alice covers this week, Bob next, Carol the week after, then back to Alice; the handoff happens Monday at 09:00 in the schedule's timezone. Put this on `creating-a-schedule.mdx`.

**Example 2 — Business-hours primary with a 24/7 backup (layer priority).** Layer 1 (top): weekday day-of-week restriction Mon–Fri 09:00–17:00, participants [day-shift team]. Layer 2 (bottom): no restriction, participants [on-call engineers], weekly. Result: during business hours the primary layer is on; nights and weekends fall through to the backup layer. This teaches priority + restrictions together. Put on `layers-and-restrictions.mdx`.

**Example 3 — Override for a vacation.** Bob is on call next week but is away Wed–Thu. Add an override: user = Dana, start = Wed 00:00, end = Fri 00:00, reason "Bob PTO." Result: Dana is on call for that window only; Bob resumes Friday. Put on `overrides.mdx`.

**Example 4 — Follow-the-sun (advanced).** Two layers using time-of-day restrictions tuned to each region's working hours (e.g. Layer 1 = APAC team 00:00–08:00 UTC, Layer 2 = EMEA 08:00–16:00 UTC, Layer 3 = Americas 16:00–24:00 UTC), each with its own participants. Result: coverage rotates around the clock by region. Emphasize the timezone caveat: restriction windows are evaluated in the **schedule's** timezone, so pick the timezone deliberately and express each region's window in that timezone. Put on `layers-and-restrictions.mdx`.

### 5.4 How on-call connects to the rest of IM

Close the on-call overview by showing the link: an **escalation-policy step** or a **routing-rule "page on-call" action** targets a *schedule*, and at notification time KloudMate resolves the schedule to the person on call right then (via `resolver.ts`) and pages them through their notify methods. Cross-link to Escalation Policies and Routing Rules.

### 5.5 Gotchas to call out where readers hit them

- Timezone drives everything (handoff time, restriction windows, start date). DST shifts are handled, but the displayed handoff can land an hour off if the reader assumed local time.
- Participant **order** decides shift assignment — reordering changes who's on call when.
- All layers restricted + no override = nobody on call. Recommend a 24/7 fallback layer for any schedule used by an escalation policy that notifies it.
- Weekly rotation's handoff **weekday** comes from the **start date** — to hand off on Mondays, pick a Monday start date.

---

## 6. Enum & terminology reference (single source for writers)

Copy these verbatim into copy; don't paraphrase the values. Frontend source: `src/modules/im/constants.js` (unless noted).

- **Integration / Alert Source types** (`IntegrationTypes`): `cloudwatch` ("CloudWatch Alarm"), `kloudmate` ("KloudMate Alarm"), `webhook` ("Webhook").
- **Notification methods** (`NotificationTypes`): `email`, `slack`, `sms`, `voice`. (Per-recipient notify methods in escalation steps are email/SMS/voice; SMS/voice are plan- and phone-verification-gated.)
- **Incident severity** (`SeverityTypes`): `critical`, `high`, `medium`, `low`. (Color map: critical=error, high=warning, medium=info, low=neutral.)
- **Incident status:** Triggered → Acknowledged → Resolved (derived from `acknowledged`/`resolved` flags; not a stored enum).
- **Timeline lifecycle events** (`IncidentLog.js`): Created, Acknowledged, UnAcknowledged, Resolved, UnResolved, Assigned, Unassigned, SeverityChanged, SummaryUpdated.
- **Timeline delivery channels / statuses** (`IncidentLog.js`): channels email/SMS/voice/Slack/Teams/webhook/Jira/SNS; statuses queued/sent/delivered/failed/skipped_unverified/skipped_no_credits.
- **Rotation types** (`RotationTypes`): `daily`, `weekly`, `custom`.
- **Restriction types** (`RestrictionTypes`): `none`, `time-of-day`, `day-of-week`. **Days of week** (`DaysOfWeek`): 0=Sunday … 6=Saturday.
- **Routing rule fields/operators (authoritative: `routing-rules/editorModel.ts` + `Condition.tsx`):** fields `severity`, `service_id`, `integration_id`, `tag.<key>`, `payload.<path>`; matcher modes `always`/`all`/`any`; operators `eq`, `neq`, `contains`, `regex`, `in`, `gt`, `lt` (which apply depends on field). Actions: `suppress`, `set_severity`, `assign_service_id`, `assign_escalation_policy_id` (first-match-wins); `add_responder_user_ids`, `page_oncall_schedule_ids` (accumulate). ⚠️ Ignore `constants.js` `RoutingRuleFields` (`time_of_day`) — stale for v2.
- **Status-page incident status** (`StatusPageIncidentStatuses`): `investigating`, `identified`, `monitoring`, `resolved`.
- **Status-page impact** (`ImpactTypes`): `none`, `minor`, `major`, `critical`.
- **Component status — admin** (`ComponentStatuses`): `operational`, `degraded`, `partial_outage`, `major_outage`. **Public overall status** (status-page-lite): `operational`, `degraded_performance`, `partial_outage`, `major_outage` (note `degraded` → `degraded_performance` on the public side).

Backend DAL modules that confirm the above live in `kloudmate-backend/src/dal/`: `incidents`, `incident_logs`, `incident_responders`, `incident_alarms`, `incident_routing_rules`, `oncall_schedules`, `escalation_policies`, `escalation_policy_logs`, `escalation_policy_step_schedules`, `escalation_step_deliveries`, `im_integrations`, `im_service`, `status_pages`. Finer-grained entities (on-call layers/overrides, escalation step users/channels, status-page components/incidents/updates) live within those modules and the matching `src/services/incident-management/*` schema/service layers rather than as separate DAL folders.

---

## 7. Screenshot / placeholder checklist

Use the placeholder pattern (Section 2.3) for every row until real captures exist. Real images go in each section's `images/` folder; placeholders reference `_placeholders/screenshot-placeholder.png` at the correct relative depth.

| # | Page | Screenshot shows |
|---|---|---|
| 1 | incident-lifecycle | Updated pipeline diagram incl. routing rule + on-call |
| 2 | incidents/index | List with bulk-action toolbar + filters |
| 3 | incidents/incident-details | Activity timeline with mixed lifecycle + delivery rows |
| 4 | incidents/incident-details | Responders panel |
| 5 | incidents/incident-details | Publish-to-status-page modal |
| 6 | services/creating-services | Create form with owner + SLA target |
| 7 | services/index | Service detail with alert sources table |
| 8 | integrations/adding-integrations | Webhook form with Liquid template fields |
| 9 | integrations/adding-integrations | Template tester with rendered output |
| 10 | integrations/adding-integrations | Syntax reference dialog |
| 11 | escalation-policy/adding-escalation-policy | Policy form (wait + repeat) |
| 12 | escalation-policy/adding-escalation-policy | Step with users + on-call schedule + Slack channel |
| 13 | escalation-policy/adding-escalation-policy | Retry config + step connector |
| 14 | oncall/index | Schedules list with "who's on call" + handoff countdown |
| 15 | oncall/creating-a-schedule | Create form (timezone + first layer) |
| 16 | oncall/creating-a-schedule | Layer editor with rotation type |
| 17 | oncall/creating-a-schedule | Rotation preview calendar |
| 18 | oncall/layers-and-restrictions | Restrictions editor (day-of-week windows) |
| 19 | oncall/layers-and-restrictions | Two-layer schedule (priority) |
| 20 | oncall/overrides | Override dialog |
| 21 | oncall/overrides | Schedule detail with active overrides list |
| 22 | routing-rules/index | Rules list (priority + scope) |
| 23 | routing-rules/index | Rule editor (matcher modes + conditions) |
| 24 | routing-rules/index | Action picker |
| 25 | routing-rules/index | Rule tester with decision result |
| 26 | status-pages/index | Pages list with health + active incidents |
| 27 | status-pages/index | Editor → Components tab |
| 28 | status-pages/posting-incidents | Editor → Incidents tab with update composer |
| 29 | status-pages/branding-and-custom-domain | Settings → Branding |
| 30 | status-pages/branding-and-custom-domain | Custom domain with DNS records + verify |
| 31 | status-pages/* | Public-facing status page (visitor view) |
| 32 | status-pages/* | Uptime strip hover + incident permalink |

---

## 8. Suggested execution order

1. **Conventions + IA first:** add the three new `_meta.json` files, do the order swaps (Section 3.2), and update `incident-management/index.mdx`. This makes the new sections appear in the sidebar so subsequent pages have a home.
2. **On-Call (4.6 + Section 5)** — biggest and highest-value; do it while the model is fresh.
3. **Routing Rules (4.7)** — write the disambiguation, then the page; update the reciprocal note on `alerts/routing-rules.mdx`.
4. **Status Pages (4.8).**
5. **Escalation Policies + Incidents + Services + Alert Sources updates (4.2–4.5).**
6. **Slack + lifecycle/what-is conceptual updates (4.1, 4.9).**
7. Swap real screenshots in as they arrive; drop `draft: true` per page once its captures land.

## 9. Definition of done (per page)

- Frontmatter valid (`title` + `description`); correct `sidebar.order`; new folders have `_meta.json`.
- Behavior matches the grounding files listed for that page (don't write from this brief alone — open the code).
- Enums/values copied from Section 6 / the constants file, not paraphrased.
- Placeholders use the shared image + a `:::note[Placeholder image]` describing the capture.
- AGENTS.md self-review passed (no banned words, reader-as-subject, varied sentences).
- `npm run validate:frontmatter`, `npm run lint:md`, `npm run build`, `npm run check:links` all green.
