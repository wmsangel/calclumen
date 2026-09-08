// Programmatic "X% as a fraction and a decimal" pages: "/percent/<slug>"
// (slug = the percent with its dot as a hyphen, e.g. 12.5% -> "12-5").
//
// Completes the fraction ⇄ decimal ⇄ percent triangle (we already have
// decimal↔fraction and fraction↔decimal). One page covers both "X% as a
// fraction" and "X% as a decimal" — heavily searched homework, click-friendly.

import { gcd } from "./gcflcm";

const int = (a: number, b: number) =>
  Array.from({ length: b - a + 1 }, (_, i) => String(a + i));

// Integers 1–100 plus common non-integer percents people search.
const PERCENTS = [
  ...int(1, 100),
  "0.5", "1.5", "2.5", "7.5", "12.5", "17.5", "22.5", "37.5", "62.5",
  "87.5", "110", "120", "125", "150", "175", "200", "250", "300",
];

export interface PercentPage {
  percent: string;
  slug: string; // "60" or "12-5"
}

const uniq = new Map<string, string>();
for (const p of PERCENTS) uniq.set(p.replace(".", "-"), p);

export const PERCENT_CONV_PAGES: PercentPage[] = [...uniq.entries()].map(
  ([slug, percent]) => ({ percent, slug }),
);

const BY_SLUG = new Map(PERCENT_CONV_PAGES.map((p) => [p.slug, p]));

export function parsePercentSlug(slug: string): PercentPage | null {
  return BY_SLUG.get(slug) ?? null;
}

export interface PercentResult {
  num: number; // simplest-form numerator
  den: number; // simplest-form denominator
  rawNum: number;
  rawDen: number;
  decimal: string;
  whole: number;
  rem: number;
}

/** X% as an exact fraction (X/100 reduced) and decimal (X/100). */
export function percentToParts(percent: string): PercentResult {
  const [intPart, fracPart = ""] = percent.split(".");
  const fracDigits = fracPart.length;
  const rawNum = parseInt((intPart + fracPart) || "0", 10);
  const rawDen = 100 * Math.pow(10, fracDigits);
  const g = gcd(rawNum, rawDen) || 1;
  const num = rawNum / g;
  const den = rawDen / g;
  const decimal = String(Number((Number(percent) / 100).toFixed(12)));
  const whole = den === 1 ? num : Math.floor(num / den);
  const rem = den === 1 ? 0 : num % den;
  return { num, den, rawNum, rawDen, decimal, whole, rem };
}

export { gcd };

/** Nearby percents with a page, for internal links. */
export function relatedPercents(page: PercentPage, n = 8): PercentPage[] {
  const idx = PERCENT_CONV_PAGES.findIndex((p) => p.slug === page.slug);
  const out: PercentPage[] = [];
  for (let d = 1; out.length < n && d < PERCENT_CONV_PAGES.length; d++) {
    const before = PERCENT_CONV_PAGES[idx - d];
    const after = PERCENT_CONV_PAGES[idx + d];
    if (before) out.push(before);
    if (after && out.length < n) out.push(after);
  }
  return out;
}
