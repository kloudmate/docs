import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightScrollToTop from 'starlight-scroll-to-top';
import starlightLlmsTxt from 'starlight-llms-txt';
import starlightAutoSidebar from 'starlight-auto-sidebar'
import starlightThemeNova from 'starlight-theme-nova';

export default defineConfig({
  site: 'https://docs.kloudmate.com',
  integrations: [
    starlight({
      plugins: [
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
            { label: 'KM Agent', autogenerate: { directory: 'docs/km-agent' } },
            { label: 'Metrics', autogenerate: { directory: 'docs/metrics' } },
            { label: 'Traces', autogenerate: { directory: 'docs/traces' } },
            { label: 'Logs', autogenerate: { directory: 'docs/logs' } },
            { label: 'Profiling', autogenerate: { directory: 'docs/profiling' } },
            { label: 'Database Monitoring', autogenerate: { directory: 'docs/database-monitoring' } },
            { label: 'Security Observability', autogenerate: { directory: 'docs/security-observability' } },
            { label: 'Integrations', autogenerate: { directory: 'docs/integrations' } },
            { label: 'Dashboards & Alerts', autogenerate: { directory: 'docs/dashboards-alerts' } },
            { label: 'Platform', autogenerate: { directory: 'docs/platform' } },
            { label: 'Troubleshooting & FAQ', autogenerate: { directory: 'docs/troubleshooting' } }
          ]
        },
        {
          label: 'Guides',
          items: [
            { label: 'Overview', slug: 'guides' },
          ],
        },
        {
          label: 'API Reference',
          items: [
            { label: 'Overview', slug: 'api' },
          ],
        },
      ],
    }),
  ],
});
