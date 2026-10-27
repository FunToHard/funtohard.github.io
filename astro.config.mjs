import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkWikilinks } from './src/plugins/remark-wikilinks.mjs';
import { getAllSubAppUrls } from './sub-apps.config.mjs';

// https://astro.build/config
const subAppUrls = await getAllSubAppUrls('https://funtohard.github.io');

export default defineConfig({
  site: 'https://funtohard.github.io',
  base: '/',
  redirects: {
    '/journal': '/philosophy/',
    '/research': '/philosophy/research/',
    '/thoughts': '/philosophy/thoughts/',
    '/topics': '/philosophy/topics/',
  },
  server: {
    host: true,
    port: 8087,
    allowedHosts: true,
  },
  vite: {
    server: {
      allowedHosts: true,
    },
  },
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      customPages: subAppUrls,
    }),
    tailwind({
      applyBaseStyles: true,
    }),
  ],
  markdown: {
    remarkPlugins: [remarkMath, remarkWikilinks],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: {
        obsidian: 'github-dark-dimmed',
        parchment: 'catppuccin-latte',
        oxford: 'tokyo-night',
      },
      defaultColor: false,
      wrap: true,
    },
  },
});
