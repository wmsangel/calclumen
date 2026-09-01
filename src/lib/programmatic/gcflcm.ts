// Programmatic "GCF and LCM of A and B" pages: "/gcf-lcm/<a>-and-<b>".
//
// Homework-driven and evergreen (the answer never changes), and — unlike unit
// conversions — Google rarely shows an instant-answer widget for these, so the
// clicks actually reach the page. Each page gives GCF (a.k.a. GCD) and LCM,
// the prime factorizations, the method, and a small table of related pairs.

const int = (a: number, b: number) =>
  Array.from({ length: b - a + 1 }, (_, i) => a + i);

// Larger pairs people actually search, on top of the systematic 2..20 grid.
const NOTABLE: [number, number][] = [
  [12, 18], [24, 36], [15, 20], [16, 24], [12, 16], [20, 30], [25, 50],
  [30, 45], [24, 40], [36, 48], [18, 24], [50, 75], [75, 100], [24, 60],
  [48, 72], [60, 90], [100, 150], [14, 21], [27, 36], [40, 60], [35, 50],
  [45, 60], [21, 28], [32, 48], [54, 72], [64, 96], [15, 25], [18, 27],
  [28, 42], [33, 44], [16, 20], [10, 25], [12, 30], [20, 50], [36, 60],
  [42, 56], [44, 66], [40, 100], [60, 80], [72, 108],
];

function buildPairs(): [number, number][] {
  const seen = new Set<string>();
  const out: [number, number][] = [];
  const add = (x: number, y: number) => {
    const a = Math.min(x, y);
    const b = Math.max(x, y);
    const key = `${a}-${b}`;
    if (a >= 1 && a !== b && !seen.has(key)) {
      seen.add(key);
      out.push([a, b]);
    }
  };
  for (const a of int(2, 20)) for (const b of int(2, 20)) if (a < b) add(a, b);
  for (const [a, b] of NOTABLE) add(a, b);
  return out;
}

const PAIRS = buildPairs();

export interface GcfLcmPage {
  a: number;
  b: number;
  slug: string; // "12-and-18"
}

export const GCFLCM_PAGES: GcfLcmPage[] = PAIRS.map(([a, b]) => ({
  a,
  b,
  slug: `${a}-and-${b}`,
}));

const KEY = new Set(GCFLCM_PAGES.map((p) => p.slug));

export function parseGcfLcmSlug(slug: string): GcfLcmPage | null {
  const m = /^(\d+)-and-(\d+)$/.exec(slug);
  if (!m) return null;
  if (!KEY.has(slug)) return null;
  const a = Number(m[1]);
  const b = Number(m[2]);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return { a, b, slug };
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return (a / gcd(a, b)) * b;
}

/** Prime factorization as a display string, e.g. "2² × 3". */
export function factorString(n: number): string {
  if (n < 2) return String(n);
  const SUP: Record<string, string> = {
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
    "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  };
  const sup = (e: number) =>
    e === 1 ? "" : String(e).split("").map((d) => SUP[d] ?? d).join("");
  const parts: string[] = [];
  let m = n;
  for (let p = 2; p * p <= m; p++) {
    if (m % p === 0) {
      let e = 0;
      while (m % p === 0) {
        m /= p;
        e++;
      }
      parts.push(`${p}${sup(e)}`);
    }
  }
  if (m > 1) parts.push(`${m}`);
  return parts.join(" × ");
}

/** A few related pairs (share a number with the current one) for internal links. */
export function relatedPairs(page: GcfLcmPage, n = 6): GcfLcmPage[] {
  const out: GcfLcmPage[] = [];
  for (const p of GCFLCM_PAGES) {
    if (p.slug === page.slug) continue;
    if (p.a === page.a || p.b === page.b || p.a === page.b || p.b === page.a) {
      out.push(p);
      if (out.length >= n) break;
    }
  }
  return out;
}
