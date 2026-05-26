import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightScrollToTop from 'starlight-scroll-to-top';
import starlightLlmsTxt from 'starlight-llms-txt';
import starlightAutoSidebar from 'starlight-auto-sidebar'
import starlightThemeNova from 'starlight-theme-nova';
import starlightImageZoom from 'starlight-image-zoom';
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi';
import starlightAutoDrafts from 'starlight-auto-drafts';
import starlightDotMd from 'starlight-dot-md';
import starlightLlmActions from 'starlight-llm-actions';


const deploymentOrigin = process.env.DOCS_SITE_URL ?? 'https://docs.kloudmate.com';
const deploymentBasePath = normalizeBasePath(process.env.DOCS_BASE_PATH ?? '/');

/**
 * Astro expects `base` to either be `/` or a single normalized path segment with
 * leading and trailing slashes.
 */
function normalizeBasePath(pathname) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  return `/${pathname.replace(/^\/+|\/+$/g, '')}/`;
}

export default defineConfig({
  site: deploymentOrigin,
  base: deploymentBasePath,
  integrations: [
    starlight({
      plugins: [
        // starlightOpenAPI([
        //   {
        //     base: 'api',
        //     label: 'API Reference',
        //     schema: './openapi.yaml',
        //   },
        // ]),
        // Note: starlight-links-validator was removed because it can't see
        // through `docsLoader({ generateId })` slug rewriting — it keys its
        // page table by source file path, but our URLs come from the rewritten
        // slug, so every absolute internal link was wrongly reported as broken.
        // Link checking is handled by scripts/check-links.mjs (runs in postbuild)
        // which validates against the actual rendered HTML.
        starlightImageZoom(),
        starlightThemeNova({
          nav: [
            { label: 'Docs', href: '/getting-started/what-is-kloudmate/' },
            { label: 'Guides', href: '/guides/' },
            // { label: 'API', href: '/api/' },
          ],
        }),
        starlightScrollToTop(),
        starlightLlmsTxt(),
        starlightAutoSidebar(),
        starlightAutoDrafts(),
        starlightDotMd(),
        starlightLlmActions(),
      ],
      title: 'KloudMate Docs',
      description: 'Documentation for KloudMate observability platform',
      logo: {
        light: './src/assets/logo-light.png',
        dark: './src/assets/logo-dark.png',
        replacesTitle: true,
      },
      // social: [
      //   { icon: 'github', label: 'GitHub', href: 'https://github.com/kloudmate' },
      // ],
      customCss: ['./src/styles/brand.css'],
      components: {
        Header: './src/components/Header.astro',
        Sidebar: './src/components/Sidebar.astro',
      },
      sidebar: [
        {
          label: 'Docs',
          autogenerate: { directory: 'docs' },
        },
        {
          label: 'Guides',
          autogenerate: { directory: 'guides' },
        },
        // ...openAPISidebarGroups,
      ],
    }),
  ],
});
