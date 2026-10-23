// Amazon Associates — native "materials / gear for this project" cards on the
// pages where a real product is genuinely useful (mostly home/DIY material
// estimators, plus a few utility/health pages). Compliance:
//   - every link carries the Associates tag (?tag=calclumen-20);
//   - we use Amazon SEARCH links (keyword), NOT scraped product pages, so there
//     are NO manual prices and NO product images (Amazon forbids both without
//     the PA-API, which needs 3 qualifying sales first). A search link still
//     credits any resulting purchase to our tag;
//   - links render rel="sponsored nofollow" and the card shows the required
//     "As an Amazon Associate…" disclosure (see <AmazonMaterials>).
// Links point to amazon.com (US). International visitors (UK/CA/AU) can be
// handled later with Amazon OneLink; not wired yet.

export const AMAZON_TAG = "calclumen-20";

export interface AmazonItem {
  /** Shown to the reader. */
  name: string;
  /** Amazon search query. */
  q: string;
}

export interface AmazonBlock {
  label: string;
  items: AmazonItem[];
}

/** amazon.com search URL carrying our Associates tag. */
export function amazonSearchUrl(q: string): string {
  return `https://www.amazon.com/s?k=${encodeURIComponent(q)}&tag=${AMAZON_TAG}`;
}

const MATERIALS = "Materials & tools for this project";
const GEAR = "Gear you may want";
const READING = "Recommended reading";

export const AMAZON: Record<string, AmazonBlock> = {
  "drywall-calculator": {
    label: MATERIALS,
    items: [
      { name: "Drywall screws", q: "drywall screws" },
      { name: "Joint compound", q: "drywall joint compound" },
      { name: "Drywall tape", q: "drywall joint tape" },
      { name: "Drywall saw & T-square", q: "drywall saw t square kit" },
    ],
  },
  "insulation-calculator": {
    label: MATERIALS,
    items: [
      { name: "Fiberglass insulation rolls", q: "fiberglass insulation roll R13" },
      { name: "Staple gun", q: "heavy duty staple gun" },
      { name: "Respirator mask", q: "respirator mask insulation" },
      { name: "Utility knife", q: "retractable utility knife" },
    ],
  },
  "concrete-calculator": {
    label: MATERIALS,
    items: [
      { name: "Concrete mix", q: "quikrete concrete mix" },
      { name: "Mixing tub", q: "concrete mixing tub" },
      { name: "Finishing trowel", q: "concrete finishing trowel" },
    ],
  },
  "gravel-calculator": {
    label: MATERIALS,
    items: [
      { name: "Landscape fabric", q: "landscape fabric heavy duty" },
      { name: "Garden rake", q: "bow rake gravel" },
      { name: "Wheelbarrow", q: "wheelbarrow" },
    ],
  },
  "paint-calculator": {
    label: MATERIALS,
    items: [
      { name: "Paint roller kit", q: "paint roller kit" },
      { name: "Painter's tape", q: "painters tape" },
      { name: "Paint tray liners", q: "paint tray liners" },
    ],
  },
  "tile-calculator": {
    label: MATERIALS,
    items: [
      { name: "Tile spacers", q: "tile spacers" },
      { name: "Notched trowel", q: "notched tile trowel" },
      { name: "Tile cutter", q: "manual tile cutter" },
    ],
  },
  "roofing-calculator": {
    label: MATERIALS,
    items: [
      { name: "Roofing nails", q: "roofing nails" },
      { name: "Roofing utility knife", q: "roofing hook blade knife" },
      { name: "Tape measure (25 ft)", q: "tape measure 25 ft" },
    ],
  },
  "deck-calculator": {
    label: MATERIALS,
    items: [
      { name: "Deck screws", q: "deck screws exterior" },
      { name: "Speed square", q: "speed square" },
      { name: "Tape measure (25 ft)", q: "tape measure 25 ft" },
    ],
  },
  "stair-calculator": {
    label: MATERIALS,
    items: [
      { name: "Stair gauges", q: "stair gauge set" },
      { name: "Framing square", q: "framing square" },
      { name: "Construction pencils", q: "carpenter pencils" },
    ],
  },
  "flooring-calculator": {
    label: MATERIALS,
    items: [
      { name: "Flooring spacers", q: "laminate flooring spacers" },
      { name: "Tapping block & pull bar", q: "laminate flooring installation kit" },
      { name: "Underlayment", q: "flooring underlayment" },
    ],
  },
  "electricity-cost-calculator": {
    label: GEAR,
    items: [
      { name: "Kill A Watt energy meter", q: "kill a watt electricity usage monitor" },
      { name: "Smart plug with energy monitoring", q: "smart plug energy monitoring" },
    ],
  },
  "btu-calculator": {
    label: GEAR,
    items: [
      { name: "Space heater", q: "space heater" },
      { name: "Portable air conditioner", q: "portable air conditioner" },
    ],
  },
  "bmi-calculator": {
    label: GEAR,
    items: [
      { name: "Smart body scale", q: "smart body fat scale" },
      { name: "Tape measure (body)", q: "body measuring tape" },
    ],
  },
  "calorie-calculator": {
    label: GEAR,
    items: [
      { name: "Digital kitchen scale", q: "digital kitchen food scale" },
      { name: "Meal prep containers", q: "meal prep containers" },
    ],
  },
  "bmr-calculator": {
    label: GEAR,
    items: [
      { name: "Smart body scale", q: "smart body fat scale" },
      { name: "Digital kitchen scale", q: "digital kitchen food scale" },
    ],
  },
  "pregnancy-weight-gain-calculator": {
    label: GEAR,
    items: [
      { name: "Bathroom scale", q: "digital bathroom scale" },
      { name: "Pregnancy week-by-week book", q: "pregnancy week by week book" },
    ],
  },
  "bac-calculator": {
    label: GEAR,
    items: [{ name: "Personal breathalyzer", q: "personal breathalyzer" }],
  },
  "budget-calculator": {
    label: READING,
    items: [
      { name: "Best-selling budgeting books", q: "budgeting personal finance book bestseller" },
      { name: "Budget planner", q: "budget planner notebook" },
    ],
  },
  "compound-interest-calculator": {
    label: READING,
    items: [{ name: "Best-selling investing books", q: "investing book beginner bestseller" }],
  },
  "retirement-savings-calculator": {
    label: READING,
    items: [{ name: "Retirement planning books", q: "retirement planning book" }],
  },
  "401k-calculator": {
    label: READING,
    items: [{ name: "Retirement & 401(k) books", q: "401k retirement investing book" }],
  },
  "traditional-ira-calculator": {
    label: READING,
    items: [{ name: "IRA & retirement planning books", q: "IRA retirement planning book" }],
  },
  "cagr-calculator": {
    label: READING,
    items: [{ name: "Investing & returns books", q: "investing book beginner bestseller" }],
  },
};

