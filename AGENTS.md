# KloudMate Docs - Agent Instructions

Welcome, AI Agent! This file contains the essential context, standards, and practices for working on this repository. Please read and adhere strictly to these guidelines before making any changes.

The single most important thing you can do here is **write documentation that sounds like a knowledgeable person wrote it for another person**. The technical rules below keep the build green; Section 2 keeps the docs worth reading. Treat both as equally required.

## 1. Project Context

- **Product:** KloudMate is an end-to-end observability platform providing unified visibility into logs, metrics, traces, and alerts across cloud environments.
- **Repository Purpose:** This repository houses the public-facing documentation sites, split into three main areas: Platform Docs, Guides, and API Docs. The site will be hosted on GitHub Pages with a custom domain (`docs.kloudmate.com`).
- **Audience:** Mostly engineers and DevOps practitioners who are mid-task and looking for the fastest reliable path to "it works." Write for that person, not for a marketing landing page.
- **Voice & Tone:** Professional, clear, concise, and instructional — see Section 2 for what that actually means in practice.

## 2. Writing Style & Voice (READ THIS BEFORE WRITING CONTENT)

Good documentation reads like a knowledgeable colleague explaining something at your desk — not like a manual, and definitely not like ad copy. Picture the reader as someone who is in the middle of a task, slightly frustrated, and scanning for the answer. Everything below serves that reader.

### Write to the reader, about their task

- Use second person ("you"). Address the reader directly: "You'll need an API key before you start," not "Users must first obtain an API key."
- Make the reader the subject, not the product. Write "you land on the dashboard," not "KloudMate lands you on the dashboard." Naming the product once is fine and sometimes useful, but when it's the grammatical subject of sentence after sentence, the page reads like a feature announcement instead of a guide. The reader is the one doing the task — keep them at the center. When there's no natural "you," describe the system state instead ("the **Setup checklist** drawer opens automatically").
- Lead with the goal, then the steps. Open a page by saying what the reader will accomplish and when they'd use it — not with history or background they didn't ask for.
- Prefer active voice and present tense. "The alert fires within seconds" beats "An alert will be sent."
- Cut the throat-clearing. Phrases like "It's worth noting that…" or "In this section, we will discuss…" add nothing. Just say the thing.

### Sound like a person, not a model

- Vary your sentence length. A run of identical medium-length sentences is the clearest sign a machine wrote the page. Mix short, direct lines with longer explanatory ones.
- Watch for repeated sentence openers, too. Three sentences in a row that start with the same word — especially the product name — turn into a drumbeat. Recast some of them so the reader, an action, or the result leads instead.
- Contractions are good and usually better — "don't," "you'll," "it's." They match how people actually talk.
- Be concrete. Show a real endpoint, a real value, a real error message. "Set `retention_days` to `30`" is more useful than "configure the retention setting appropriately."
- Don't pad. If a sentence can be deleted without losing meaning, delete it.

### Words and phrases to avoid

These read as filler or AI boilerplate. Strike them on sight:

- **Hype:** powerful, robust, seamless, cutting-edge, blazing-fast, world-class, game-changing, effortless, supercharge.
- **Filler openers:** "In today's fast-paced world," "It's worth noting that," "As we all know," "Needless to say," "At the end of the day."
- **Overused verbs:** *leverage* → use "use"; *utilize* → use "use"; *delve into* → use "cover" or "explain"; *facilitate* → use "let" or "help."
- **Condescending qualifiers:** simply, just, easy, obviously, of course. If a step were genuinely simple, the reader wouldn't be on this page. Telling a stuck user that something is "easy" only makes them feel worse.
- **Vague intensifiers:** very, really, quite, "a variety of," "a wide range of," "a number of."

### Be honest and helpful about the hard parts

- Call out gotchas, prerequisites, and common mistakes *where the reader will hit them* — not in a buried footnote at the bottom.
- If something is genuinely tricky or has a known limitation, say so. Pretending everything is frictionless costs you the reader's trust the moment they hit the friction.
- Use Starlight's asides (`:::note`, `:::tip`, `:::caution`) for these, but sparingly. Overusing callouts trains readers to ignore them.

### Structure for scanning

- Most readers scan before they read. Use descriptive headings that say what the section covers ("Configure log retention") rather than generic or clever ones ("Configuration", "The fun part").
- Keep paragraphs short — two to four sentences. One idea per paragraph; if a paragraph turns a corner into a new topic, start a new one.
- Use numbered lists for ordered procedures and bullets only for genuinely unordered items. Don't bullet-point prose that flows better as a sentence.

