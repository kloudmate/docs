import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightScrollToTop from 'starlight-scroll-to-top';
import starlightLlmsTxt from 'starlight-llms-txt';
import starlightAutoSidebar from 'starlight-auto-sidebar'
import starlightThemeNova from 'starlight-theme-nova';
import starlightLinksValidator from 'starlight-links-validator';
import starlightImageZoom from 'starlight-image-zoom';
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi';
import starlightAutoDrafts from 'starlight-auto-drafts'


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
        starlightOpenAPI([
          {
            base: 'api',
            label: 'API Reference',
            schema: './openapi.yaml',
          },
        ]),
        starlightLinksValidator({
          errorOnRelativeLinks: false,
          sameSitePolicy: 'error',
        }),
        starlightImageZoom(),
        starlightThemeNova({
          nav: [
            { label: 'Docs', href: '/docs/getting-started/what-is-kloudmate/' },
            { label: 'Guides', href: '/guides/' },
            { label: 'API', href: '/api/' },
          ],
        }),
        starlightScrollToTop(),
        starlightLlmsTxt(),
        starlightAutoSidebar(),
        starlightAutoDrafts(),
      ],
      title: 'KloudMate Docs',
      description: 'Documentation for KloudMate observability platform',
      logo: {
        light: './src/assets/logo-light.png',
        dark: './src/assets/logo-dark.png',
        replacesTitle: true,
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/kloudmate' },
      ],
      customCss: ['./src/styles/brand.css'],
      components: {
        Header: './src/components/Header.astro',
        Sidebar: './src/components/Sidebar.astro',
      },
      sidebar: [
        {
          label: 'Platform Docs',
          autogenerate: { directory: 'docs' },
        },
        {
          label: 'Guides',
          autogenerate: { directory: 'guides' },
        },
        ...openAPISidebarGroups,
      ],
    }),
  ],
});
