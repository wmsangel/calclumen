// Programmatic unit-conversion answer pages: "/units/<n>-<from>-to-<to>".
//
// Unlike the percent (/X-percent-of-Y) and currency (/convert/…) templates,
// these are INDEXABLE: each page carries a unique answer, a worked formula, a
// conversion table with internal links, and its own FAQ — enough to earn a
// place in the index rather than read as a thin doorway.
//
// To scale to new conversion types, add entries to UNITS. Everything else
// (routes, sitemap, parsing) is driven off this list.

export interface UnitConversion {
  id: string; // "kg-to-lbs"
  fromUnit: string; // "kg"
  toUnit: string; // "lbs"
  fromName: string; // plural, lower-case: "kilograms"
  toName: string; // "pounds"
  fromNameSingular: string; // "kilogram"
  toNameSingular: string; // "pound"
  factor: number; // multiply a fromUnit value by this to get toUnit
  precision: number; // decimals in the result
  category: string; // for copy: "weight"
  converterSlug: string; // the full interactive tool to link to
  values: number[]; // which amounts each get their own page
}

// The amounts people actually search for a weight conversion: every whole
// number up to 100 covers the bulk ("60 kg to lbs", "75 kg to lbs", …), plus
// common larger round numbers.
const COMMON_WEIGHTS = [
  ...Array.from({ length: 100 }, (_, i) => i + 1),
  110, 120, 130, 140, 150, 160, 170, 180, 200, 250, 300, 500,
];

export const UNITS: UnitConversion[] = [
  {
    id: "kg-to-lbs",
    fromUnit: "kg",
    toUnit: "lbs",
    fromName: "kilograms",
    toName: "pounds",
    fromNameSingular: "kilogram",
    toNameSingular: "pound",
    factor: 2.2046226218,
    precision: 3,
    category: "weight",
    converterSlug: "weight-converter",
    values: COMMON_WEIGHTS,
  },
];

const BY_ID = new Map(UNITS.map((u) => [u.id, u]));

export interface UnitPage {
  conv: UnitConversion;
  value: number;
  slug: string; // "10-kg-to-lbs"
}

export const UNIT_PAGES: UnitPage[] = UNITS.flatMap((conv) =>
  conv.values.map((value) => ({
    conv,
    value,
    slug: `${value}-${conv.fromUnit}-to-${conv.toUnit}`,
  })),
);

const PAGE_SLUGS = new Set(UNIT_PAGES.map((p) => p.slug));

/** Parse "10-kg-to-lbs" → its UnitPage, or null if not a known page. */
export function parseUnitSlug(slug: string): UnitPage | null {
  const m = /^(\d+(?:\.\d+)?)-([a-z]+)-to-([a-z]+)$/.exec(slug);
  if (!m) return null;
  if (!PAGE_SLUGS.has(slug)) return null;
  const value = Number(m[1]);
  const conv = BY_ID.get(`${m[2]}-to-${m[3]}`);
  if (!conv || !Number.isFinite(value)) return null;
  return { conv, value, slug };
}

export function convertUnit(value: number, conv: UnitConversion): number {
  return value * conv.factor;
}

/** Anchor amounts every page links to (plus the current value) — a small,
 *  consistent internal-link graph across the whole conversion type. */
export function tableValues(conv: UnitConversion, current: number): number[] {
  const anchors = [1, 5, 10, 20, 50, 75, 100].filter((v) =>
    conv.values.includes(v),
  );
  const set = new Set(anchors);
  set.add(current);
  return [...set].sort((a, b) => a - b);
}
