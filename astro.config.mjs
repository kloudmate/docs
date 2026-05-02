import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightScrollToTop from 'starlight-scroll-to-top';
import starlightLlmsTxt from 'starlight-llms-txt';
import starlightAutoSidebar from 'starlight-auto-sidebar'
import starlightThemeNova from 'starlight-theme-nova';
import starlightLinksValidator from 'starlight-links-validator';
import starlightImageZoom from 'starlight-image-zoom';
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi';

const deploymentOrigin = process.env.DOCS_SITE_URL ?? 'https://docs.kloudmate.com';
const assetsPrefix = process.env.DOCS_ASSETS_PREFIX;

export default defineConfig({
  site: deploymentOrigin,
  build: {
    assetsPrefix,
  },
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
        starlightLinksValidator(),
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
          items: [
            { label: 'Getting Started', autogenerate: { directory: 'docs/getting-started' } },
            { label: 'KM Agent', autogenerate: { directory: 'docs/km-agent', collapsed: true }, collapsed: true },
            { label: 'Metrics', autogenerate: { directory: 'docs/metrics', collapsed: true }, collapsed: true },
            { label: 'Traces', autogenerate: { directory: 'docs/traces', collapsed: true }, collapsed: true },
            { label: 'Logs', autogenerate: { directory: 'docs/logs', collapsed: true }, collapsed: true },
            { label: 'Profiling', autogenerate: { directory: 'docs/profiling', collapsed: true }, collapsed: true },
            { label: 'Database Monitoring', autogenerate: { directory: 'docs/database-monitoring', collapsed: true }, collapsed: true },
            { label: 'Security Observability', autogenerate: { directory: 'docs/security-observability', collapsed: true }, collapsed: true },
            { label: 'Integrations', autogenerate: { directory: 'docs/integrations', collapsed: true }, collapsed: true },
            { label: 'Dashboards & Alerts', autogenerate: { directory: 'docs/dashboards-alerts', collapsed: true }, collapsed: true },
            { label: 'Platform', autogenerate: { directory: 'docs/platform', collapsed: true }, collapsed: true },
            { label: 'Troubleshooting & FAQ', autogenerate: { directory: 'docs/troubleshooting', collapsed: true }, collapsed: true }
          ]
        },
        {
          label: 'Guides',
          items: [
            { label: 'Overview', slug: 'guides' },
          ],
        },
        ...openAPISidebarGroups,
      ],
    }),
  ],
});
