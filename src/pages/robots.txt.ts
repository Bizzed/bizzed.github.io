import type { APIRoute } from 'astro';

/**
 * Emits /robots.txt at build time.
 *
 * Written as an endpoint rather than a static file in public/ so the Sitemap
 * line is derived from `site` in astro.config.mjs. A hardcoded domain here
 * would silently rot the next time the site moves hosts, which is exactly how
 * the canonical tags ended up pointing at bizzed.github.io after the move to
 * www.bizzed.ai.
 *
 * /blog and /resources are disallowed while they are "Coming soon" stubs, and
 * are excluded from the sitemap for the same reason. Remove both exclusions
 * together once they carry real content.
 */
export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL('sitemap-index.xml', site);

  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    'Disallow: /blog',
    'Disallow: /resources',
    '',
    `Sitemap: ${sitemapUrl.href}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
