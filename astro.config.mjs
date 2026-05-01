import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightHeadingBadges from 'starlight-heading-badges';
import starlightScrollToTop from 'starlight-scroll-to-top';
import starlightLlmsTxt from 'starlight-llms-txt';
import starlightAutoSidebar from 'starlight-auto-sidebar'
import starlightUtils from '@lorenzo_lewis/starlight-utils';

export default defineConfig({
  site: 'https://docs.kloudmate.com',
  integrations: [
    starlight({
      plugins: [
        starlightHeadingBadges(),
        starlightScrollToTop(),
        starlightLlmsTxt(),
        starlightAutoSidebar(),
        starlightUtils({
          navLinks: {
            leading: { useSidebarLabelled: 'HeaderNavLinks' },
          },
        })
      ],
      title: 'KloudMate Docs',
      description: 'Documentation for KloudMate observability platform',
      customCss: ['/src/styles/starlight.css'],
      logo: {
        light: './src/assets/logo-light.png',
        dark: './src/assets/logo-dark.png',
        replacesTitle: true,
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/kloudmate' },
      ],
      components: {
        Sidebar: './src/components/Sidebar.astro',
        ThemeProvider: './src/components/ThemeProvider.astro',
        ThemeSelect: './src/components/ThemeToggleButton.astro',
      },
      sidebar: [
        {
          label: 'HeaderNavLinks',
          items: [
            { label: 'Docs', link: '/docs/kloudmate/' },
            { label: 'Guides', link: '/guides/' },
            { label: 'API', link: '/api/' },
          ],
        },
        {
          label: 'Platform Docs',
          items: [
            { label: 'KloudMate', slug: 'docs/kloudmate' },
            { label: 'Setting Up KloudMate', slug: 'docs/setting-up-kloudmate' },
            { label: 'Get Started', slug: 'docs/get-started' },
            { label: 'Get Help', slug: 'docs/get-help' },
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
