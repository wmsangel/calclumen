// Programmatic unit-conversion answer pages: "/units/<n>-<from>-to-<to>".
//
// Unlike the percent (/X-percent-of-Y) and currency (/convert/…) templates,
// these are INDEXABLE: each page carries a unique answer, a worked formula, a
// conversion table with internal links, and its own FAQ.
//
// To add a conversion type, append an entry to UNITS. Routes, sitemap and
// parsing are all driven off this list. `factor`/`offset` define an affine
// transform: toValue = fromValue * factor + offset (offset is only non-zero
// for temperature). `fromLabel`/`toLabel` are the display symbols (e.g. °C)
// while `fromUnit`/`toUnit` are the ASCII slug/keyword words.

export interface UnitConversion {
  id: string; // "kg-to-lbs" (must equal `${fromUnit}-to-${toUnit}`)
  fromUnit: string; // slug/keyword word: "kg", "celsius"
  toUnit: string;
  fromLabel?: string; // display symbol, defaults to fromUnit: "°C"
  toLabel?: string;
  fromName: string; // prose plural: "kilograms", "degrees Celsius"
  toName: string;
  fromNameSingular: string;
  toNameSingular: string;
  factor: number;
  offset?: number; // affine offset (temperature only)
  precision: number;
  category: string; // "weight" | "length" | "temperature" …
  converterSlug: string; // full interactive tool to link to
  values: number[]; // amounts that each get their own page
}

const int = (a: number, b: number) =>
  Array.from({ length: b - a + 1 }, (_, i) => a + i);

// Value sets tuned to what people actually search, not 1..1000.
const WEIGHTS = [...int(1, 100), 110, 120, 130, 140, 150, 160, 170, 180, 200, 250, 300, 500];
const DISTANCES = [...int(1, 100), 110, 120, 150, 200, 250, 300, 500];
const SMALL = int(1, 100);
const CM = int(1, 200);
const CELSIUS = [...int(0, 50), 100, 120, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250];
const FAHRENHEIT = [...int(0, 120), 300, 325, 350, 375, 400, 425, 450, 475, 500];
const ML = [...int(1, 20), 25, 30, 50, 100, 118, 150, 200, 237, 250, 300, 355, 473, 500, 750, 1000];
const FLOZ = [...int(1, 20), 24, 32];
const L = [...int(1, 20), 25, 30, 40, 50, 100];
const GAL = [...int(1, 20), 25, 50, 100];
const STONE = int(1, 30);
const GRAMS = [...int(1, 20), 25, 30, 40, 50, 75, 100, 125, 150, 200, 250, 300, 400, 500, 750, 1000];
const OZW = [...int(1, 20), 24, 32];
const SPEED = [...int(1, 120), 130, 140, 150, 200];
const SQFT = [...int(1, 20), 25, 50, 75, 100, 150, 200, 250, 300, 400, 500, 600, 700, 750, 800, 900, 1000, 1200, 1500, 2000, 2500, 3000];
const SQM = [...int(1, 20), 25, 30, 40, 50, 60, 70, 75, 80, 90, 100, 120, 150, 200, 250, 300, 500, 1000];
const ACRES = [...int(1, 20), 25, 40, 50, 100, 160, 200, 500, 1000];
const HECTARES = [...int(1, 20), 25, 50, 100, 200, 500, 1000];
const YARDS = [...int(1, 100), 110, 120, 150, 200, 250, 300, 500];
const MM = [...int(1, 100), 110, 120, 150, 200, 250, 300, 500];
const CUPS = [...int(1, 16), 20, 24];

