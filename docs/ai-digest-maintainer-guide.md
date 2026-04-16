---
title: AI Docs Digest — Maintainer Guide
description: How to operate, configure, and troubleshoot the weekly AI documentation digest workflow.
---

# AI Docs Digest — Maintainer Guide

This guide covers everything needed to operate the **KloudMate AI Docs Weekly Digest** workflow.

---

## Overview

The digest workflow runs every Monday at 03:30 UTC. It:

1. Collects merged PRs and direct commits from a configured list of repositories.
2. Normalizes and classifies changes (customer-facing vs. internal).
3. Calls OpenRouter to generate a structured markdown digest.
4. Commits the digest to `content/engineering-digests/{year}/{date}-weekly-digest.md`.
5. Posts a concise summary comment to the tracking issue **"Weekly Product + Docs Digest"**.
6. Uploads intermediate debug artifacts (raw data, prompt, LLM response).

---

## Repository layout

```
.github/
  workflows/
    ai-docs-weekly-digest.yml     # Workflow definition
  ai-docs-digest/
    repos.yml                     # List of repositories to analyze
    product-area-map.yml          # Maps file paths → product areas + docs areas
    docs-area-map.yml             # Supplemental docs-area path rules
    prompts/
      summarize-system.txt        # LLM system prompt
      summarize-user.txt          # LLM user prompt template (with {{placeholders}})
    scripts/
      main.ts                     # Pipeline orchestrator
      collect_changes.ts          # Phase 1 — GitHub API collection
      normalize_changes.ts        # Phase 2 — Normalize & deduplicate
      classify_changes.ts         # Phase 3 — Heuristic classification
      build_prompt.ts             # Phase 4 — Build LLM prompt
      generate_digest.ts          # Phase 5 — Call OpenRouter, validate, fallback
      commit_digest.ts            # Phase 6 — Commit markdown to repo
      post_github_summary.ts      # Phase 7 — Post tracking issue comment
      types.ts                    # Shared TypeScript types
      package.json
      tsconfig.json

content/
  engineering-digests/
    2026/
      2026-04-13-weekly-digest.md  # Example
```

---

## Adding or removing repositories

Edit `.github/ai-docs-digest/repos.yml`:

```yaml
repositories:
  - kloudmate-api
  - kloudmate-ui
  - kloudmate-collector
  - kloudmate-agent
  - kloudmate-helm
  - kloudmate-docs
```

Add or remove entries. No workflow logic changes are required.

> **Note:** The workflow uses the `GITHUB_TOKEN` of the docs repo. Repositories outside the `kloudmate` org, or private repos the token cannot access, will be skipped with a warning.

---

## Updating product / docs area mappings

Edit `.github/ai-docs-digest/product-area-map.yml` or `.github/ai-docs-digest/docs-area-map.yml`.

Each mapping rule contains:

```yaml
- match:
    repo: kloudmate-api      # optional — omit to match any repo
    paths:
      - src/alerts/**        # glob patterns matched against changed file paths
  product_area: Alerts
  docs_areas:
    - Alerts / Rule configuration
```

Rules are evaluated **top to bottom**; the first match wins for `product_area`.
Multiple `docs_areas` entries from different matching rules are merged.

---

## Running manually (workflow_dispatch)

1. Go to **Actions → AI Docs Weekly Digest → Run workflow**.
2. Optionally enter a `week_start` date (`YYYY-MM-DD`, must be a Monday).
3. Leave blank to default to the most recent Monday.

This is useful for:
- Re-generating a digest after improving prompts or mappings.
- Testing the workflow after changes.
- Generating a digest for a past week.

---

## Running locally for testing

```bash
cd .github/ai-docs-digest/scripts
npm install

# Set required env vars
export GITHUB_TOKEN="ghp_..."
export GITHUB_REPOSITORY="kloudmate/docs"
export OPENROUTER_API_KEY="sk-or-..."
export WEEK_START="2026-04-13"          # optional
export ARTIFACTS_DIR="/tmp/test-digest"

# Run all phases
npx tsx main.ts

# Or run individual phases:
npx tsx main.ts collect    # collect GitHub data only
npx tsx main.ts generate   # build prompt + call LLM
npx tsx main.ts commit     # commit markdown to repo via API
npx tsx main.ts post       # post tracking issue comment
```

Intermediate files are written to `ARTIFACTS_DIR`:
- `raw-prs.json` — raw PR data per repo
- `raw-commits.json` — raw commit data per repo
- `normalized-changes.json` — normalized ChangeItem array
- `classified-changes.json` — classified ChangeItem array with area/visibility/category
- `llm-prompt.txt` — full prompt sent to the LLM
- `llm-response.md` — raw response from the LLM
- `pipeline-state.json` — resolved dates and file paths

---

## Rotating secrets

### OPENROUTER_API_KEY

1. Generate a new API key at [openrouter.ai/keys](https://openrouter.ai/keys).
2. In the docs repo, go to **Settings → Secrets and variables → Actions**.
3. Update the `OPENROUTER_API_KEY` secret.

### Changing the LLM model

1. Go to **Settings → Secrets and variables → Actions → Variables**.
2. Set (or create) a variable named `OPENROUTER_MODEL`.
3. Example values:
   - `anthropic/claude-3.5-sonnet` (default)
   - `openai/gpt-4o`
   - `google/gemini-pro-1.5`

---

## Fallback mode

If the OpenRouter API call fails (network error, quota, invalid key), the pipeline automatically falls back to a **heuristic-only digest**. The fallback digest:

- Uses the same required section headings.
- Groups changes by category (New / Changed / Breaking / Fixes) from the heuristic classification.
- Is clearly marked `generated_by: fallback-heuristic` in the frontmatter.
- Is still committed and posted to the tracking issue.

---

## Debugging failures

1. Open the failed workflow run on GitHub Actions.
2. Expand the failing step to read the log output.
3. Download the **digest-artifacts** artifact for raw intermediate data.
4. Re-run with `workflow_dispatch` and a specific `week_start` after fixing the issue.

Common failure reasons:

| Symptom | Likely cause |
|---|---|
| `GITHUB_TOKEN` errors | Token permissions — check `contents: write` and `issues: write` |
| `404` on repo fetch | Repo name typo in `repos.yml`, or repo not accessible |
| LLM response missing sections | Model changed behaviour — check `llm-response.md` artifact; sections are auto-repaired |
| Digest not committed | `GITHUB_REPOSITORY` env var not set; or content unchanged (idempotent skip) |

---

## Idempotency

Running the workflow twice for the same week:
- If the digest content is unchanged → the commit step skips without error.
- If the digest content changed (e.g. after a re-run with updated prompts) → the file is updated in place.
- A new tracking issue comment is always posted (even on re-runs).

---

## Security notes

- The workflow runs with `contents: write` and `issues: write` only.
- The `OPENROUTER_API_KEY` is stored as a GitHub Actions secret and never logged or included in artifacts.
- PR body and commit message content is passed to the LLM; avoid committing secrets in commit messages.
- Prompt size is capped to avoid runaway token costs (~30k tokens).
