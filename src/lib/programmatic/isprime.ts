// Programmatic "Is N a prime number?" pages: "/is-prime/<n>".
//
// Homework-driven ("is 91 prime", "is 51 a prime number") and evergreen. Like
// factors/multiples/GCF-LCM, these rarely trigger a Google instant-answer
// widget, so clicks reach the page. Each page gives a yes/no, the reason
// (smallest factor / factorization), the method, and related numbers.

import { factorString } from "./gcflcm";

const range = (a: number, b: number) =>
  Array.from({ length: b - a + 1 }, (_, i) => a + i);

const NOTABLE = [
  121, 125, 129, 133, 143, 147, 161, 169, 171, 187, 200, 203, 209, 217,
  221, 247, 253, 289, 299, 301, 323, 341, 361, 391, 500, 501, 511, 989,
  997, 999, 1000,
];

const NUMS = [...new Set([...range(1, 120), ...NOTABLE])].sort((a, b) => a - b);

export interface IsPrimePage {
  n: number;
  slug: string; // "91"
}

export const ISPRIME_PAGES: IsPrimePage[] = NUMS.map((n) => ({
  n,
  slug: String(n),
}));

const KEY = new Set(ISPRIME_PAGES.map((p) => p.slug));

export function parseIsPrimeSlug(slug: string): IsPrimePage | null {
  if (!/^\d+$/.test(slug)) return null;
  if (!KEY.has(slug)) return null;
  const n = Number(slug);
  if (!Number.isFinite(n)) return null;
  return { n, slug };
}

export function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let p = 3; p * p <= n; p += 2) if (n % p === 0) return false;
  return true;
}

/** Smallest prime factor of a composite n (or n itself if prime / n < 2). */
export function smallestFactor(n: number): number {
  if (n < 2) return n;
  if (n % 2 === 0) return 2;
  for (let p = 3; p * p <= n; p += 2) if (n % p === 0) return p;
  return n;
}

export { factorString };

/** Nearby numbers that also have a page, for internal links. */
export function relatedIsPrime(page: IsPrimePage, span = 8): IsPrimePage[] {
  const idx = ISPRIME_PAGES.findIndex((p) => p.slug === page.slug);
  const out: IsPrimePage[] = [];
  for (let d = 1; out.length < span && d < ISPRIME_PAGES.length; d++) {
    const before = ISPRIME_PAGES[idx - d];
    const after = ISPRIME_PAGES[idx + d];
    if (before) out.push(before);
    if (after && out.length < span) out.push(after);
  }
  return out.sort((a, b) => a.n - b.n);
}
