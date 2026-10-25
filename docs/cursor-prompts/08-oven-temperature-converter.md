# Cursor prompt — Oven Temperature Converter (plan #8, `→cursor`)

> Self-contained task for Cursor. Build ONE new standalone converter page.
> Do not touch unrelated files. Keep the house style and conventions exactly.

## Repo context

- **CalcLumen** (`wmsangel/calclumen`) — Next.js 16 App Router, fully **SSG**, English UI,
  deployed to Cloudflare Workers via GitHub Actions on push to `main`.
- Every calculator = one indexable URL at `/[locale]/<slug>`. A calculator is **4 touch
  points**: a client component, a server page, a **registry entry**, and (automatic) the
  sitemap — `src/app/sitemap.ts` reads the registry, so you do **not** edit the sitemap.
- Pattern to copy verbatim: **`cooking-conversion-calculator`** (a standalone converter with
  no programmatic unit pages behind it — same shape we need here). Look at:
  - `src/app/[locale]/cooking-conversion-calculator/page.tsx`
  - `src/components/calculators/cooking-conversion-calculator.tsx`
  - its entry in `src/lib/calculators/registry.ts` (search `cooking-conversion-calculator`)
- Shared UI primitives live in `src/components/ui.tsx`: `Field({label, children, hint?})`,
  `Segmented({value,onChange,options})`, `Stat`, `ToolCard`. Number formatting:
  `formatNumber` from `@/lib/format`. Client components start with `"use client"`.
- ⚠️ Do **NOT** add `ConversionLinks` to this page — that helper is only for converters that
  have programmatic unit pages (`typesForConverter`), which oven temperature does not. Follow
  the cooking page (it renders `<CalcShell ... content={content}>` with the component inside,
  no `extra`).

## What to build

A new converter at slug **`oven-temperature-converter`**, category **`conversions`**, that
converts an oven setting between **°C**, **°F**, and **UK gas marks**, and also shows the
**fan (convection)** equivalent of a conventional temperature.

### Conversion rules (use exactly — correctness is the whole point)

- °C ↔ °F: `F = C*9/5 + 32`, `C = (F-32)*5/9`.
- **Fan oven rule of thumb:** fan temperature = conventional − **20 °C** (round to nearest
  10 °C for display). Show both "Conventional" and "Fan/Convection" °C and °F.
- **Gas mark table** (standard UK, conventional °C):

  | Gas mark | °C  | °F  |
  |----------|-----|-----|
  | ¼        | 110 | 225 |
  | ½        | 120 | 250 |
  | 1        | 140 | 275 |
  | 2        | 150 | 300 |
  | 3        | 160 | 325 |
  | 4        | 180 | 350 |
  | 5        | 190 | 375 |
  | 6        | 200 | 400 |
  | 7        | 220 | 425 |
  | 8        | 230 | 450 |
  | 9        | 240 | 475 |

  When the input doesn't land exactly on a row, map to the **nearest** gas mark by °C and
  label it "≈ Gas Mark N". Build the °C/°F columns of the on-page reference table from this
  same table so numbers never drift.

### UI

- Inputs: a `Field` with a numeric value + a `Segmented` to pick the input scale
  (`°C` / `°F` / `Gas mark`). Default `180` `°C`.
- Outputs via `Stat`/`ToolCard`: Conventional °C & °F, Fan °C & °F, nearest Gas Mark.
- Below, a static reference table rendering every gas-mark row (Gas · °C · °F · Fan °C) so
  the page is useful without interacting — this is what ranks.
- No new npm deps. No `next/image`. No client-only globals that break SSG.

### Files

1. `src/components/calculators/oven-temperature-converter.tsx` — `"use client"` component
   `OvenTemperatureConverter`, modeled on `temperature-converter.tsx` /
   `cooking-conversion-calculator.tsx` (pure functions at top, `useState`, no side effects).
2. `src/app/[locale]/oven-temperature-converter/page.tsx` — copy the **cooking** page exactly,
   swap `SLUG = "oven-temperature-converter"`, import the new component, and write a
   `content: CalcContent` with:
   - `intro`: 2 short paragraphs (what it does; the fan −20 °C rule + that gas marks are the
     UK dial scale).
   - `steps`: 3 bullets (enter value → pick scale → read conventional/fan/gas-mark + table).
   - `faq`: 3 Q&A (e.g. "What is Gas Mark 4 in Celsius?" → 180 °C / 350 °F; "How much lower is
     a fan oven?" → about 20 °C; "What is 350 °F in Celsius / gas mark?" → 180 °C, Gas Mark 4).
3. `src/lib/calculators/registry.ts` — add one `CalcDef` entry in the `conversions` block
   (next to `cooking-conversion-calculator`): `slug`, `category: "conversions"`,
   `title: "Oven temperature"`, `heading: "Oven Temperature Converter"`, a one-sentence
   `description`, 4 `keywords` (e.g. `"oven temperature converter"`, `"gas mark to celsius"`,
   `"fan oven conversion"`, `"350f to celsius oven"`), and `isNew: true`.

## Done criteria

- New page renders at `/en/oven-temperature-converter` (SSG) with h1 "Oven Temperature
  Converter", interactive conversion, and the gas-mark reference table.
- Appears automatically in the sitemap (registry-driven) — confirm, don't hand-edit.
- Matches the existing converters' look (same `Field`/`Segmented`/`Stat`/`ToolCard`, same
  Tailwind classes), light + dark both fine.
- No new dependencies; no `ConversionLinks` on this page.

## How to verify the build (run all, must pass)

```bash
npm run lint
npm run test
npm run build
```

Then spot-check locally:

```bash
npm run dev    # open http://localhost:3000/en/oven-temperature-converter
```

Confirm: 180 °C → 356 °F, Fan ≈ 160 °C, ≈ Gas Mark 4; switching input to `Gas mark` → 4
shows 180 °C / 350 °F. Do **not** deploy — leave that to the owner's one-push flow.
