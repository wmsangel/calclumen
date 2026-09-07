// Programmatic "A/B as a decimal" pages: "/fraction-to-decimal/<a>-<b>".
//
// The reverse of the /decimal-to-fraction/ pages and just as heavily searched
// ("3/8 as a decimal", "5/8 as a decimal"). Click-friendly homework demand.
// Handles both terminating and repeating decimals.

import { gcd } from "./gcflcm";

// Common fractions people convert to decimals.
const FRACTIONS: [number, number][] = [
  [1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5],
  [1, 6], [5, 6], [1, 8], [3, 8], [5, 8], [7, 8], [1, 10], [3, 10], [7, 10],
  [9, 10], [1, 16], [3, 16], [5, 16], [7, 16], [9, 16], [11, 16], [13, 16],
  [15, 16], [1, 12], [5, 12], [7, 12], [11, 12], [1, 7], [2, 7], [3, 7],
  [1, 9], [2, 9], [4, 9], [5, 9], [7, 9], [8, 9], [1, 20], [3, 20], [1, 32],
  [1, 100], [1, 1000], [2, 3], [5, 8], [3, 4], [1, 15], [7, 20], [9, 20],
];

export interface FracDecPage {
  a: number;
  b: number;
  slug: string; // "3-8"
}

const uniq = new Map<string, [number, number]>();
for (const [a, b] of FRACTIONS) if (a < b) uniq.set(`${a}-${b}`, [a, b]);

export const FRACDEC_PAGES: FracDecPage[] = [...uniq.values()].map(([a, b]) => ({
  a,
  b,
  slug: `${a}-${b}`,
}));

const KEY = new Set(FRACDEC_PAGES.map((p) => p.slug));

export function parseFracDecSlug(slug: string): FracDecPage | null {
  const m = /^(\d+)-(\d+)$/.exec(slug);
  if (!m || !KEY.has(slug)) return null;
  return { a: Number(m[1]), b: Number(m[2]), slug };
}

export interface FracDecResult {
  decimal: string; // display string
  terminating: boolean;
  percent: string;
}

/** Convert a/b to its decimal, flagging terminating vs repeating. */
export function fractionToDecimal(a: number, b: number): FracDecResult {
  const g = gcd(a, b) || 1;
  const den = b / g;
  // Terminating iff the reduced denominator's only prime factors are 2 and 5.
  let t = den;
  while (t % 2 === 0) t /= 2;
  while (t % 5 === 0) t /= 5;
  const terminating = t === 1;
  const value = a / b;
  let decimal: string;
  if (terminating) {
    decimal = String(Number(value.toFixed(12)));
  } else {
    decimal = value.toFixed(6).replace(/0+$/, "") + "…";
  }
  const percent = String(Number((value * 100).toFixed(4)));
  return { decimal, terminating, percent };
}

export { gcd };

/** Nearby fractions with a page, for internal links. */
export function relatedFracDec(page: FracDecPage, n = 8): FracDecPage[] {
  const idx = FRACDEC_PAGES.findIndex((p) => p.slug === page.slug);
  const out: FracDecPage[] = [];
  for (let d = 1; out.length < n && d < FRACDEC_PAGES.length; d++) {
    const before = FRACDEC_PAGES[idx - d];
    const after = FRACDEC_PAGES[idx + d];
    if (before) out.push(before);
    if (after && out.length < n) out.push(after);
  }
  return out;
}
