// Programmatic "Factors of N" pages: "/factors/<n>".
//
// Evergreen homework demand ("factors of 24", "prime factorization of 100").
// Each page gives the full factor list, factor pairs, the prime factorization,
// the divisor count and sum, and whether the number is prime — rich enough to
// avoid thin-content issues, and unique per number.

const int = (a: number, b: number) =>
  Array.from({ length: b - a + 1 }, (_, i) => a + i);

// 2..200 covers the overwhelming majority of "factors of X" searches; the
// notable list adds common bigger round numbers people look up.
const NOTABLE = [
  216, 225, 240, 250, 256, 288, 300, 360, 400, 500, 512, 625, 1000, 1024,
];

const NUMBERS: number[] = [...int(2, 200), ...NOTABLE];

export interface FactorPage {
  n: number;
  slug: string; // "24"
}

export const FACTOR_PAGES: FactorPage[] = NUMBERS.map((n) => ({
  n,
  slug: String(n),
}));

const KNOWN = new Set(NUMBERS);

/** Parse "24" → { n: 24, slug } if it's a known page. */
export function parseFactorSlug(slug: string): FactorPage | null {
  if (!/^\d+$/.test(slug)) return null;
  const n = Number(slug);
  if (!KNOWN.has(n)) return null;
  return { n, slug };
}

/** Prime factorization as [prime, exponent] pairs. */
export function factorize(n: number): [number, number][] {
  const out: [number, number][] = [];
  let m = n;
  let e2 = 0;
  while (m % 2 === 0) {
    m /= 2;
    e2++;
  }
  if (e2 > 0) out.push([2, e2]);
  for (let p = 3; p * p <= m; p += 2) {
    if (m % p === 0) {
      let e = 0;
      while (m % p === 0) {
        m /= p;
        e++;
      }
      out.push([p, e]);
    }
  }
  if (m > 1) out.push([m, 1]);
  return out;
}

/** All positive divisors of n, ascending. */
export function divisorsOf(n: number): number[] {
  const small: number[] = [];
  const big: number[] = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      small.push(i);
      if (i !== n / i) big.push(n / i);
    }
  }
  return [...small, ...big.reverse()];
}

/** Factor pairs [a, b] with a ≤ b and a·b = n. */
export function factorPairs(n: number): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) out.push([i, n / i]);
  }
  return out;
}

const SUP: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
};
export const toSuper = (n: number) =>
  String(n).split("").map((d) => SUP[d] ?? d).join("");

/** "2³ × 3² × 5", or the number itself when prime. */
export function factorizationString(n: number): string {
  const f = factorize(n);
  if (f.length === 0) return String(n);
  return f
    .map(([p, e]) => (e === 1 ? `${p}` : `${p}${toSuper(e)}`))
    .join(" × ");
}

export function isPrime(n: number): boolean {
  const f = factorize(n);
  return f.length === 1 && f[0][1] === 1;
}

/** Thousands separators. */
export function groupNum(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Nearby known numbers for an internal-link table (previous/next in the set). */
export function nearbyNumbers(n: number, span = 4): number[] {
  const idx = NUMBERS.indexOf(n);
  const start = Math.max(0, idx - span);
  return NUMBERS.slice(start, start + span * 2 + 1);
}
