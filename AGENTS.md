# KloudMate Docs - Agent Instructions

Welcome, AI Agent! This file contains the essential context, standards, and practices for working on this repository. Please read and adhere strictly to these guidelines before making any changes.

## 1. Project Context
- **Product:** KloudMate is an end-to-end observability platform providing unified visibility into logs, metrics, traces, and alerts across cloud environments.
- **Repository Purpose:** This repository houses the public-facing documentation sites, split into three main areas: Platform Docs, Guides, and API Docs. The site will be hosted on GitHub Pages with a custom domain (`docs.kloudmate.com`).
- **Voice & Tone:** Professional, clear, concise, and instructional.

## 2. Tech Stack & Architecture
- **Framework:** [Astro](https://astro.build/)
- **Theme:** [Starlight](https://starlight.astro.build/)
- **Content Format:** Markdown (`.md`) and MDX (`.mdx`)

## 3. Directory Structure & Routing (CRITICAL)
The site is divided into three distinct sections, each with its own path and navigation. **Do not mix content between these directories.**

- **Platform Docs (`/docs`)**: Resides in `src/content/docs/docs/`
- **Guides (`/guides`)**: Resides in `src/content/docs/guides/`
- **API Docs (`/api`)**: API documentation will be generated from an OpenAPI specification. Ensure you check for the presence of plugins like `starlight-openapi` and follow their specific structural requirements. Do not manually edit generated files.

*Note: Any assets (images) related to these sections should be placed logically near the content or in a dedicated `public/` or `src/assets/` directory following existing patterns.*

## 4. Navigation & Sidebar Management
Each section has its own independent sidebar navigation. Whenever you create, move, or delete a file, you **MUST** update the `sidebar` configuration in `astro.config.mjs`.
- Starlight supports defining different sidebars based on the route. Ensure you are updating the correct sidebar section for the content you are working on (e.g., the sidebar for `/docs` vs the sidebar for `/guides`).

## 5. Strict Content Rules (MUST FOLLOW)

### Frontmatter Requirements
Every hand-written `.md` and `.mdx` file **must** include `title` and `description` in its frontmatter. This is strictly enforced by a validation script.
```yaml
---
title: Your Page Title
description: A brief summary of what this page covers.
---
```

### Markdown Linting
The project uses `markdownlint-cli2`. Custom rules are defined in `.markdownlint.json`. 
- **Note:** Inline HTML is permitted (`MD033: false`), and line lengths are not strictly enforced (`MD013: false`). Follow existing file patterns.

### Cross-Linking & References
- When linking between sections (e.g., from `/docs/` to `/guides/`), ensure you use the correct root-relative paths. 
- Avoid hardcoding absolute URLs (like `https://docs.kloudmate.com`); use relative paths so local testing and GitHub Pages deployments work seamlessly.

## 6. API Documentation Rules
API documentation is intended to be generated from OpenAPI/Swagger specifications rather than hand-written to avoid errors and save time. 
- **Agents:** Look for an OpenAPI spec file (e.g., `openapi.yaml` or `openapi.json`) and relevant plugins in `astro.config.mjs` (like `starlight-openapi`). If updating API docs, update the source spec file, **never** the generated `.md`/`.mdx` files.

## 7. Configuration & Deployment Notes
- **GitHub Pages:** The site is configured for deployment on GitHub Pages. Be aware that the `base` property in `astro.config.mjs` might need adjustments depending on whether it's served from a root custom domain or a subdirectory. Always verify routing behaviors if you alter the `base` configuration.

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
   ```