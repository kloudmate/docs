import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { autoSidebarSchema } from 'starlight-auto-sidebar/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader({
      generateId: ({ entry }) => {
        const noExt = entry.replace(/\.(md|mdx|markdown|mdoc)$/i, '');
        const withoutDocsPrefix = noExt.replace(/^docs\//, '');
        return withoutDocsPrefix.replace(/\/index$/, '');
      },
    }),
    schema: docsSchema(),
  }),
  autoSidebar: defineCollection({
    loader: glob({
      base: 'src/content/docs',
      pattern: '**/_meta.{json,yaml,yml}',
    }),
    schema: autoSidebarSchema(),
  }),
};
