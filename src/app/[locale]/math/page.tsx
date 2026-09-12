import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale } from "@/lib/i18n/config";
import { getCategory } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CategoryPage } from "@/components/category-page";

const CAT = getCategory("math");

// Representative pages from each programmatic math cluster, surfaced on the
// silo root so these large sections are one click from the category hub
// (better internal linking + shallower crawl depth). All verified live.
const LOOKUP_GROUPS: { label: string; links: { href: string; text: string }[] }[] = [
  {
    label: "Fractions, decimals & percentages",
    links: [
      { href: "simplify/12-16", text: "Simplify 12/16" },
      { href: "decimal-to-fraction/0-75", text: "0.75 as a fraction" },
      { href: "fraction-to-decimal/3-8", text: "3/8 as a decimal" },
      { href: "percent/60", text: "60% as a fraction" },
    ],
  },
  {
    label: "Factors, primes & multiples",
    links: [
      { href: "factors/24", text: "Factors of 24" },
      { href: "gcf-lcm/12-18", text: "GCF & LCM of 12 and 18" },
      { href: "is-prime/97", text: "Is 97 prime?" },
      { href: "multiples/7", text: "Multiples of 7" },
    ],
  },
  {
    label: "Writing numbers",
    links: [{ href: "number-in-words/1000", text: "1000 in words" }],
  },
];

function PopularLookups({ locale }: { locale: string }) {
  return (
    <section>
      <h2 className="text-xl font-semibold">Popular math lookups</h2>
      <p className="mt-2 text-[var(--ink-soft)]">
        Jump straight to a worked answer for the most-searched conversions and
        number questions:
      </p>
      <div className="mt-4 space-y-4">
        {LOOKUP_GROUPS.map((g) => (
          <div key={g.label}>
            <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
              {g.label}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {g.links.map((l) => (
                <Link
                  key={l.href}
                  href={`/${locale}/${l.href}`}
                  className="rounded-lg border border-[var(--rule)] px-3 py-1.5 text-sm text-[var(--accent)] hover:border-[var(--accent)]"
                >
                  {l.text}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({
    locale,
    path: CAT.slug,
    title: `${CAT.title} Calculators`,
    description: CAT.blurb,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <CategoryPage
      locale={locale}
      categoryId="math"
      extra={<PopularLookups locale={locale} />}
    />
  );
}
