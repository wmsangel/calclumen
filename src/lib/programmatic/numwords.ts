// Programmatic "N in words" pages: "/number-in-words/<n>".
//
// Homework and cheque-writing demand ("1000 in words", "1234 in words") and
// click-friendly — search engines don't spell numbers out in a widget. Pairs
// with the number-to-words calculator. Self-contained integer→words so the
// calculator component stays untouched.

const ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
  "sixteen", "seventeen", "eighteen", "nineteen",
];
const TENS = [
  "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty",
  "ninety",
];
const SCALES = ["", "thousand", "million", "billion", "trillion"];

function underThousand(n: number): string {
  let s = "";
  if (n >= 100) {
    s += `${ONES[Math.floor(n / 100)]} hundred`;
    n %= 100;
    if (n) s += " ";
  }
  if (n >= 20) {
    s += TENS[Math.floor(n / 10)];
    if (n % 10) s += `-${ONES[n % 10]}`;
  } else if (n > 0) {
    s += ONES[n];
  }
  return s;
}

/** Spell a whole number in words, e.g. 1234 -> "one thousand two hundred thirty-four". */
export function integerToWords(n: number): string {
  if (n === 0) return "zero";
  const groups: number[] = [];
  let x = n;
  while (x > 0) {
    groups.push(x % 1000);
    x = Math.floor(x / 1000);
  }
  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] === 0) continue;
    const scale = SCALES[i] ? ` ${SCALES[i]}` : "";
    parts.push(underThousand(groups[i]) + scale);
  }
  return parts.join(" ");
}

/** Title-case each word, e.g. "one thousand" -> "One Thousand". */
export function titleCaseWords(s: string): string {
  return s.replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

const NUMBERS = [
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 25, 30, 40, 45, 50, 60, 70, 80,
  90, 99, 100, 101, 110, 111, 120, 150, 200, 250, 300, 350, 400, 500, 600,
  700, 750, 800, 900, 999, 1000, 1001, 1234, 1500, 2000, 2020, 2024, 2500,
  3000, 4000, 5000, 7500, 10000, 15000, 20000, 25000, 50000, 75000, 100000,
  250000, 500000, 1000000, 1000000000,
];

export interface NumWordsPage {
  n: number;
  slug: string; // "1000"
}

export const NUMWORDS_PAGES: NumWordsPage[] = NUMBERS.map((n) => ({
  n,
  slug: String(n),
}));

const KEY = new Set(NUMWORDS_PAGES.map((p) => p.slug));

export function parseNumWordsSlug(slug: string): NumWordsPage | null {
  if (!/^\d+$/.test(slug) || !KEY.has(slug)) return null;
  return { n: Number(slug), slug };
}

/** Nearby numbers with a page, for internal links. */
export function relatedNumbers(page: NumWordsPage, n = 8): NumWordsPage[] {
  const idx = NUMWORDS_PAGES.findIndex((p) => p.slug === page.slug);
  const out: NumWordsPage[] = [];
  for (let d = 1; out.length < n && d < NUMWORDS_PAGES.length; d++) {
    const before = NUMWORDS_PAGES[idx - d];
    const after = NUMWORDS_PAGES[idx + d];
    if (before) out.push(before);
    if (after && out.length < n) out.push(after);
  }
  return out;
}
