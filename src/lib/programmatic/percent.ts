// Long-tail "X percent of Y" pages generated from a template.
// Each pair becomes /[locale]/<a>-percent-of-<b> at build time (SSG).

export interface PercentPair {
  a: number;
  b: number;
}

// Common percentages people actually search, crossed with round numbers.
const A_VALUES = [1, 2, 3, 5, 10, 12, 15, 18, 20, 25, 30, 33, 40, 50, 60, 70, 75, 80, 90];
const B_VALUES = [
  10, 20, 25, 30, 40, 50, 60, 75, 80, 100, 120, 150, 200, 250, 300, 500, 750,
  1000, 1500, 2000, 5000, 10000,
];

export const PERCENT_PAGES: PercentPair[] = A_VALUES.flatMap((a) =>
  B_VALUES.map((b) => ({ a, b })),
);

const KEY = new Set(PERCENT_PAGES.map((p) => `${p.a}-${p.b}`));

export function isKnownPercentPage(a: number, b: number): boolean {
  return KEY.has(`${a}-${b}`);
}

/** Parse a slug like "15-percent-of-200" -> { a: 15, b: 200 }. */
export function parsePercentSlug(slug: string): PercentPair | null {
  const m = /^(\d+(?:\.\d+)?)-percent-of-(\d+(?:\.\d+)?)$/.exec(slug);
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[2]);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return { a, b };
}
