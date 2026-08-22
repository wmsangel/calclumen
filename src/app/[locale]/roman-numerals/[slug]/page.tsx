import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { absUrl, SITE_NAME } from "@/lib/seo/site";
import {
  ROMAN_PAGES,
  parseRomanSlug,
  romanBreakdown,
  romanTableValues,
  toRoman,
} from "@/lib/programmatic/roman";
import { AdSlot } from "@/components/ad-slot";
import { Stat, ToolCard } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    ROMAN_PAGES.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = parseRomanSlug(slug);
  if (!page) return {};
  return pageMetadata({
    locale,
    path: `roman-numerals/${slug}`,
    title: `${page.value} in Roman Numerals`,
    description: `${page.value} in Roman numerals is ${page.roman}. See how it's written, the breakdown, and a free Roman numeral converter.`,
    keywords: [
      `${page.value} in roman numerals`,
      `${page.value} roman numeral`,
      `roman numeral for ${page.value}`,
      `${page.value} as a roman numeral`,
    ],
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const page = parseRomanSlug(slug);
  if (!page) notFound();

  const { value, roman } = page;
  const parts = romanBreakdown(value);
  const breakdown = parts.map((p) => p.sym).join(" + ");
  const breakdownNums = parts.map((p) => p.value).join(" + ");
  const rows = romanTableValues(value);

  const q1 = `What is ${value} in Roman numerals?`;
  const a1 = `${value} in Roman numerals is ${roman}.`;
  const q2 = `How is ${value} written in Roman numerals?`;
  const a2 =
    parts.length > 1
      ? `${value} breaks down as ${breakdownNums} = ${breakdown}, which is written ${roman}.`
      : `${value} is written as the single Roman numeral ${roman}.`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: q1, acceptedAnswer: { "@type": "Answer", text: a1 } },
        { "@type": "Question", name: q2, acceptedAnswer: { "@type": "Answer", text: a2 } },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: absUrl(locale) },
        { "@type": "ListItem", position: 2, name: "Roman numerals", item: absUrl(locale, "roman-numeral-converter") },
        { "@type": "ListItem", position: 3, name: `${value} in Roman numerals`, item: absUrl(locale, `roman-numerals/${slug}`) },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="flex items-center gap-1.5 text-sm text-[var(--ink-soft)]">
        <Link href={`/${locale}`} className="hover:text-[var(--accent)]">
          Home
        </Link>
        <span>/</span>
        <Link href={`/${locale}/roman-numeral-converter`} className="hover:text-[var(--accent)]">
          Roman numerals
        </Link>
        <span>/</span>
        <span className="text-[var(--ink)]">{value} in Roman numerals</span>
      </nav>

      <h1 className="display mt-4 text-4xl sm:text-5xl">
        {value} in Roman Numerals
      </h1>

      <div className="mt-6">
        <ToolCard>
          <Stat
            label="Roman numeral"
            accent
            value={`${value} = ${roman}`}
            sub={parts.length > 1 ? `${breakdownNums} = ${breakdown}` : undefined}
          />
          <div className="mt-4 text-sm text-[var(--ink-soft)] leading-relaxed">
            The number <strong className="text-[var(--ink)]">{value}</strong> is
            written as <strong className="text-[var(--ink)]">{roman}</strong> in
            Roman numerals
            {parts.length > 1
              ? `, formed by adding ${breakdown} (${breakdownNums}).`
              : "."}
          </div>
        </ToolCard>
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Nearby numbers</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--ink-soft)]">
              <th className="py-1.5 font-medium">Number</th>
              <th className="py-1.5 font-medium">Roman numeral</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {rows.map((v) => (
              <tr key={v} className="border-t border-[var(--rule)]">
                <td className="py-1.5">
                  {v === value ? (
                    <strong>{v}</strong>
                  ) : (
                    <Link
                      href={`/${locale}/roman-numerals/${v}-in-roman-numerals`}
                      className="text-[var(--accent)] hover:underline"
                    >
                      {v}
                    </Link>
                  )}
                </td>
                <td className="py-1.5">{toRoman(v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Convert any number</h2>
        <p className="mt-2 text-[var(--ink-soft)]">
          Need a different number? The full{" "}
          <Link
            href={`/${locale}/roman-numeral-converter`}
            className="text-[var(--accent)] font-medium hover:underline"
          >
            roman numeral converter
          </Link>{" "}
          converts numbers to Roman numerals and back.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Frequently asked questions</h2>
        <div className="mt-4 space-y-2">
          {[
            { q: q1, a: a1 },
            { q: q2, a: a2 },
          ].map((f) => (
            <details key={f.q} className="group card p-4">
              <summary className="cursor-pointer font-medium list-none flex justify-between items-center gap-4">
                {f.q}
                <span className="text-[var(--accent)] text-xl group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm text-[var(--ink-soft)] leading-relaxed">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
