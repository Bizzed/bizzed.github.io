import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Fully static — no adapter, no server routes. Every page is prerendered to
// HTML and served by GitHub Pages.
//
// `site` drives canonical URLs and Open Graph tags, so it must match wherever
// the site is actually served from. It points at the GitHub Pages domain while
// that is the live host; at DNS cutover, change it to https://bizzed.ai and add
// public/CNAME (see README).
//
// No `base` is needed: Bizzed/bizzed.github.io is an organisation Pages repo,
// so it serves from the domain root rather than a /repo-name subpath.
export default defineConfig({
  site: 'https://bizzed.github.io',
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
