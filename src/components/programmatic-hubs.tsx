import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { toRoman } from "@/lib/programmatic/roman";
import { SIZES } from "@/lib/programmatic/datasize";

/**
 * Internal-linking hubs that surface the most-searched programmatic answer
 * pages (Roman numerals, data-storage conversions, "n choose k") from their
 * parent calculator. This gives crawlers a path to those pages beyond the
 * sitemap and helps users jump straight to a common lookup.
 */
function Hub({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="chip">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// Numbers people most often look up in Roman form (all exist in ROMAN_VALUES).
const ROMAN_POPULAR = [
  4, 6, 8, 9, 11, 12, 14, 16, 19, 29, 40, 44, 49, 50, 90, 99, 100, 500, 1000,
  2024, 2025,
];

export function RomanNumeralLinks({ locale }: { locale: Locale }) {
  const links = ROMAN_POPULAR.map((n) => ({
    href: `/${locale}/roman-numerals/${n}-in-roman-numerals`,
    label: `${n} = ${toRoman(n)}`,
  }));
  return <Hub title="Popular Roman numerals" links={links} />;
}

export function DataSizeLinks({ locale }: { locale: Locale }) {
  const links = SIZES.flatMap((conv) =>
    conv.values.slice(0, 4).map((v) => ({
      href: `/${locale}/data/${v}-${conv.from}-to-${conv.to}`,
      label: `${v} ${conv.fromLabel} to ${conv.toLabel}`,
    })),
  );
  return <Hub title="Popular data-storage conversions" links={links} />;
}

// Common combinatorics lookups (all exist in CHOOSE_PAGES: n≤12 all k, plus
// the lottery/poker notable pairs).
const CHOOSE_POPULAR: [number, number][] = [
  [5, 2],
  [6, 2],
  [6, 3],
  [10, 2],
  [10, 3],
  [12, 6],
  [52, 5],
  [49, 6],
  [45, 6],
  [69, 5],
  [100, 2],
];

export function CombinationsLinks({ locale }: { locale: Locale }) {
  const links = CHOOSE_POPULAR.map(([n, k]) => ({
    href: `/${locale}/combinations/${n}-choose-${k}`,
    label: `${n} choose ${k}`,
  }));
  return <Hub title="Popular combinations" links={links} />;
}