export const UNITS: UnitConversion[] = [
  {
    id: "kg-to-lbs", fromUnit: "kg", toUnit: "lbs",
    fromName: "kilograms", toName: "pounds",
    fromNameSingular: "kilogram", toNameSingular: "pound",
    factor: 2.2046226218, precision: 3,
    category: "weight", converterSlug: "weight-converter", values: WEIGHTS,
  },
  {
    id: "lbs-to-kg", fromUnit: "lbs", toUnit: "kg",
    fromName: "pounds", toName: "kilograms",
    fromNameSingular: "pound", toNameSingular: "kilogram",
    factor: 0.45359237, precision: 3,
    category: "weight", converterSlug: "weight-converter", values: WEIGHTS,
  },
  {
    id: "cm-to-inches", fromUnit: "cm", toUnit: "inches",
    fromName: "centimeters", toName: "inches",
    fromNameSingular: "centimeter", toNameSingular: "inch",
    factor: 0.3937007874, precision: 3,
    category: "length", converterSlug: "length-converter", values: CM,
  },
  {
    id: "inches-to-cm", fromUnit: "inches", toUnit: "cm",
    fromName: "inches", toName: "centimeters",
    fromNameSingular: "inch", toNameSingular: "centimeter",
    factor: 2.54, precision: 2,
    category: "length", converterSlug: "length-converter", values: SMALL,
  },
  {
    id: "miles-to-km", fromUnit: "miles", toUnit: "km",
    fromName: "miles", toName: "kilometers",
    fromNameSingular: "mile", toNameSingular: "kilometer",
    factor: 1.609344, precision: 3,
    category: "length", converterSlug: "length-converter", values: DISTANCES,
  },
  {
    id: "km-to-miles", fromUnit: "km", toUnit: "miles",
    fromName: "kilometers", toName: "miles",
    fromNameSingular: "kilometer", toNameSingular: "mile",
    factor: 0.6213711922, precision: 3,
    category: "length", converterSlug: "length-converter", values: DISTANCES,
  },
  {
    id: "feet-to-meters", fromUnit: "feet", toUnit: "meters",
    fromName: "feet", toName: "meters",
    fromNameSingular: "foot", toNameSingular: "meter",
    factor: 0.3048, precision: 3,
    category: "length", converterSlug: "length-converter", values: SMALL,
  },
  {
    id: "meters-to-feet", fromUnit: "meters", toUnit: "feet",
    fromName: "meters", toName: "feet",
    fromNameSingular: "meter", toNameSingular: "foot",
    factor: 3.280839895, precision: 3,
    category: "length", converterSlug: "length-converter", values: SMALL,
  },
  {
    id: "celsius-to-fahrenheit", fromUnit: "celsius", toUnit: "fahrenheit",
    fromLabel: "°C", toLabel: "°F",
    fromName: "degrees Celsius", toName: "degrees Fahrenheit",
    fromNameSingular: "degree Celsius", toNameSingular: "degree Fahrenheit",
    factor: 1.8, offset: 32, precision: 1,
    category: "temperature", converterSlug: "temperature-converter", values: CELSIUS,
  },
  {
    id: "fahrenheit-to-celsius", fromUnit: "fahrenheit", toUnit: "celsius",
    fromLabel: "°F", toLabel: "°C",
    fromName: "degrees Fahrenheit", toName: "degrees Celsius",
    fromNameSingular: "degree Fahrenheit", toNameSingular: "degree Celsius",
    factor: 0.5555555556, offset: -17.7777778, precision: 1,
    category: "temperature", converterSlug: "temperature-converter", values: FAHRENHEIT,
  },
  {
    id: "ml-to-oz", fromUnit: "ml", toUnit: "oz", toLabel: "fl oz",
    fromName: "milliliters", toName: "fluid ounces",
    fromNameSingular: "milliliter", toNameSingular: "fluid ounce",
    factor: 0.0338140227, precision: 3,
    category: "volume", converterSlug: "volume-converter", values: ML,
  },
  {
    id: "oz-to-ml", fromUnit: "oz", toUnit: "ml", fromLabel: "fl oz",
    fromName: "fluid ounces", toName: "milliliters",
    fromNameSingular: "fluid ounce", toNameSingular: "milliliter",
    factor: 29.5735296, precision: 2,
    category: "volume", converterSlug: "volume-converter", values: FLOZ,
  },
  {
    id: "l-to-gallons", fromUnit: "l", toUnit: "gallons", fromLabel: "L",
    fromName: "liters", toName: "gallons",
    fromNameSingular: "liter", toNameSingular: "gallon",
    factor: 0.2641720524, precision: 3,
    category: "volume", converterSlug: "volume-converter", values: L,
  },
  {
    id: "gallons-to-l", fromUnit: "gallons", toUnit: "l", toLabel: "L",
    fromName: "gallons", toName: "liters",
    fromNameSingular: "gallon", toNameSingular: "liter",
    factor: 3.785411784, precision: 3,
    category: "volume", converterSlug: "volume-converter", values: GAL,
  },
  {
    id: "kg-to-stone", fromUnit: "kg", toUnit: "stone",
    fromName: "kilograms", toName: "stone",
    fromNameSingular: "kilogram", toNameSingular: "stone",
    factor: 0.1574730444, precision: 3,
    category: "weight", converterSlug: "weight-converter", values: WEIGHTS,
  },
  {
    id: "stone-to-kg", fromUnit: "stone", toUnit: "kg",
    fromName: "stone", toName: "kilograms",
    fromNameSingular: "stone", toNameSingular: "kilogram",
    factor: 6.35029318, precision: 3,
    category: "weight", converterSlug: "weight-converter", values: STONE,
  },
  {
    id: "grams-to-oz", fromUnit: "grams", toUnit: "oz",
    fromName: "grams", toName: "ounces",
    fromNameSingular: "gram", toNameSingular: "ounce",
    factor: 0.0352739619, precision: 3,
    category: "weight", converterSlug: "weight-converter", values: GRAMS,
  },
  {
    id: "oz-to-grams", fromUnit: "oz", toUnit: "grams",
    fromName: "ounces", toName: "grams",
    fromNameSingular: "ounce", toNameSingular: "gram",
    factor: 28.3495231, precision: 2,
    category: "weight", converterSlug: "weight-converter", values: OZW,
  },
  {
    id: "mph-to-kph", fromUnit: "mph", toUnit: "kph",
    fromName: "miles per hour", toName: "kilometers per hour",
    fromNameSingular: "mile per hour", toNameSingular: "kilometer per hour",
    factor: 1.609344, precision: 2,
    category: "speed", converterSlug: "speed-converter", values: SPEED,
  },
  {
    id: "kph-to-mph", fromUnit: "kph", toUnit: "mph",
    fromName: "kilometers per hour", toName: "miles per hour",
    fromNameSingular: "kilometer per hour", toNameSingular: "mile per hour",
    factor: 0.6213711922, precision: 2,
    category: "speed", converterSlug: "speed-converter", values: SPEED,
  },
  {
    id: "sqft-to-sqm", fromUnit: "sqft", toUnit: "sqm",
    fromLabel: "sq ft", toLabel: "m²",
    fromName: "square feet", toName: "square meters",
    fromNameSingular: "square foot", toNameSingular: "square meter",
    factor: 0.09290304, precision: 3,
    category: "area", converterSlug: "area-converter", values: SQFT,
  },
  {
    id: "sqm-to-sqft", fromUnit: "sqm", toUnit: "sqft",
    fromLabel: "m²", toLabel: "sq ft",
    fromName: "square meters", toName: "square feet",
    fromNameSingular: "square meter", toNameSingular: "square foot",
    factor: 10.7639104167, precision: 2,
    category: "area", converterSlug: "area-converter", values: SQM,
  },
  {
    id: "acres-to-hectares", fromUnit: "acres", toUnit: "hectares",
    fromName: "acres", toName: "hectares",
    fromNameSingular: "acre", toNameSingular: "hectare",
    factor: 0.40468564224, precision: 3,
    category: "area", converterSlug: "area-converter", values: ACRES,
  },
  {
    id: "hectares-to-acres", fromUnit: "hectares", toUnit: "acres",
    fromName: "hectares", toName: "acres",
    fromNameSingular: "hectare", toNameSingular: "acre",
    factor: 2.4710538147, precision: 3,
    category: "area", converterSlug: "area-converter", values: HECTARES,
  },
  {
    id: "meters-to-yards", fromUnit: "meters", toUnit: "yards",
    fromName: "meters", toName: "yards",
    fromNameSingular: "meter", toNameSingular: "yard",
    factor: 1.0936132983, precision: 3,
    category: "length", converterSlug: "length-converter", values: YARDS,
  },
  {
    id: "yards-to-meters", fromUnit: "yards", toUnit: "meters",
    fromName: "yards", toName: "meters",
    fromNameSingular: "yard", toNameSingular: "meter",
    factor: 0.9144, precision: 3,
    category: "length", converterSlug: "length-converter", values: YARDS,
  },
  {
    id: "mm-to-inches", fromUnit: "mm", toUnit: "inches",
    fromName: "millimeters", toName: "inches",
    fromNameSingular: "millimeter", toNameSingular: "inch",
    factor: 0.0393700787, precision: 3,
    category: "length", converterSlug: "length-converter", values: MM,
  },
  {
    id: "inches-to-mm", fromUnit: "inches", toUnit: "mm",
    fromName: "inches", toName: "millimeters",
    fromNameSingular: "inch", toNameSingular: "millimeter",
    factor: 25.4, precision: 2,
    category: "length", converterSlug: "length-converter", values: SMALL,
  },
  {
    id: "ml-to-cups", fromUnit: "ml", toUnit: "cups",
    fromName: "milliliters", toName: "cups",
    fromNameSingular: "milliliter", toNameSingular: "cup",
    factor: 0.0042267528, precision: 3,
    category: "volume", converterSlug: "volume-converter", values: ML,
  },
  {
    id: "cups-to-ml", fromUnit: "cups", toUnit: "ml",
    fromName: "cups", toName: "milliliters",
    fromNameSingular: "cup", toNameSingular: "milliliter",
    factor: 236.5882365, precision: 1,
    category: "volume", converterSlug: "volume-converter", values: CUPS,
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
  return value * conv.factor + (conv.offset ?? 0);
}

/** Anchor amounts every page links to (plus the current value) — a small,
 *  consistent internal-link graph across each conversion type. */
export function tableValues(conv: UnitConversion, current: number): number[] {
  const anchors = [1, 5, 10, 20, 50, 75, 100].filter((v) =>
    conv.values.includes(v),
  );
  const set = new Set(anchors);
  set.add(current);
  return [...set].sort((a, b) => a - b);
}

/** Conversion types whose interactive tool is `converterSlug` — used to build
 *  "Popular conversions" hubs on the converter pages. */
export function typesForConverter(converterSlug: string): UnitConversion[] {
  return UNITS.filter((u) => u.converterSlug === converterSlug);
}

// Ordered by how often people search each amount (body weights, heights,
// oven temps first), so the "popular" links pick sensible defaults per type.
const POPULAR_PREF = [70, 60, 80, 50, 100, 10, 20, 30, 75, 90, 175, 180, 160, 150, 200, 5, 40, 25, 350, 400, 180];

/** A handful of commonly-searched values that exist for this type. */
export function popularValues(conv: UnitConversion, n = 6): number[] {
  const out: number[] = [];
  for (const v of POPULAR_PREF) {
    if (conv.values.includes(v) && !out.includes(v)) out.push(v);
    if (out.length >= n) break;
  }
  // Fallback: if the preference list didn't fill up, take the first values.
  for (const v of conv.values) {
    if (out.length >= n) break;
    if (!out.includes(v)) out.push(v);
  }
  return out;
}

/** The reverse conversion type (kg→lbs ⇄ lbs→kg), if one exists. */
export function reverseConv(conv: UnitConversion): UnitConversion | null {
  return BY_ID.get(`${conv.toUnit}-to-${conv.fromUnit}`) ?? null;
}

/** Other conversion types in the same category (e.g. other length units). */
export function siblingTypes(conv: UnitConversion): UnitConversion[] {
  return UNITS.filter(
    (u) => u.category === conv.category && u.id !== conv.id,
  );
}
