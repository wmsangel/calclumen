import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { formatNumber } from "@/lib/format";
import { pageMetadata } from "@/lib/seo/metadata";
import { absUrl, SITE_NAME } from "@/lib/seo/site";
import {
  UNIT_PAGES,
  convertUnit,
  parseUnitSlug,
  tableValues,
} from "@/lib/programmatic/units";
import { getCalc } from "@/lib/calculators/registry";
import { AdSlot } from "@/components/ad-slot";
import { Stat, ToolCard } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    UNIT_PAGES.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = parseUnitSlug(slug);
  if (!page) return {};
  const { conv, value } = page;
  const result = formatNumber(convertUnit(value, conv), conv.precision);
  const title = `${value} ${conv.fromUnit} to ${conv.toUnit}`;
  return pageMetadata({
    locale,
    path: `units/${slug}`,
    title,
    description: `${value} ${conv.fromName} equals ${result} ${conv.toName}. See the formula, a conversion table and a free ${conv.category} converter.`,
    keywords: [
      `${value} ${conv.fromUnit} to ${conv.toUnit}`,
      `${value} ${conv.fromName} to ${conv.toName}`,
      `${value} ${conv.fromUnit} in ${conv.toUnit}`,
      `${conv.fromUnit} to ${conv.toUnit}`,
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
  const page = parseUnitSlug(slug);
  if (!page) notFound();

  const { conv, value } = page;
  const exact = convertUnit(value, conv);
  const result = formatNumber(exact, conv.precision);
  const factorStr = formatNumber(conv.factor, 5);
  const reverse = formatNumber(1 / conv.factor, 5);
  const tool = getCalc(conv.converterSlug);
  const rows = tableValues(conv, value);

  const q1 = `What is ${value} ${conv.fromUnit} in ${conv.toName}?`;
  const a1 = `${value} ${conv.fromName} equals ${result} ${conv.toName}. To convert, multiply ${value} by ${factorStr}.`;
  const q2 = `How do you convert ${conv.fromName} to ${conv.toName}?`;
  const a2 = `Multiply the number of ${conv.fromName} by ${factorStr} (1 ${conv.fromNameSingular} = ${factorStr} ${conv.toName}). For ${value}: ${value} × ${factorStr} = ${result} ${conv.toName}.`;

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
        { "@type": "ListItem", position: 2, name: "Conversions", item: absUrl(locale, "conversions") },
        { "@type": "ListItem", position: 3, name: `${value} ${conv.fromUnit} to ${conv.toUnit}`, item: absUrl(locale, `units/${slug}`) },
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
        <Link href={`/${locale}/conversions`} className="hover:text-[var(--accent)]">
          Conversions
        </Link>
        <span>/</span>
        {tool ? (
          <Link
            href={`/${locale}/${conv.converterSlug}`}
            className="hover:text-[var(--accent)]"
          >
            {tool.title}
          </Link>
        ) : (
          <span>{conv.category}</span>
        )}
        <span>/</span>
        <span className="text-[var(--ink)]">
          {value} {conv.fromUnit} → {conv.toUnit}
        </span>
      </nav>

      <h1 className="display mt-4 text-4xl sm:text-5xl">
        {value} {conv.fromUnit} to {conv.toUnit}
      </h1>
      <p className="mt-3 text-lg text-[var(--ink-soft)]">
        {value} {conv.fromName} to {conv.toName}
      </p>

      <div className="mt-6">
        <ToolCard>
          <Stat
            label="Result"
            accent
            value={`${value} ${conv.fromUnit} = ${result} ${conv.toUnit}`}
            sub={`1 ${conv.fromUnit} = ${factorStr} ${conv.toUnit} · 1 ${conv.toUnit} = ${reverse} ${conv.fromUnit}`}
          />
          <div className="mt-4 text-sm text-[var(--ink-soft)] leading-relaxed">
            To convert {conv.fromName} to {conv.toName}, multiply by{" "}
            <strong className="text-[var(--ink)]">{factorStr}</strong>. So{" "}
            {value} × {factorStr} ={" "}
            <strong className="text-[var(--ink)]">
              {result} {conv.toUnit}
            </strong>
            .
          </div>
        </ToolCard>
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold">
          {conv.fromName} to {conv.toName} table
        </h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--ink-soft)]">
              <th className="py-1.5 font-medium">{conv.fromUnit}</th>
              <th className="py-1.5 font-medium">{conv.toUnit}</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {rows.map((v) => (
              <tr key={v} className="border-t border-[var(--rule)]">
                <td className="py-1.5">
                  {v === value ? (
                    <strong>{v} {conv.fromUnit}</strong>
                  ) : (
                    <Link
                      href={`/${locale}/units/${v}-${conv.fromUnit}-to-${conv.toUnit}`}
                      className="text-[var(--accent)] hover:underline"
                    >
                      {v} {conv.fromUnit}
                    </Link>
                  )}
                </td>
                <td className="py-1.5">
                  {formatNumber(convertUnit(v, conv), conv.precision)} {conv.toUnit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Convert any value</h2>
        <p className="mt-2 text-[var(--ink-soft)]">
          Need a different amount? The full{" "}
          {tool ? (
            <Link
              href={`/${locale}/${conv.converterSlug}`}
              className="text-[var(--accent)] font-medium hover:underline"
            >
              {tool.heading.toLowerCase()}
            </Link>
          ) : (
            "converter"
          )}{" "}
          converts between many {conv.category} units instantly.
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
