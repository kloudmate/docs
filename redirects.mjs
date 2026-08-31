/**
 * Legacy URL redirects.
 *
 * The docs site used to be flat: every page lived at the root, e.g.
 * `/managing-panels`. Content is now organized into sections, so those old
 * URLs 404. Each entry maps a retired path to its current page.
 *
 * The build is static (GitHub Pages), so Astro renders each key as a small
 * HTML page with a `<meta http-equiv="refresh">` and a `<link rel="canonical">`
 * pointing at the destination. That is a client-side redirect, not a 301.
 *
 * The postbuild link checker (`scripts/check-links.mjs`) follows the anchor in
 * each generated page, so a redirect pointing at a page that no longer exists
 * fails the build.
 *
 * To add one: put the old path on the left without a trailing slash, and the
 * current path on the right with one. Keep the list sorted by old path.
 */
export const redirects = {
  '/adding-a-panel': '/visualize-data/dashboards/adding-a-panel/',
  '/azure-application-gateway-log-monitoring-using-event-hub':
    '/azure-integration/azure-application-gateway-log-monitoring/',
  '/azure-monitoring': '/azure-integration/',
  '/configuration': '/kloudmate-agent/management/',
  '/database-integrations': '/database-monitoring/',
  '/direct-database-monitoring': '/database-monitoring/direct-database-monitoring/',
  '/enable-service-principal-azure': '/azure-integration/enable-service-principal-azure/',
  '/get-help': '/getting-started/get-help/',
  '/go-instrumentation-running-on-kubernetes': '/kloudmate-agent/auto-instrumentation/go/',
  '/incidents-overview': '/incident-management/incidents/',
  '/investigations': '/kloudmate-assistant/investigations/',
  '/logs-list-panel': '/visualize-data/dashboards/adding-a-panel/logs-list-panel/',
  '/logs-management': '/kloudmate-agent/log-monitoring/',
  '/managing-dashboards': '/visualize-data/dashboards/managing-dashboards/',
  '/managing-kloudmate-agents': '/kloudmate-agent/management/',
  '/managing-panels': '/visualize-data/dashboards/managing-panels/',
  '/mcp-integrations': '/kloudmate-assistant/mcp-server/',
  '/ml-classifier-deployment-guide':
    '/database-monitoring/database-activity-monitoring-dam/ml-classifier-deployment-guide/',
  '/net-instrumentation-running-on-kubernetes': '/kloudmate-agent/auto-instrumentation/dotnet/',
  '/setting-up-kloudmate': '/getting-started/setting-up-kloudmate/',
  '/sns': '/incident-management/integrations/integrating-with-aws-cloudwatch/',
  '/sum': '/visualize-data/explore/metrics-aggregations/sum/',
  '/synthetic-incidents': '/synthetic/synthetic-incidents/',
  '/tcp-monitor-test-tcp-port-connectivity': '/synthetic/monitors/tcp-monitor/',
  '/udp-monitor-monitor-udp-port-availability': '/synthetic/monitors/udp-monitor/',
  '/usage': '/kloudmate-assistant/usage/',
  '/websocket-monitor-monitor-websocket-connections': '/synthetic/monitors/websocket-monitor/',
};
