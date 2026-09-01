// Programmatic "Multiples of N" pages: "/multiples/<n>".
//
// Homework-driven ("multiples of 7", "first 12 multiples of 6") and evergreen.
// Like factors and GCF/LCM, these rarely trigger a Google instant-answer
// widget, so the clicks reach the page. Each page lists the multiples, a table,
// the divisibility rule, and links to related numbers + the LCM calculator.

const NUMS = [
  2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 21, 24, 25,
  30, 35, 40, 45, 50, 60, 75, 100,
];

export interface MultiplesPage {
  n: number;
  slug: string; // "12"
}

export const MULTIPLES_PAGES: MultiplesPage[] = NUMS.map((n) => ({
  n,
  slug: String(n),
}));

const KEY = new Set(MULTIPLES_PAGES.map((p) => p.slug));

export function parseMultiplesSlug(slug: string): MultiplesPage | null {
  if (!/^\d+$/.test(slug)) return null;
  if (!KEY.has(slug)) return null;
  const n = Number(slug);
  if (!Number.isFinite(n)) return null;
  return { n, slug };
}

/** The first `count` multiples of n: [n, 2n, 3n, …]. */
export function multiplesOf(n: number, count: number): number[] {
  return Array.from({ length: count }, (_, i) => n * (i + 1));
}

/** Nearby numbers that also have a page, for internal links. */
export function relatedMultiples(page: MultiplesPage, span = 6): MultiplesPage[] {
  const idx = MULTIPLES_PAGES.findIndex((p) => p.slug === page.slug);
  const out: MultiplesPage[] = [];
  for (let d = 1; out.length < span && d < MULTIPLES_PAGES.length; d++) {
    const before = MULTIPLES_PAGES[idx - d];
    const after = MULTIPLES_PAGES[idx + d];
    if (before) out.push(before);
    if (after && out.length < span) out.push(after);
  }
  return out;
}
