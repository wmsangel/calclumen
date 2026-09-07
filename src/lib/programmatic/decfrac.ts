// Programmatic "X as a fraction" pages: "/decimal-to-fraction/<slug>" where the
// slug is the decimal with its dot written as a hyphen (0.75 -> "0-75").
//
// Huge homework demand ("0.75 as a fraction", "0.375 as a fraction") and
// click-friendly. Pairs with the fraction calculator and the /simplify/ pages
// (same GCF reduction). Only terminating decimals — the results are exact.

import { gcd } from "./gcflcm";

// Common terminating decimals people search, as strings (parsed digit-wise to
// avoid floating-point error).
const DECIMALS = [
  "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9",
  "0.05", "0.15", "0.25", "0.35", "0.45", "0.55", "0.65", "0.75", "0.85", "0.95",
  "0.125", "0.375", "0.625", "0.875", "0.025", "0.075", "0.005",
  "0.01", "0.02", "0.04", "0.06", "0.08", "0.12", "0.16", "0.24", "0.32",
  "0.48", "0.64", "0.44", "0.36", "0.28",
  "1.5", "2.5", "3.5", "1.25", "2.25", "1.75", "1.125", "3.75", "4.5",
];

export interface DecFracPage {
  decimal: string;
  slug: string; // "0-75"
}

export const DECFRAC_PAGES: DecFracPage[] = DECIMALS.map((d) => ({
  decimal: d,
  slug: d.replace(".", "-"),
}));

const BY_SLUG = new Map(DECFRAC_PAGES.map((p) => [p.slug, p]));

export function parseDecFracSlug(slug: string): DecFracPage | null {
  return BY_SLUG.get(slug) ?? null;
}

export interface DecFracResult {
  num: number; // simplest-form numerator
  den: number; // simplest-form denominator
  rawNum: number; // before simplifying (over a power of 10)
  rawDen: number;
  whole: number; // for a mixed number (0 if proper)
  rem: number; // remainder numerator for the mixed part
  percent: string;
}

/** Convert a terminating decimal string to its simplest fraction, exactly. */
export function decimalToFraction(str: string): DecFracResult {
  const [intPart, fracPart = ""] = str.split(".");
  const d = fracPart.length;
  const rawDen = Math.pow(10, d);
  const rawNum = parseInt((intPart + fracPart) || "0", 10);
  const g = gcd(rawNum, rawDen) || 1;
  const num = rawNum / g;
  const den = rawDen / g;
  const whole = den === 1 ? num : Math.floor(num / den);
  const rem = den === 1 ? 0 : num % den;
  const percent = String(Number((Number(str) * 100).toFixed(6)));
  return { num, den, rawNum, rawDen, whole, rem, percent };
}

export { gcd };

/** Other decimals to link to (nearby in the list), for internal links. */
export function relatedDecimals(page: DecFracPage, n = 8): DecFracPage[] {
  const idx = DECFRAC_PAGES.findIndex((p) => p.slug === page.slug);
  const out: DecFracPage[] = [];
  for (let d = 1; out.length < n && d < DECFRAC_PAGES.length; d++) {
    const before = DECFRAC_PAGES[idx - d];
    const after = DECFRAC_PAGES[idx + d];
    if (before) out.push(before);
    if (after && out.length < n) out.push(after);
  }
  return out;
}