### Make every code example runnable

- Examples should work if copied and pasted. Always label what the reader must swap out, and prefer a concrete placeholder (`YOUR_API_KEY`) over a vague one.
- Show the expected output or success state when it helps the reader confirm they did it right.
- Keep examples minimal — just enough to make the point, nothing decorative.

### A quick before / after

> **Avoid:**
> "KloudMate offers a powerful and seamless way to effortlessly leverage your observability data. In today's complex cloud environments, it's worth noting that users can simply configure a wide variety of robust alerting options to suit their needs."
>
> **Prefer:**
> "Alerts tell you when something needs attention — an error-rate spike, a service going quiet, a budget threshold crossed. This page walks you through creating your first alert and routing it to Slack."

The "prefer" version is shorter, says what the reader gets, names real scenarios, and keeps the reader (not the product) at the center. Aim for that on every page.

## 3. Tech Stack & Architecture

- **Framework:** [Astro](https://astro.build/)
- **Theme:** [Starlight](https://starlight.astro.build/)
- **Content Format:** Markdown (`.md`) and MDX (`.mdx`)

## 4. Directory Structure & Routing (CRITICAL)

The site is divided into three distinct sections, each with its own path and navigation. **Do not mix content between these directories.**

- **Platform Docs (`/docs`)**: Resides in `src/content/docs/docs/`
- **Guides (`/guides`)**: Resides in `src/content/docs/guides/`
- **API Docs (`/api`)**: API documentation will be generated from an OpenAPI specification. Ensure you check for the presence of plugins like `starlight-openapi` and follow their specific structural requirements. Do not manually edit generated files.

*Note: Any assets (images) related to these sections should be placed logically near the content or in a dedicated `public/` or `src/assets/` directory following existing patterns.*

## 6. Strict Content Rules (MUST FOLLOW)

### Frontmatter Requirements

Every hand-written `.md` and `.mdx` file **must** include `title` and `description` in its frontmatter. This is strictly enforced by a validation script. Write the `description` like a real summary a person would skim in search results — one plain sentence, no keyword stuffing.

```yaml
---
title: Your Page Title
description: A brief summary of what this page covers.
---
```

### Markdown Linting

The project uses `markdownlint-cli2`. Custom rules are defined in `.markdownlint.json`.

- **Note:** Inline HTML is permitted (`MD033: false`), and line lengths are not strictly enforced (`MD013: false`). Follow existing file patterns.

## 7. API Documentation Rules

API documentation is intended to be generated from OpenAPI/Swagger specifications rather than hand-written to avoid errors and save time.

- **Agents:** Look for an OpenAPI spec file (e.g., `openapi.yaml` or `openapi.json`) and relevant plugins in `astro.config.mjs` (like `starlight-openapi`). If updating API docs, update the source spec file, **never** the generated `.md`/`.mdx` files.
- The writing rules in Section 2 still apply to the parts you *do* hand-write — endpoint summaries, descriptions, and field docs in the spec. Keep them concrete and plain.

## 8. Agent Workflow & Verification Commands

Always verify your changes by running the corresponding checks before concluding your task:

1. **Check Frontmatter Validity:**

   ```bash
   npm run validate:frontmatter
   ```

2. **Lint Markdown Files:**

   ```bash
   npm run lint:md
   ```

3. **Build the Site (Catches Broken Links):** Verify there are no Astro compilation or broken link errors. This is critical for catching bad relative links across the different documentation sections.

   ```bash
   npm run build
   npm run check:links
   ```

## 9. Self-Review Checklist (before you finish)

Run through this on any page you wrote or edited. It's the human-quality equivalent of the build checks above.

- [ ] Does the page open by telling the reader what they'll accomplish?
- [ ] Did I read it out loud (or in my head)? Does it sound like a person, or like a template?
- [ ] Is the reader ("you") the subject of most sentences, rather than the product? Does any product name appear as the subject several sentences in a row?
- [ ] Are there any banned words from Section 2 (powerful, seamless, leverage, simply, just…)?
- [ ] Do the sentences vary in length, or do they all march at the same pace?
- [ ] Will every code block actually run if pasted?
- [ ] Are gotchas placed where the reader hits them, not buried at the end?
- [ ] Could I delete any sentence without losing meaning? If so, delete it.
- [ ] Do `validate:frontmatter`, `lint:md`, and `build` all pass?