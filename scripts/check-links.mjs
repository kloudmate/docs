#!/usr/bin/env node
/**
 * Post-build internal link checker.
 *
 * Walks every HTML file under `dist/`, extracts every `<a href="...">` to an
 * internal target, resolves it against the page URL using browser semantics,
 * and verifies a matching file exists in the build output. Exits non-zero
 * when broken links are found, so it can fail CI.
 *
 * Why this exists: starlight-links-validator only validates absolute paths
 * (it either skips relative links or errors on all of them — no in-between).
 * Relative links like `./foo/` or `../foo/` need to be resolved against the
 * page's URL and then checked against the filesystem, which is exactly what
 * this script does.
 *
 * Draft pages: pages with `draft: true` frontmatter are excluded from the
 * production build (via `starlight-auto-drafts`), so they never land in `dist/`.
 * Links from published pages to a not-yet-published draft would otherwise be
 * reported as broken. We compute the route of every draft page from source
 * (mirroring the `generateId` slug rewrite in `src/content.config.ts`) and skip
 * links that resolve to one — the source link stays in place and starts working
 * the moment the target page drops its draft flag.
 *
 * Usage: `node scripts/check-links.mjs` (runs automatically via `postbuild`).
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');

if (!existsSync(distDir)) {
  console.error(`check-links: dist/ not found at ${distDir}. Run \`npm run build\` first.`);
  process.exit(1);
}

// --- Draft routes -----------------------------------------------------------
// Mirror astro.config.mjs's base normalization so computed routes match the
// resolved link pathnames (which include the configured base path).
function normalizeBasePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  return `/${pathname.replace(/^\/+|\/+$/g, '')}/`;
}
const base = normalizeBasePath(process.env.DOCS_BASE_PATH ?? '/');

const srcDir = resolve(process.cwd(), 'src/content/docs');
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;
const DRAFT_RE = /^draft:\s*true\s*$/m;

// Normalize a pathname for comparison: drop a trailing slash (except root).
function normalizeRoute(p) {
  return p === '/' ? '/' : p.replace(/\/+$/, '');
}

// Convert a source file path to its built route, replicating `generateId`:
//   strip extension → strip a leading `docs/` → strip a trailing `/index`.
function routeForSource(absPath) {
  const rel = relative(srcDir, absPath).split('\\').join('/');
  const noExt = rel.replace(/\.(md|mdx|markdown|mdoc)$/i, '');
  const withoutDocsPrefix = noExt.replace(/^docs\//, '');
  const id = withoutDocsPrefix.replace(/\/index$/, '');
  return normalizeRoute(`${base}${id}`);
}

const draftRoutes = new Set();
function collectDrafts(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) collectDrafts(full);
    else if (/\.(md|mdx|markdown|mdoc)$/i.test(full)) {
      const fm = readFileSync(full, 'utf8').match(FRONTMATTER_RE);
      if (fm && DRAFT_RE.test(fm[1])) draftRoutes.add(routeForSource(full));
    }
  }
}
collectDrafts(srcDir);

let skippedDraftLinks = 0;

const issues = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (full.endsWith('.html')) checkFile(full);
  }
}

function pageUrl(htmlPath) {
  // dist/foo/index.html -> /foo/   ;   dist/foo.html -> /foo
  const rel = htmlPath.slice(distDir.length).split('\\').join('/');
  if (rel.endsWith('/index.html')) return rel.slice(0, -'index.html'.length);
  if (rel === '/404.html') return '/404';
  return rel.replace(/\.html$/, '');
}

function targetExists(pathname) {
  if (existsSync(join(distDir, pathname))) return true;
  if (existsSync(join(distDir, pathname + '.html'))) return true;
  if (existsSync(join(distDir, pathname, 'index.html'))) return true;
  const noSlash = pathname.replace(/\/$/, '');
  if (existsSync(join(distDir, noSlash + '.html'))) return true;
  if (existsSync(join(distDir, noSlash, 'index.html'))) return true;
  return false;
}

function checkFile(htmlPath) {
  const url = pageUrl(htmlPath);
  const html = readFileSync(htmlPath, 'utf8');
  const hrefRe = /<a\b[^>]*\shref="([^"]+)"/gi;
  let m;
  while ((m = hrefRe.exec(html))) {
    let href = m[1];
    // Skip externals, anchors, mailto/tel/javascript, data URIs, search/query-only links
    if (/^(https?:|mailto:|tel:|javascript:|data:|#|\?)/i.test(href)) continue;
    // Strip query/hash before resolving
    const cleaned = href.split('#')[0].split('?')[0];
    if (!cleaned) continue;
    let resolved;
    try {
      resolved = new URL(cleaned, 'http://x' + url).pathname;
    } catch {
      continue;
    }
    if (targetExists(resolved)) continue;
    // Skip links that point at a draft page (excluded from this build).
    if (draftRoutes.has(normalizeRoute(resolved))) {
      skippedDraftLinks++;
      continue;
    }
    issues.push({ page: url, href: m[1], resolved });
  }
}

walk(distDir);

const draftNote = skippedDraftLinks
  ? ` (skipped ${skippedDraftLinks} link${skippedDraftLinks === 1 ? '' : 's'} to ${draftRoutes.size} draft page${draftRoutes.size === 1 ? '' : 's'})`
  : '';

// Dedupe by (page, href)
const seen = new Set();
const uniq = issues.filter((i) => {
  const key = i.page + ' :: ' + i.href;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

if (uniq.length === 0) {
  console.log(`check-links: no broken internal links found ✓${draftNote}`);
  process.exit(0);
}

console.error(`check-links: found ${uniq.length} broken internal link${uniq.length === 1 ? '' : 's'} across ${new Set(uniq.map((i) => i.page)).size} page${new Set(uniq.map((i) => i.page)).size === 1 ? '' : 's'}${draftNote}\n`);
for (const i of uniq) {
  console.error(`  ${i.page}`);
  console.error(`    href:     ${i.href}`);
  console.error(`    resolves: ${i.resolved}`);
}
process.exit(1);
