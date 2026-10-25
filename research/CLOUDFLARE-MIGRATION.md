# CloudFlare migration (plan #10) — status & cutover

**✅ CUTOVER DONE (2026-10-25).** `calclumen.com` now serves from the **Cloudflare Worker**
`calclumen` (prod URL `calclumen.ocrsnip.workers.dev`), bound as a Custom Domain. Verified
live on the apex: `server: cloudflare` + `cf-ray` (no `x-vercel`), locale 307→/en→200,
`/go/<slug>` 302 → tagged amazon.com, `/api/og` 200 png, robots.txt, sitemap.xml,
fo-verify meta, nofollow×20, loan-calculator 200 (150 KB), TLS valid (Google Trust Services).
`main` auto-deploys the Worker via GitHub Actions on push.

**How the DNS cutover was done** (the dashboard/wrangler Custom-Domain bind refused while the
old Vercel records existed — "Hostname already has externally managed DNS records", code 100117):
1. CF DNS (zone calclumen.com) → deleted the two Vercel CNAMEs: apex `calclumen.com` and
   `www`, both → `2a33fa72fd9835ac.vercel-dns-017.com`. MX (Email Routing) + SPF + DKIM kept.
2. Workers → calclumen → Domains → Add Domain → `calclumen.com` (root) → bound. CF created
   its managed proxied `calclumen.com | Worker` record automatically.
3. www restored: added proxied `CNAME www → calclumen.com`, then a Redirect Rule
   "Redirect from WWW to root" (`https://www.*` → `https://${1}`, **301**, preserve query) —
   verified `www.calclumen.com/en/loan-calculator` → 301 → `calclumen.com/en/loan-calculator`.

**✅ Vercel retired (2026-10-25):** disconnected the Git integration on the Vercel project
`izn1/calc-tools` (Settings → Git → Disconnect → "Git repository disconnected"). Pushes to
`main` no longer build on Vercel — only the GitHub Actions → Cloudflare Worker deploy runs.
The Vercel project itself is preserved (settings kept), so rollback is still possible: re-add
the Vercel CNAMEs in CF DNS and reconnect Git if ever needed.

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
