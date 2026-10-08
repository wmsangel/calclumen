// "Spotlight this week" — a single internal self-promo slot that rotates weekly.
// Its real job is SEO: a prominent in-content internal link to one of our own
// money pages / pillar guides / newest tools, which helps Google discover and
// value pages that are otherwise under-linked (many finance pages are "unknown"
// or "crawled, not indexed" while the domain is young). Rotating by ISO week
// spreads that internal-link equity across the roster over time.
//
// Chosen SERVER-SIDE (build / ISR time), so the link is baked into the static
// HTML and is fully crawlable — a client-side-only rotation would be invisible
// to the internal-linking signal we're after. It advances on each deploy and on
// the weekly ISR revalidation.

export interface Spotlight {
  /** Path relative to the locale root, e.g. "/mortgage-calculator" or "/guides/…". */
  path: string;
  title: string;
  blurb: string;
  /** Small pill, e.g. "Popular", "New", "Guide". */
  badge: string;
}

// Curated roster: flagship money pages (need indexing), pillar guides, and newer
// or underrated tools worth resurfacing. Keep every entry evergreen.
export const SPOTLIGHT: Spotlight[] = [
  {
    path: "/mortgage-calculator",
    title: "Mortgage Calculator",
    blurb: "See the full monthly payment — principal, interest, taxes and insurance — and how much home you can really afford.",
    badge: "Popular",
  },
  {
    path: "/compound-interest-calculator",
    title: "Compound Interest Calculator",
    blurb: "Watch savings or investments grow over time, and see exactly how much of the total is interest on interest.",
    badge: "Popular",
  },
  {
    path: "/rental-property-calculator",
    title: "Rental Property Calculator",
    blurb: "Run a rental through cash flow, cash-on-cash return, cap rate and DSCR before you buy.",
    badge: "New",
  },
  {
    path: "/guides/roth-vs-traditional-ira",
    title: "Roth vs Traditional IRA",
    blurb: "Which retirement account wins for you? A clear walkthrough of the tax trade-off, with the numbers.",
    badge: "Guide",
  },
  {
    path: "/debt-payoff-calculator",
    title: "Debt Payoff Calculator",
    blurb: "Find out how fast you can be debt-free, and how much interest an extra payment each month saves you.",
    badge: "Popular",
  },
  {
    path: "/depreciation-calculator",
    title: "Depreciation Calculator",
    blurb: "Build a year-by-year schedule with straight-line, declining balance or MACRS for any business asset.",
    badge: "New",
  },
  {
    path: "/guides/how-much-house-can-you-afford",
    title: "How Much House Can You Afford?",
    blurb: "The 28/36 rule, down payments and hidden costs — what a lender really looks at, in plain English.",
    badge: "Guide",
  },
  {
    path: "/salary-to-hourly-calculator",
    title: "Salary to Hourly Calculator",
    blurb: "Convert an annual salary to an hourly rate (and back), accounting for the hours you actually work.",
    badge: "Handy",
  },
  {
    path: "/capital-gains-tax-calculator",
    title: "Capital Gains Tax Calculator",
    blurb: "Estimate federal and state tax on your investment gains — short- vs long-term, by filing status.",
    badge: "Popular",
  },
  {
    path: "/401k-calculator",
    title: "401(k) Calculator",
    blurb: "Project your 401(k) at retirement, including the employer match you don't want to leave on the table.",
    badge: "Popular",
  },
];

/** ISO-8601 week number (1–53) for a date, in UTC. */
function isoWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (date.getUTCDay() + 6) % 7; // Mon=0 … Sun=6
  date.setUTCDate(date.getUTCDate() - dayNum + 3); // nearest Thursday
  const firstThursday = date.getTime();
  date.setUTCMonth(0, 1);
  if (date.getUTCDay() !== 4) {
    date.setUTCMonth(0, 1 + ((4 - date.getUTCDay() + 7) % 7));
  }
  return 1 + Math.round((firstThursday - date.getTime()) / 604_800_000);
}

/** The spotlight entry for the current week (deterministic at build/ISR time). */
export function spotlightOfWeek(now: Date = new Date()): Spotlight {
  const idx = isoWeek(now) % SPOTLIGHT.length;
  return SPOTLIGHT[idx];
}
