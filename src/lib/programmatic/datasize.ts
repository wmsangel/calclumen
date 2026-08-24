// Programmatic data-storage conversion pages: "/data/<n>-<from>-to-<to>".
//
// Demand-driven (Bing shows many "1tb in gb", "convert X mb to gb" queries).
// Data storage has TWO conventions and these pages show BOTH:
//   - decimal / SI (1 GB = 1000 MB) — what drive makers and Google use; the
//     answer people usually expect for "1 tb in gb".
//   - binary / IEC (1 GiB = 1024 MB) — what operating systems report.
// Leading with decimal matches search intent; the binary value is shown too.

export interface SizeConversion {
  id: string; // "tb-to-gb" (must equal `${from}-to-${to}`)
  from: string; // slug word: "tb"
  to: string;
  fromLabel: string; // display: "TB"
  toLabel: string;
  fromName: string; // "terabytes"
  toName: string;
  values: number[];
}

// Bytes per unit, in each convention.
const DEC: Record<string, number> = {
  bit: 0.125,
  byte: 1,
  kb: 1e3,
  mb: 1e6,
  gb: 1e9,
  tb: 1e12,
  pb: 1e15,
};
const BIN: Record<string, number> = {
  bit: 0.125,
  byte: 1,
  kb: 1024,
  mb: 1024 ** 2,
  gb: 1024 ** 3,
  tb: 1024 ** 4,
  pb: 1024 ** 5,
};

const int = (a: number, b: number) =>
  Array.from({ length: b - a + 1 }, (_, i) => a + i);

const TB = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 50, 100];
const GB_BIG = [...int(1, 20), 32, 50, 64, 100, 128, 250, 256, 500, 512, 1000, 2000, 4000];
const MB_MID = [...int(1, 20), 32, 50, 64, 100, 128, 256, 500, 512, 1000, 2000];
const MB_BIG = [100, 200, 250, 300, 400, 500, 512, 750, 1000, 1500, 2000, 3000, 4000, 5000, 8000, 10000];
const KB_BIG = [100, 200, 256, 500, 512, 750, 1000, 1024, 2000, 4000];

export const SIZES: SizeConversion[] = [
  { id: "tb-to-gb", from: "tb", to: "gb", fromLabel: "TB", toLabel: "GB", fromName: "terabytes", toName: "gigabytes", values: TB },
  { id: "gb-to-tb", from: "gb", to: "tb", fromLabel: "GB", toLabel: "TB", fromName: "gigabytes", toName: "terabytes", values: GB_BIG },
  { id: "gb-to-mb", from: "gb", to: "mb", fromLabel: "GB", toLabel: "MB", fromName: "gigabytes", toName: "megabytes", values: GB_BIG },
  { id: "mb-to-gb", from: "mb", to: "gb", fromLabel: "MB", toLabel: "GB", fromName: "megabytes", toName: "gigabytes", values: MB_BIG },
  { id: "mb-to-kb", from: "mb", to: "kb", fromLabel: "MB", toLabel: "KB", fromName: "megabytes", toName: "kilobytes", values: MB_MID },
  { id: "kb-to-mb", from: "kb", to: "mb", fromLabel: "KB", toLabel: "MB", fromName: "kilobytes", toName: "megabytes", values: KB_BIG },
];

const BY_ID = new Map(SIZES.map((s) => [s.id, s]));

export interface SizePage {
  conv: SizeConversion;
  value: number;
  slug: string; // "1-tb-to-gb"
}

export const SIZE_PAGES: SizePage[] = SIZES.flatMap((conv) =>
  conv.values.map((value) => ({
    conv,
    value,
    slug: `${value}-${conv.from}-to-${conv.to}`,
  })),
);

const PAGE_SLUGS = new Set(SIZE_PAGES.map((p) => p.slug));

export function parseSizeSlug(slug: string): SizePage | null {
  const m = /^(\d+(?:\.\d+)?)-([a-z]+)-to-([a-z]+)$/.exec(slug);
  if (!m) return null;
  if (!PAGE_SLUGS.has(slug)) return null;
  const value = Number(m[1]);
  const conv = BY_ID.get(`${m[2]}-to-${m[3]}`);
  if (!conv || !Number.isFinite(value)) return null;
  return { conv, value, slug };
}

export function convertDecimal(value: number, conv: SizeConversion): number {
  return (value * DEC[conv.from]) / DEC[conv.to];
}
export function convertBinary(value: number, conv: SizeConversion): number {
  return (value * BIN[conv.from]) / BIN[conv.to];
}

/** Anchor + nearby values every page links to. */
export function sizeTableValues(conv: SizeConversion, current: number): number[] {
  const anchors = [1, 2, 5, 10, 100, 500, 1000].filter((v) =>
    conv.values.includes(v),
  );
  const set = new Set(anchors);
  set.add(current);
  return [...set].sort((a, b) => a - b);
}

/** Round-and-trim: at most 4 decimals, trailing zeros removed. */
export function fmtSize(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const s = Number(n.toFixed(4)).toString();
  return s;
}
