#!/usr/bin/env node
/**
 * Validate that every Markdown/MDX file under src/content/docs/
 * contains required frontmatter fields: title and description.
 *
 * Exits with code 1 if any file is missing required fields.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';

const DOCS_DIR = fileURLToPath(new URL('../src/content/docs', import.meta.url));
const REQUIRED_FIELDS = ['title', 'description'];

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;

let hasErrors = false;

function getField(frontmatter, field) {
  const match = frontmatter.match(new RegExp(`^${field}\\s*:`, 'm'));
  return Boolean(match);
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (entry.endsWith('.md') || entry.endsWith('.mdx')) {
      const content = readFileSync(fullPath, 'utf8');
      const match = content.match(FRONTMATTER_RE);
      const filePath = relative(DOCS_DIR, fullPath);

      if (!match) {
        console.error(`[MISSING FRONTMATTER] ${filePath}`);
        hasErrors = true;
        continue;
      }

      const frontmatter = match[1];
      for (const field of REQUIRED_FIELDS) {
        if (!getField(frontmatter, field)) {
          console.error(`[MISSING FIELD: ${field}] ${filePath}`);
          hasErrors = true;
        }
      }
    }
  }
}

walk(DOCS_DIR);

if (hasErrors) {
  console.error('\nFrontmatter validation failed. Fix the errors above.');
  process.exit(1);
} else {
  console.log('Frontmatter validation passed.');
}
