import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Fully static — no adapter, no server routes. Every page is prerendered to
// HTML and served by GitHub Pages.
//
// `site` drives canonical URLs, og:url and og:image, so it has to match the
// host the site is actually served from. GitHub Pages serves the custom domain
// www.bizzed.ai and redirects the apex to it, so canonicals point at www.
//
// public/CNAME carries that domain into the published output. GitHub also keeps
// a CNAME at the branch root, but that file is not part of the artifact this
// workflow uploads, so the one in public/ is what matters here.
//
// No `base` is needed: Bizzed/bizzed.github.io is an organisation Pages repo,
// so it serves from the domain root rather than a /repo-name subpath.
export default defineConfig({
  site: 'https://www.bizzed.ai',
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
