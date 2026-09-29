# bizzed.github.io

The `bizzed.ai` marketing site, packaged as a fully static build for GitHub
Pages, with form submissions handled by a Cloudflare Worker.

## Why this exists

Replatformed from `/bizzed-marketing-site`, which ran on Vercel and used a
serverless route to forward form submissions. GitHub Pages serves static files
only, so that route is gone: the browser now posts to a Cloudflare Worker,
which is the single trusted hop in front of the n8n webhook.

## Stack

- **[Astro](https://astro.build)** — every page prerendered, no adapter, no SSR.
- **Tailwind CSS** — brand tokens in `tailwind.config.mjs`.
- **GitHub Pages** — static hosting, deployed by GitHub Actions on push to `main`.
- **Cloudflare Workers** — the form endpoint.
- **Cloudflare Turnstile** — submission verification.
- **TypeScript** — strict mode.

## Architecture

```
browser  ──POST JSON──▶  Cloudflare Worker  ──▶  n8n webhook
(static page)              verifies Turnstile
                           holds the secrets
```

The Worker exists because a static page cannot keep a secret. It verifies the
Turnstile token server side, confirms the challenge was solved on one of our
own hostnames, and attaches the webhook credentials. `APPLICATION_WEBHOOK_URL`
and `APPLICATION_WEBHOOK_SECRET` live only in the Worker and are never shipped
to a browser.

The JSON envelope sent to n8n is unchanged from the previous Vercel
implementation, so nothing downstream needed reconfiguring.

## Quickstart

```bash
npm install
cp .env.example .env   # public build values only
npm run dev            # http://localhost:4321
```

`.env.example` is prefilled with Cloudflare's documented Turnstile test site
key, which always passes, so the widget works locally without creating anything
in Cloudflare first.

To exercise a real submission end to end, run the Worker from its own repo (see
below) and point `PUBLIC_FORM_ENDPOINT` in `.env` at `http://localhost:8787`.

## Environment variables

### Site build — public

Compiled into the served HTML. Treat as world-readable. In CI these come from
repository **variables** (not secrets), set under
Settings → Secrets and variables → Actions → Variables.

| Variable | Purpose |
|---|---|
| `PUBLIC_FORM_ENDPOINT` | The Worker URL the form posts to. |
| `PUBLIC_TURNSTILE_SITE_KEY` | Turnstile **site** key (the public half). |

### Worker — secret

Not in this repo. The Worker holds `TURNSTILE_SECRET_KEY`,
`APPLICATION_WEBHOOK_URL` and `APPLICATION_WEBHOOK_SECRET` as Cloudflare
secrets. See its README for details.

## The Worker

The form endpoint lives in the **`bizzed-marketing-site`** repo under `worker/`,
not here, because this repo may need to be public for GitHub Pages while that
one is private.

It is an entirely separate deployable — this site just posts to a URL, and has
no build or runtime dependency on it. See `worker/README.md` there for its
commands and configuration.

## Deployment

Push to `main`. `.github/workflows/deploy.yml` builds and publishes to Pages.
Enable it once under Settings → Pages → Source → **GitHub Actions**.

The Worker deploys independently, from its own repo.

## Custom domain

The site is served at **https://www.bizzed.ai**, with the apex `bizzed.ai`
redirecting to it. `astro.config.mjs` sets `site` to that origin so canonical
URLs, `og:url` and `og:image` all resolve against the real host.

DNS lives at GoDaddy, not Cloudflare:

| Record | Value |
|---|---|
| `bizzed.ai` A ×4 | `185.199.108.153` … `185.199.111.153` |
| `www` CNAME | `bizzed.github.io.` |

The apex must contain **only** those four GitHub IPs. A stray record — for
example one left behind by a previous host — makes certificate validation fail,
and GitHub does not retry on its own.

### If HTTPS is not working

GitHub checks DNS once, when the custom domain is set, and gives up silently if
that check fails. Fixing DNS afterwards does not re-trigger it. Clear the custom
domain under Settings → Pages, save, then re-enter it: that forces a fresh check.
Watch for the certificate to appear with:

```bash
gh api repos/Bizzed/bizzed.github.io/pages --jq '{cert: .https_certificate.state, enforced: .https_enforced}'
```

"Enforce HTTPS" stays greyed out until `state` is `approved`. Tick it once it
becomes available, or plain HTTP keeps being served and browsers show a "Not
Secure" warning.

### When the domain changes again

1. Change `site` in `astro.config.mjs`.
2. Update `public/CNAME`.
3. Point DNS at GitHub Pages and set the custom domain under Settings → Pages.
4. Add the new origin to `ALLOWED_ORIGINS` and its hostname to
   `EXPECTED_HOSTNAMES` in the Worker's `wrangler.toml` (in the
   `bizzed-marketing-site` repo), then redeploy it.
5. Add the new hostname to the Turnstile widget in the Cloudflare dashboard.

Step 4 is easy to forget and will break the form silently — the page loads fine
and submissions fail at the Worker.

## Adding a blog post later

Drop a `.md` or `.mdx` file in `src/content/blog/` with frontmatter matching the
schema in `src/content.config.ts`, then build a `[slug].astro` page that reads
from the collection.
