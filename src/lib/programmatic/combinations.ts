// Programmatic "n choose k" pages: "/combinations/<n>-choose-<k>".
//
// Evergreen and unambiguous (unlike currency, the answer never changes).
// Bing shows combinatorics demand ("number of ways to…"). Each page gives the
// combination C(n,k), the permutation P(n,k), the formula and a nearby table.

const int = (a: number, b: number) =>
  Array.from({ length: b - a + 1 }, (_, i) => a + i);

// Small n (1..12) with every k covers homework "n choose k"; the notable
// pairs cover lottery/poker/common lookups.
const NOTABLE: [number, number][] = [
  [13, 5], [15, 5], [16, 2], [20, 10], [39, 5], [45, 6], [48, 6],
  [49, 6], [52, 2], [52, 5], [52, 13], [59, 6], [69, 5], [70, 5],
  [100, 2], [100, 3],
];

function buildPairs(): [number, number][] {
  const seen = new Set<string>();
  const out: [number, number][] = [];
  const add = (n: number, k: number) => {
    const key = `${n}-${k}`;
    if (k >= 0 && k <= n && !seen.has(key)) {
      seen.add(key);
      out.push([n, k]);
    }
  };
  for (const n of int(2, 12)) for (const k of int(0, n)) add(n, k);
  for (const [n, k] of NOTABLE) add(n, k);
  return out;
}

const PAIRS = buildPairs();

/** C(n, k) as an exact BigInt. */
export function nCr(n: number, k: number): bigint {
  if (k < 0 || k > n) return BigInt(0);
  const kk = Math.min(k, n - k);
  let num = BigInt(1);
  let den = BigInt(1);
  for (let i = 0; i < kk; i++) {
    num *= BigInt(n - i);
    den *= BigInt(i + 1);
  }
  return num / den;
}

/** P(n, k) = n! / (n−k)! as an exact BigInt. */
export function nPr(n: number, k: number): bigint {
  if (k < 0 || k > n) return BigInt(0);
  let out = BigInt(1);
  for (let i = 0; i < k; i++) out *= BigInt(n - i);
  return out;
}

/** Thousands separators for a (possibly huge) BigInt. */
export function groupBig(b: bigint): string {
  return b.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export interface ChoosePage {
  n: number;
  k: number;
  slug: string; // "5-choose-2"
}

export const CHOOSE_PAGES: ChoosePage[] = PAIRS.map(([n, k]) => ({
  n,
  k,
  slug: `${n}-choose-${k}`,
}));

const PAGE_SLUGS = new Set(CHOOSE_PAGES.map((p) => p.slug));

export function parseChooseSlug(slug: string): ChoosePage | null {
  const m = /^(\d+)-choose-(\d+)$/.exec(slug);
  if (!m) return null;
  if (!PAGE_SLUGS.has(slug)) return null;
  return { n: Number(m[1]), k: Number(m[2]), slug };
}

/** k values around the current one that also have pages, for the table. */
export function chooseTableKs(n: number, current: number): number[] {
  const ks = int(0, n).filter((k) => PAGE_SLUGS.has(`${n}-choose-${k}`));
  return ks;
}
