# calc-tools — **CalcLumen** (calclumen.com)

Ad-revenue calculator/converter hub — English, Western SEO traffic, AdSense.
See [AGENTS.md](AGENTS.md) for the strategy and decisions.

## Stack

- **Next.js 16** (App Router, static generation) — note: middleware is `src/proxy.ts`.
- **React 19**, **Tailwind v4**, **TypeScript**.
- Deploy target: **Vercel**.

## Run

```bash
npm install
npm run dev      # http://localhost:3000 (redirects to /en)
npm run build    # static export of every page
```

## Architecture

- URLs carry a locale segment (`/en/...`); `src/lib/i18n/config.ts` currently
  lists only `en`, but the structure is ready for more languages.
- **`src/lib/calculators/registry.ts`** is the single source of truth — categories
  + calculators. The home hub, category pages, footer, sitemap and internal
  linking all read from it. Adding a calculator = one registry entry + a
  `components/calculators/<name>.tsx` client component + a
  `app/[locale]/<slug>/page.tsx` server page using `<CalcShell>`.
- **Calculators (9):** loan/mortgage, compound interest, salary↔hourly, tip/split,
  BMI, calorie/TDEE, date difference, unit converter, currency converter,
  percentage.
- **Programmatic long-tail (SSG):**
  - `app/[locale]/[slug]` → `X-percent-of-Y` pages (`src/lib/programmatic/percent.ts`).
  - `app/[locale]/convert/[pair]` → `usd-to-eur` currency pages
    (`src/lib/programmatic/rates.ts`, indicative static rates).
- **SEO:** per-page canonical/OG/Twitter (`src/lib/seo/metadata.ts`), JSON-LD
  (WebApplication + FAQPage + BreadcrumbList) in `CalcShell`, `robots.ts`,
  `sitemap.ts` (~570 URLs).
- **Ads:** `<AdSlot>` placeholders mark every ad position; drop the AdSense unit
  in once the account is approved.

## Before launch (open items)

- [ ] Buy the `.com` and set `SITE_NAME` / `SITE_URL` in `src/lib/seo/site.ts`
      (or `NEXT_PUBLIC_SITE_URL`).
- [ ] AdSense account + swap `AdSlot` for the real ad unit.
- [ ] Add a favicon / OG image.
