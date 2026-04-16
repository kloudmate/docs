# Writing guide

This guide is for anyone contributing content to the KloudMate documentation — whether you use the Spinal CMS editor or edit files directly in GitHub.

---

## Who owns what

| Area | Owner |
|---|---|
| Markdown content | Writers (via Spinal or GitHub) |
| Sidebar navigation | Engineers (via `astro.config.mjs`) |
| Astro/build config | Engineers |
| CI/CD workflows | Engineers |

**Writers must not edit** `astro.config.mjs`, any file in `.github/workflows/`, or `src/content.config.ts`. These are owned by engineering.

---

## File naming

- Use **kebab-case** for all file names: `create-alert-rule.md`, not `CreateAlertRule.md`.
- Use `.md` for all content files. Only engineers may create `.mdx` files.
- Place files in the correct folder under `src/content/docs/`.

---

## Frontmatter (required on every page)

Every page must begin with a YAML frontmatter block containing **at minimum**:

```md
---
title: Page title
description: One-sentence description of what the page covers.
---
```

### Rules

- `title` and `description` are **required**. The CI build will fail without them.
- Titles should be short and action-oriented (for example, "Create an alert rule", not "Alert Rule Creation Guide").
- Descriptions should be a single complete sentence, 100–160 characters, suitable for use as a meta description in search results.
- Do not add, remove, or rename frontmatter keys. If you need a new key, ask an engineer.

---

## Page structure

Use the following sections (omit sections that do not apply):

```md
# Title

## Overview

## Prerequisites

## Steps

## Examples

## Troubleshooting

## Related
```

- **Overview** — one or two sentences explaining what the page covers and why it matters.
- **Prerequisites** — what the reader needs before starting (accounts, permissions, installed tools).
- **Steps** — numbered, action-oriented instructions. Use `###` for sub-steps.
- **Examples** — concrete examples with code or screenshots where helpful.
- **Troubleshooting** — common failure modes and how to fix them.
- **Related** — links to 2–5 closely related pages.

---

## Headings

- The page `title` frontmatter field serves as the H1 (Starlight renders it automatically from frontmatter — do not add a duplicate `# Title` at the top of the file).
- Use H2 (`##`) for top-level sections.
- Use H3 (`###`) for sub-sections.
- Do not skip heading levels.

> **Note:** The content files in this repo include an explicit `# Title` H1 for readability in GitHub and CMS previews. Starlight still renders the frontmatter title as the page heading.

---

## Writing style

- Write in **plain, direct English**. Prefer active voice.
- Address the reader as "you".
- Use **numbered lists** for sequential steps.
- Use **bullet lists** for unordered items (features, options, and so on).
- Avoid marketing language ("powerful", "seamless", "revolutionary").
- Keep sentences short — aim for one idea per sentence.
- Spell out acronyms on first use: "OpenTelemetry (OTel)".

---

## Code blocks

Use fenced code blocks with a language identifier:

````md
```bash
npm install @astrojs/starlight
```
````

Available language identifiers: `bash`, `yaml`, `json`, `js`, `ts`, `python`, `go`, and so on.

---

## Links

- Use **relative slugs** to link between docs pages: `[Alert channels](/alerts/alert-channels)`.
- Do not hard-code `https://docs.kloudmate.com` in internal links.
- External links open in the same tab by default — this is intentional.

---

## Images

- Store images in `public/images/`.
- Use descriptive file names: `aws-iam-role-arn.png`, not `screenshot1.png`.
- Reference images with a root-relative path: `![IAM Role ARN](/images/aws-iam-role-arn.png)`.
- Add alt text to every image.
- Keep images under 500 KB. Use PNG for screenshots, JPEG for photos.

---

## What Spinal editors can do

| Allowed | Not allowed |
|---|---|
| Edit Markdown content and frontmatter values | Edit frontmatter keys |
| Add new `.md` files | Add `.mdx` files |
| Upload images to `public/images/` | Edit `astro.config.mjs` |
| Update existing pages | Modify CI workflows |

---

## Frontmatter validation

The CI pipeline runs `npm run validate:frontmatter` on every push. If any file is missing `title` or `description`, the build will fail. Fix the error before merging.

---

## Linting

Run locally before pushing:

```bash
npm run lint:md
```

This checks Markdown formatting rules (line length is not enforced; other standard rules apply).

---

## Questions?

Open a GitHub issue or ask in the `#docs` Slack channel.
