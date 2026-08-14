# Project: calc-tools (working name)

An **ad-revenue website** — a hub of calculators and converters, English-language,
targeting Western (US/UK/CA/AU) organic search traffic. Monetized with Google AdSense.

## The one-line goal
Capture long-tail, high-intent search queries with fast, genuinely useful
calculator pages, and monetize the organic traffic with display ads.

## Why this shape (decisions already made — do not re-litigate)
- **English + Western audience** on purpose: CPM is 10–20× higher than CIS traffic
  ($5–15 vs $0.3–3), and finance queries can reach $30–50.
- **SEO organic only** — no ad budget for user acquisition. So the whole site is
  built for search: every calculator is its own indexable URL.
- **Programmatic SEO** — code generates hundreds of long-tail pages from templates
  (e.g. `/convert/100-usd-to-eur`, `/25-percent-of-80`), not hand-written blog posts.
- Google in 2026 penalizes AI text farms but rewards *tools* — pages that actually
  compute something rank because they are utilities, not filler.

## Stack
- **Next.js** with **static generation (SSG)** for every page — critical for SEO + speed.
- Deploy on **Vercel**.
- **AdSense** as primary monetizer (Ezoic/Mediavine later once traffic grows).

> ⚠️ This project will use the same special Next.js build as the sibling `izn.tools`
> project — its APIs/conventions differ from stock Next.js. BEFORE writing any code,
> read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.

## Site structure
- Category hubs: Finance / Health / Date & Time / Math / Conversions
- One calculator = one URL (`/loan-calculator`, `/salary-to-hourly`, ...)
- Programmatic variation pages generated from templates for the long tail.

## First 8–10 calculators to build (high demand + CPM)
1. Loan / mortgage payment
2. Compound interest
3. Salary → hourly / annual
4. Percentage (X% of Y, % change)
5. Tip / split bill
6. Date difference / days until
7. BMI / calorie
8. Unit + currency converter

## Open decisions for the first working session
- Final .com domain (check availability, buy manually).
- Confirm we scaffold with the special Next.js version (read its docs first).
- Page/design system + AdSense account setup.

## Next step when you open this project
Scaffold the Next.js app (read `node_modules/next/dist/docs/` first once deps exist),
then build the Percentage or Loan calculator as the first template page end-to-end.
