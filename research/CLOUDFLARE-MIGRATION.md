# CloudFlare migration (plan #10) — status & cutover

**Status (2026-10-23):** branch `cloudflare-ready` is deployed to a **live CF Worker
preview — https://calclumen.ocrsnip.workers.dev** (via the manual `cf-preview.yml`
Action; owner's CLOUDFLARE_API_TOKEN + ACCOUNT_ID secrets are set). All checks pass on
the live Worker (locale redirect, headers, /go/ 302, /api/og png, interactive calc).
Live domain is still on Vercel — nothing switched. DNS cutover needs the owner's "go".

Remaining: (1) kick the tires on the preview; (2) merge `cloudflare-ready` → main
(Vercel will build 16.4.2 — verified); (3) DNS cutover: bind calclumen.com to the Worker
(Workers → calclumen → Settings → Domains & Routes → add custom domain), then retire
Vercel. Steps 2–3 are a separate owner "go", not during indexation recovery.

Approach (owner's choice): **@opennextjs/cloudflare adapter → Cloudflare Workers**, mirroring
the proven **costtrek** (`~/Sites/worldtime`) setup — not static export. Middleware,
dynamic `/api/og`, redirects and headers all keep working 1:1.

## What changed on the branch
- Deps bumped to the network standard: **next 16.4.2 + @opennextjs/cloudflare 1.20.13**
  (the old 16.2.12 + adapter 1.20.2 failed — "Node.js middleware not supported"; the
  current adapter supports `proxy.ts` experimentally, which is what costtrek runs).
- `open-next.config.ts` — static-assets incremental cache (prerendered pages ship as
  free static assets, no KV write storm). `wrangler.jsonc` — `nodejs_compat` +
  `global_fetch_strictly_public`, self-reference service, no KV/IMAGES (we use static
  cache and no `next/image`).
- `src/app/api/og/route.tsx` — removed `export const runtime = "edge"` (it 500s on
  workerd; running it as a normal Worker route works, and is fine on Vercel too).
- `tsconfig.json` — `target` ES2017 → **ES2020** (next 16.4's build type-checks the
  BigInt-literal test file; ES2020 allows `10n`). Type-only, no emit change.
- `.github/workflows/deploy.yml` — auto-deploy to the Worker on push to `main`, gated on
  the `CLOUDFLARE_API_TOKEN` secret (green no-op until set). IndexNow ping after deploy.
- `.gitignore` — ignore `.open-next/`, `.wrangler/`.
- Build scripts: `npm run cf:build` / `cf:preview` / `cf:deploy`. **Needs Node 22** (nvm).

## Verified on the local CF runtime (`wrangler dev`, workerd)
- `/` → 307 → `/en`; `/fire-calculator` → 307 → `/en/fire-calculator` (proxy.ts locale).
- `/en/*` → 200 with all security headers (HSTS, X-Frame-Options, Referrer-Policy, …).
- `/go/<slug>` → 302 → tagged amazon.com (47 redirects).
- `/api/og?...` → 200 image/png (22 KB).
- `robots.txt` (Disallow /go/), `ads.txt`, `sitemap.xml` all serve.
- **Calculators compute interactively**: FIRE recomputed $1,000,000 → $1,250,000 on input.

## Cutover steps (OWNER — when ready to leave Vercel)
Proven path = GitHub Actions (same as costtrek), not the CF dashboard Git connect.

1. **Create a Cloudflare API token**: CF dashboard → My Profile → API Tokens → Create →
   template **"Edit Cloudflare Workers"**. Account = `d6d43b8e4c7d1d4858991c524843db4c`.
2. **Add two GitHub repo secrets** (Settings → Secrets and variables → Actions):
   - `CLOUDFLARE_API_TOKEN` = the token above
   - `CLOUDFLARE_ACCOUNT_ID` = `d6d43b8e4c7d1d4858991c524843db4c`
   ```bash
   gh secret set CLOUDFLARE_API_TOKEN --repo wmsangel/calclumen
   gh secret set CLOUDFLARE_ACCOUNT_ID --repo wmsangel/calclumen --body d6d43b8e4c7d1d4858991c524843db4c
   ```
3. **Preview deploy**: run the workflow once (Actions → "Deploy to Cloudflare" →
   Run workflow on `cloudflare-ready`), or `nvm use 22 && npm run cf:deploy` locally after
   `wrangler login` (current local token lacks Workers scope). → gives a `calclumen.<sub>.workers.dev`
   URL. Sanity-check the tools there.
4. **Merge `cloudflare-ready` → main** when happy. Vercel still serves the domain; the
   Action now also deploys the Worker on each push.
5. **DNS cutover** (separate owner "go"): point `calclumen.com` at the Worker (add a
   Custom Domain to the Worker in CF, or route). Then the Worker is live; Vercel can be
   retired. **Do NOT do this during an indexation-recovery window without confirming.**

## Rollback
Trivial: DNS still on Vercel until step 5. If the Worker misbehaves after cutover, repoint
DNS back to Vercel (Vercel project stays intact). The branch never touches main until merged.

## Caveat
`proxy.ts` runs as **Node.js middleware**, which the adapter supports *experimentally*
("not officially maintained"). It works in full local verification, but watch for adapter
updates. If it ever breaks, the fallback is to encode the locale redirect in a Worker
route or `_headers`/routing instead.
