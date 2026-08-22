// Programmatic "N in Roman Numerals" answer pages: "/roman-numerals/<n>-in-roman-numerals".
// Indexable: each page has a unique answer, an additive breakdown, a nearby
// table with internal links, and its own FAQ. Bing already ranks our roman
// numeral converter (position ~1 with clicks), so these capture the long tail.

const int = (a: number, b: number) =>
  Array.from({ length: b - a + 1 }, (_, i) => a + i);

// Numbers people actually search: every value to 200, round numbers, and the
// years that dominate roman-numeral lookups (dates, movie/copyright years).
export const ROMAN_VALUES: number[] = [
  ...int(1, 200),
  250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000,
  1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 1950, 1970, 1980, 1990,
  2000, 2010, 2015, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027,
  2030, 2040, 2050, 2100, 3000, 3999,
];

const MAP: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"],
  [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"],
  [5, "V"], [4, "IV"], [1, "I"],
];

export function toRoman(n: number): string {
  if (!Number.isInteger(n) || n <= 0 || n >= 4000) return "";
  let out = "";
  let rem = n;
  for (const [v, s] of MAP) {
    while (rem >= v) {
      out += s;
      rem -= v;
    }
  }
  return out;
}

/** The additive pieces, e.g. 49 → [{value:40,sym:"XL"},{value:9,sym:"IX"}]. */
export function romanBreakdown(n: number): { value: number; sym: string }[] {
  const parts: { value: number; sym: string }[] = [];
  let rem = n;
  for (const [v, s] of MAP) {
    while (rem >= v) {
      parts.push({ value: v, sym: s });
      rem -= v;
    }
  }
  return parts;
}

const VALUE_SET = new Set(ROMAN_VALUES);

export interface RomanPage {
  value: number;
  roman: string;
  slug: string; // "49-in-roman-numerals"
}

export const ROMAN_PAGES: RomanPage[] = ROMAN_VALUES.map((value) => ({
  value,
  roman: toRoman(value),
  slug: `${value}-in-roman-numerals`,
}));

/** Parse "49-in-roman-numerals" → its page, or null. */
export function parseRomanSlug(slug: string): RomanPage | null {
  const m = /^(\d+)-in-roman-numerals$/.exec(slug);
  if (!m) return null;
  const value = Number(m[1]);
  if (!VALUE_SET.has(value)) return null;
  return { value, roman: toRoman(value), slug };
}

/** Anchor + nearby values every page links to (a small internal-link graph). */
export function romanTableValues(current: number): number[] {
  const anchors = [current - 2, current - 1, current, current + 1, current + 2, 10, 50, 100, 500, 1000];
  const set = new Set(anchors.filter((v) => VALUE_SET.has(v)));
  set.add(current);
  return [...set].sort((a, b) => a - b);
}
