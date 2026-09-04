// Programmatic "Simplify A/B" pages: "/simplify/<a>-<b>".
//
// Huge homework demand ("simplify 12/16", "24/36 in simplest form") and
// click-friendly (the simplest form plus the step-by-step rarely triggers a
// Google instant-answer widget). Reuses the same GCF that powers the /gcf-lcm/
// pages — simplifying a fraction is just dividing both parts by their GCF.

import { gcd } from "./gcflcm";

// Larger reducible fractions people search on top of the systematic 2..24 grid
// (percent-style /100 and /1000 are especially common).
const NOTABLE: [number, number][] = [
  [75, 100], [50, 100], [25, 100], [20, 100], [40, 100], [60, 100], [80, 100],
  [10, 100], [5, 100], [15, 100], [30, 100], [45, 100], [90, 100], [12, 100],
  [35, 100], [65, 100], [8, 100], [4, 100], [36, 100], [64, 100], [55, 100],
  [70, 100], [85, 100], [95, 100], [125, 1000], [250, 1000], [500, 1000],
  [750, 1000], [375, 1000], [625, 1000], [16, 20], [18, 27], [21, 28],
  [10, 25], [12, 30], [15, 25], [24, 40], [36, 60], [45, 60], [40, 100],
];

function buildPairs(): [number, number][] {
  const seen = new Set<string>();
  const out: [number, number][] = [];
  const add = (a: number, b: number) => {
    const key = `${a}-${b}`;
    // Proper (a < b), reducible (gcd > 1) fractions only.
    if (a >= 1 && a < b && gcd(a, b) > 1 && !seen.has(key)) {
      seen.add(key);
      out.push([a, b]);
    }
  };
  for (let b = 2; b <= 24; b++) for (let a = 1; a < b; a++) add(a, b);
  for (const [a, b] of NOTABLE) add(a, b);
  return out;
}

const PAIRS = buildPairs();

export interface SimplifyPage {
  a: number;
  b: number;
  slug: string; // "12-16"
}

export const SIMPLIFY_PAGES: SimplifyPage[] = PAIRS.map(([a, b]) => ({
  a,
  b,
  slug: `${a}-${b}`,
}));

const KEY = new Set(SIMPLIFY_PAGES.map((p) => p.slug));

export function parseSimplifySlug(slug: string): SimplifyPage | null {
  const m = /^(\d+)-(\d+)$/.exec(slug);
  if (!m) return null;
  if (!KEY.has(slug)) return null;
  const a = Number(m[1]);
  const b = Number(m[2]);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return { a, b, slug };
}

export interface Simplified {
  g: number;
  na: number; // simplified numerator
  nb: number; // simplified denominator
  decimal: string;
  percent: string;
}

export function simplify(a: number, b: number): Simplified {
  const g = gcd(a, b);
  const na = a / g;
  const nb = b / g;
  const dec = Number((a / b).toFixed(6));
  const pct = Number(((a / b) * 100).toFixed(4));
  return { g, na, nb, decimal: String(dec), percent: String(pct) };
}

/** A couple of equivalent fractions (the simplest form scaled up). */
export function equivalents(na: number, nb: number, count = 3): string[] {
  return Array.from({ length: count }, (_, i) => {
    const k = i + 2;
    return `${na * k}/${nb * k}`;
  });
}

export { gcd };

/** Nearby pairs that share the numerator or denominator, for internal links. */
export function relatedSimplify(page: SimplifyPage, n = 6): SimplifyPage[] {
  const out: SimplifyPage[] = [];
  for (const p of SIMPLIFY_PAGES) {
    if (p.slug === page.slug) continue;
    if (p.b === page.b || p.a === page.a) {
      out.push(p);
      if (out.length >= n) break;
    }
  }
  return out;
}
