import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

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
    // Emits sitemap-index.xml and sitemap-0.xml, both built from `site` above.
    //
    // /blog and /resources are excluded while they are still "Coming soon"
    // stubs — submitting empty pages to search engines earns nothing and
    // counts as thin content. Drop them from this filter once they have real
    // content.
    sitemap({
      filter: (page) =>
        !page.includes('/blog') && !page.includes('/resources'),
    }),
  ],
});
