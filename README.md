# [roast] — pricing page diagnostics

A small webapp that takes a SaaS pricing URL, screenshots it, runs it past a
catalog of common pricing-page mistakes, and writes the findings up as roasts.

Stack: Next.js 15 (App Router) · React 19 · Vercel AI SDK with Google Gemini
2.5 Flash (free tier; 2.5 Pro via `GEMINI_MODEL` once billing is enabled) ·
[allscreenshots.com](https://allscreenshots.com) · Upstash Redis for rate
limiting · deployed on Vercel.

## Local development

```bash
npm install
cp .env.local.example .env.local
# fill in GOOGLE_GENERATIVE_AI_API_KEY and ALLSCREENSHOTS_API_KEY
npm run dev
```

Open http://localhost:3000.

Upstash credentials are optional locally — without them, rate limiting is
disabled (handy for development). Add them before deploying to production.

## How it works

1. Browser POSTs `{ url, context? }` to `/api/roast`.
2. The route streams Server-Sent Events for each stage:
   - `Resolving DNS`
   - `Crawling pricing page` (parallel) + `Capturing screenshot` (parallel)
   - `Loading knowledge base` — reads `content/rules.md`
   - `Cross-referencing diagnostics` + `Sharpening the knives` — Claude call
   - `Compiling roasts`
3. Gemini 2.5 Pro receives: the rules markdown, the extracted page text +
   metadata, the screenshot image, and any user-provided context. Returns
   structured output validated against a zod schema via the Vercel AI SDK's
   `generateObject`.
4. The frontend renders a verdict card, a list of finding cards, and a
   thumbnail of the captured screenshot.

## Editing the rules

Edit `content/rules.md`. Each `### Rule name` becomes a thing the model
considers. The whole file is fed into the model's prompt — no parsing, no
code changes needed. Voice is set in the file's header and reinforced in
`lib/llm.ts`.

## Deploying to Vercel

```bash
vercel link
vercel env add GOOGLE_GENERATIVE_AI_API_KEY production
vercel env add ALLSCREENSHOTS_API_KEY production
vercel env add UPSTASH_REDIS_REST_URL production
vercel env add UPSTASH_REDIS_REST_TOKEN production
vercel --prod
```

The `/api/roast` route runs on the Node runtime with `maxDuration: 60`.

## Rate limits (production)

With Upstash configured:

- 3 runs / hour per IP
- 10 runs / day per IP
- 1 concurrent request per IP
- 80 runs / day total (leaves headroom under the allscreenshots free tier)

Tune in `lib/ratelimit.ts`.

## What's not here yet

- Persistent / shareable runs (no DB; runs are ephemeral)
- Functional email capture
- PDF export, share button
- Tone selector (baked to "dry british" in `lib/llm.ts`)
- Cloudflare Turnstile (add when abuse appears)