export function amazonFor(slug: string): AmazonBlock | null {
  return AMAZON[slug] ?? null;
}

// --- Internal /go/<slug> cloaking -------------------------------------------
// Links on the page point at /go/<slug>, which 302-redirects to the tagged
// amazon.com URL (the redirect rules live in next.config.ts — a free edge
// redirect, no serverless function). This keeps crawlers off the raw
// `amazon.com/...?tag=` links: /go/ is Disallow-ed in robots.txt, so bots stop
// inflating the Associates click count, while real visitors pass straight
// through. The visible label still says "on Amazon" (not masked).

/** Stable slug for an Amazon query — the /go/<slug> key and the GA4 `item`. */
export function amazonGoSlug(q: string): string {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Internal cloaked link for a query: /go/<slug>. */
export function amazonGoHref(q: string): string {
  return `/go/${amazonGoSlug(q)}`;
}

/** Flat slug -> tagged amazon URL map for next.config redirects(). Deduped, so
 *  identical queries across pages share one /go/<slug> rule. */
export const AMAZON_GO_REDIRECTS: ReadonlyArray<{ slug: string; url: string }> =
  (() => {
    const seen = new Map<string, string>();
    for (const block of Object.values(AMAZON)) {
      for (const item of block.items) {
        const slug = amazonGoSlug(item.q);
        if (!seen.has(slug)) seen.set(slug, amazonSearchUrl(item.q));
      }
    }
    return [...seen].map(([slug, url]) => ({ slug, url }));
  })();
