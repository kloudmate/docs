# KloudMate Documentation Writer's Guide

Welcome to the KloudMate documentation repository! This guide provides all the necessary instructions, standards, and validation rules you need to contribute effectively. We use [Astro Starlight](https://starlight.astro.build/) as our documentation framework.

---

## 1. Project Structure

The documentation is split into three main areas. **Do not mix content between these directories.**

- **Platform Docs (`/docs`)**: Resides in `src/content/docs/docs/`
- **Guides (`/guides`)**: Resides in `src/content/docs/guides/`
- **API Docs (`/api`)**: Resides in `src/content/docs/api/` (API docs are often generated, be careful editing these directly).

When you add a new file, you must also update the sidebar navigation in `astro.config.mjs` to ensure your page is visible in the left-hand menu.

---

## 2. Writing Content

All documentation must be authored using MDX (`.mdx`). This allows you to seamlessly use interactive Starlight components anywhere in your guides.

**Do not use standard Markdown (`.md`).** Every new file you create must use the `.mdx` extension.

### Frontmatter (Required)

Every file must include a YAML frontmatter block at the very top containing a `title` and a `description`.

```yaml
---
title: Your Page Title
description: A brief summary of what this page covers.
---
```

*(Note: Starlight automatically uses your `title` as the `<h1>` on the page. Do not add a `# Heading 1` manually in your content).*

### Drafts / Unpublished Content

If you are working on a page that is not ready for production, simply add `draft: true` to the frontmatter:

```yaml
---
title: My Work In Progress
description: This page is not ready yet.
draft: true
---
```

Draft pages will be visible locally when running the development server (`npm run dev`), but will be **completely excluded** from the production build and deployment.

---

## 3. Starlight Layout Best Practices

To make the documentation look professional and highly readable, please use the following built-in Starlight components in your `.mdx` files.

### Asides (Callouts)

Do not use standard blockquotes (`> text`) for notes or warnings. Use Starlight's specialized syntax:

```markdown
:::note
This is a standard note.
:::

:::tip[Pro Tip]
You can customize the title of the callout!
:::

:::caution
Be careful with this configuration.
:::

:::danger
This action will delete your data.
:::
```

### Steps (For Tutorials & Quickstarts)

Wrap ordered lists inside the `<Steps>` component to create a beautiful vertical timeline layout.

```mdx
import { Steps } from '@astrojs/starlight/components';

<Steps>
1. **Create an account** 
   Sign up for KloudMate.

2. **Install the agent**
   Run the installation script in your terminal.
</Steps>
```

### Tabs

Use `<Tabs>` when showing instructions for different environments (e.g., AWS vs GCP, or npm vs yarn).

```mdx
import { Tabs, TabItem } from '@astrojs/starlight/components';

<Tabs>
  <TabItem label="AWS">
    Instructions for AWS.
  </TabItem>
  <TabItem label="Kubernetes">
    Instructions for Kubernetes.
  </TabItem>
</Tabs>
```

### Card Grids (For "Next Steps")

Instead of standard bullet points for "Related Pages" or "Next Steps", use Cards to create a cleaner routing experience.

```mdx
import { LinkCard, CardGrid } from '@astrojs/starlight/components';

## Next steps

<CardGrid>
  <LinkCard title="Quickstart Guide" description="Connect your first service." href="/docs/getting-started/quickstart" />
  <LinkCard title="Integrations" description="Find your platform." href="/docs/integrations/overview" />
</CardGrid>
```

---

## 4. Validation & Deployment

We have strict CI/CD pipelines in place. If your content fails validation, **your pull request cannot be merged**. 

Always run these commands locally before committing:

1. **Lint your Markdown:**
   ```bash
   npm run lint:md
   ```

2. **Validate your Frontmatter** (Checks for missing titles/descriptions):
   ```bash
   npm run validate:frontmatter
   ```

3. **Check for Broken Links** (Build the site locally to ensure no missing pages or bad relative links):
   ```bash
   npm run build
   ```

Once your PR is merged to `master`, a GitHub Action will run these exact validation steps before deploying the site to GitHub Pages.