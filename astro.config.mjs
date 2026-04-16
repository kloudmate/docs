import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://kloudmate.github.io/docs/',
  base: '/docs/',
  integrations: [
    starlight({
      title: 'KloudMate Docs',
      description: 'Documentation for KloudMate observability platform',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/kloudmate' },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Overview', slug: 'getting-started/overview' },
            { label: 'Quickstart', slug: 'getting-started/quickstart' },
          ],
        },
        {
          label: 'Alerts',
          items: [
            { label: 'Overview', slug: 'alerts/overview' },
            { label: 'Create alert rule', slug: 'alerts/create-alert-rule' },
            { label: 'Alert channels', slug: 'alerts/alert-channels' },
          ],
        },
        {
          label: 'Logs',
          items: [
            { label: 'Overview', slug: 'logs/overview' },
            { label: 'Search logs', slug: 'logs/search-logs' },
            { label: 'Log-based alerts', slug: 'logs/log-based-alerts' },
          ],
        },
        {
          label: 'Metrics',
          items: [
            { label: 'Overview', slug: 'metrics/overview' },
            { label: 'Metrics explorer', slug: 'metrics/metrics-explorer' },
            { label: 'Custom metrics', slug: 'metrics/custom-metrics' },
          ],
        },
        {
          label: 'Traces',
          items: [
            { label: 'Overview', slug: 'traces/overview' },
            { label: 'Distributed tracing', slug: 'traces/distributed-tracing' },
            { label: 'Trace search', slug: 'traces/trace-search' },
          ],
        },
        {
          label: 'Dashboards',
          items: [
            { label: 'Overview', slug: 'dashboards/overview' },
            { label: 'Create a dashboard', slug: 'dashboards/create-dashboard' },
            { label: 'Dashboard variables', slug: 'dashboards/dashboard-variables' },
          ],
        },
        {
          label: 'AI Assistant',
          items: [
            { label: 'Overview', slug: 'ai-assistant/overview' },
            { label: 'Ask AI', slug: 'ai-assistant/ask-ai' },
          ],
        },
        {
          label: 'Synthetic Monitoring',
          items: [
            { label: 'Overview', slug: 'synthetic-monitoring/overview' },
            { label: 'Create a monitor', slug: 'synthetic-monitoring/create-monitor' },
            { label: 'Monitor results', slug: 'synthetic-monitoring/monitor-results' },
          ],
        },
        {
          label: 'Integrations',
          items: [
            { label: 'Overview', slug: 'integrations/overview' },
            { label: 'AWS', slug: 'integrations/aws' },
            { label: 'Kubernetes', slug: 'integrations/kubernetes' },
            { label: 'OpenTelemetry', slug: 'integrations/opentelemetry' },
          ],
        },
        {
          label: 'On-Premises',
          items: [
            { label: 'Overview', slug: 'on-prem/overview' },
            { label: 'Installation', slug: 'on-prem/installation' },
            { label: 'Configuration', slug: 'on-prem/configuration' },
          ],
        },
        {
          label: 'Billing',
          items: [
            { label: 'Overview', slug: 'billing/overview' },
            { label: 'Manage subscription', slug: 'billing/manage-subscription' },
            { label: 'Usage and limits', slug: 'billing/usage-and-limits' },
          ],
        },
        {
          label: 'Troubleshooting',
          items: [
            { label: 'Common issues', slug: 'troubleshooting/common-issues' },
            { label: 'FAQ', slug: 'troubleshooting/faq' },
          ],
        },
        {
          label: 'Tutorials',
          items: [
            { label: 'Overview', slug: 'tutorials/overview' },
            { label: 'Monitor a web service', slug: 'tutorials/monitor-web-service' },
          ],
        },
        {
          label: 'Release Notes',
          items: [
            { label: 'Latest release', slug: 'release-notes/latest' },
            { label: 'Changelog', slug: 'release-notes/changelog' },
          ],
        },
      ],
    }),
  ],
});
