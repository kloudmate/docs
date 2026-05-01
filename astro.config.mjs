import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://docs.kloudmate.com',
  integrations: [
    starlight({
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
        Header: './src/components/Header.astro',
        Sidebar: './src/components/Sidebar.astro',
        ThemeProvider: './src/components/ThemeProvider.astro',
      },
      sidebar: [
        {
          label: 'Platform Docs',
          items: [
            {
              label: 'Getting Started',
              items: [
                { label: 'Overview', slug: 'docs/getting-started/overview' },
                { label: 'Quickstart', slug: 'docs/getting-started/quickstart' },
              ],
            },
            {
              label: 'Alerts',
              items: [
                { label: 'Overview', slug: 'docs/alerts/overview' },
                { label: 'Create alert rule', slug: 'docs/alerts/create-alert-rule' },
                { label: 'Alert channels', slug: 'docs/alerts/alert-channels' },
              ],
            },
            {
              label: 'Logs',
              items: [
                { label: 'Overview', slug: 'docs/logs/overview' },
                { label: 'Search logs', slug: 'docs/logs/search-logs' },
                { label: 'Log-based alerts', slug: 'docs/logs/log-based-alerts' },
              ],
            },
            {
              label: 'Metrics',
              items: [
                { label: 'Overview', slug: 'docs/metrics/overview' },
                { label: 'Metrics explorer', slug: 'docs/metrics/metrics-explorer' },
                { label: 'Custom metrics', slug: 'docs/metrics/custom-metrics' },
              ],
            },
            {
              label: 'Traces',
              items: [
                { label: 'Overview', slug: 'docs/traces/overview' },
                { label: 'Distributed tracing', slug: 'docs/traces/distributed-tracing' },
                { label: 'Trace search', slug: 'docs/traces/trace-search' },
              ],
            },
            {
              label: 'Dashboards',
              items: [
                { label: 'Overview', slug: 'docs/dashboards/overview' },
                { label: 'Create a dashboard', slug: 'docs/dashboards/create-dashboard' },
                { label: 'Dashboard variables', slug: 'docs/dashboards/dashboard-variables' },
              ],
            },
            {
              label: 'AI Assistant',
              items: [
                { label: 'Overview', slug: 'docs/ai-assistant/overview' },
                { label: 'Ask AI', slug: 'docs/ai-assistant/ask-ai' },
              ],
            },
            {
              label: 'Synthetic Monitoring',
              items: [
                { label: 'Overview', slug: 'docs/synthetic-monitoring/overview' },
                { label: 'Create a monitor', slug: 'docs/synthetic-monitoring/create-monitor' },
                { label: 'Monitor results', slug: 'docs/synthetic-monitoring/monitor-results' },
              ],
            },
            {
              label: 'Integrations',
              items: [
                { label: 'Overview', slug: 'docs/integrations/overview' },
                { label: 'AWS', slug: 'docs/integrations/aws' },
                { label: 'Kubernetes', slug: 'docs/integrations/kubernetes' },
                { label: 'OpenTelemetry', slug: 'docs/integrations/opentelemetry' },
              ],
            },
            {
              label: 'On-Premises',
              items: [
                { label: 'Overview', slug: 'docs/on-prem/overview' },
                { label: 'Installation', slug: 'docs/on-prem/installation' },
                { label: 'Configuration', slug: 'docs/on-prem/configuration' },
              ],
            },
            {
              label: 'Billing',
              items: [
                { label: 'Overview', slug: 'docs/billing/overview' },
                { label: 'Manage subscription', slug: 'docs/billing/manage-subscription' },
                { label: 'Usage and limits', slug: 'docs/billing/usage-and-limits' },
              ],
            },
            {
              label: 'Troubleshooting',
              items: [
                { label: 'Common issues', slug: 'docs/troubleshooting/common-issues' },
                { label: 'FAQ', slug: 'docs/troubleshooting/faq' },
              ],
            },
            {
              label: 'Tutorials',
              items: [
                { label: 'Overview', slug: 'docs/tutorials/overview' },
                { label: 'Monitor a web service', slug: 'docs/tutorials/monitor-web-service' },
              ],
            },
            {
              label: 'Release Notes',
              items: [
                { label: 'Latest release', slug: 'docs/release-notes/latest' },
                { label: 'Changelog', slug: 'docs/release-notes/changelog' },
              ],
            },
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
