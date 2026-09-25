# bizzed.github.io
marketing site for hosting on github pages

The replatformed `bizzed.ai` marketing site, owned by BizzedAI (not the original vendor).

## Why this exists

This is a detour from the /bizzed-marketing-site website, rearchitecting a chunk of that stack for github pages static deployment while also considering some data hygiene practices

## Stack

- **[Astro](https://astro.build)** — content-focused, ships near-zero JS by default, excellent SEO.
- **Tailwind CSS** — utility-first styling with brand tokens in `tailwind.config.mjs`.
- **Github Pages** — static pages hosting
- **Cloudflare** - captcha/endpoint protection since the `/post` will be to a non-Bizzed.ai endpoint
- **TypeScript** — strict mode.

## Quickstart

```bash
# Node 18+ required
npm install
cp .env.example .env
# Edit .env and set APPLICATION_WEBHOOK_URL (get from Andy)
npm run dev
```

Open http://localhost:4321.

## Project structure

```
src/
├── components/        # Section components (Hero, FAQ, etc.)
├── layouts/           # BaseLayout with meta tags and shell
├── pages/
│   ├── index.astro    # Homepage
│   ├── get-started.astro   # Application form
│   ├── api/
│   │   └── applications.ts # Form → webhook forwarder
│   ├── blog/          # Placeholder, ready for content collection
│   └── resources/     # Placeholder
├── content/
│   ├── config.ts      # Blog schema (Zod)
│   └── blog/          # Markdown posts go here
└── styles/
    └── global.css
```

## How form submissions work

1. User fills out the form at `/get-started`.
2. JS (or a native form POST) submits to `/api/applications`.
3. `applications.ts` validates, drops honeypot submissions, and POSTs JSON to `APPLICATION_WEBHOOK_URL`.
4. The webhook (owned by BizzedAI) handles storage and downstream automation.

No third-party form service touches the data. If `APPLICATION_WEBHOOK_URL` is not set, the endpoint returns 500 so we catch misconfiguration in staging.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `APPLICATION_WEBHOOK_URL` | Yes | Where form submissions are POSTed. |
| `APPLICATION_WEBHOOK_SECRET` | No | If set, sent as `Authorization: Bearer <secret>` to the webhook. |

Set these in Vercel project settings for production/preview.

## Deployment

Follow Github pages steps for deployment

## Adding a blog post later

Drop a `.md` or `.mdx` file in `src/content/blog/` with frontmatter matching the schema in `src/content/config.ts`. Then build out a `[slug].astro` page that pulls from the collection.
