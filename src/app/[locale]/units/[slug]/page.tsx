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
  popularValues,
  reverseConv,
  siblingTypes,
  tableValues,
  type UnitConversion,
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

/** The "multiply by X (and add Y)" phrase, reused in copy and FAQ. */
function formula(conv: UnitConversion) {
  const factorStr = formatNumber(conv.factor, 5);
  const off = conv.offset ?? 0;
  if (off === 0) return `multiply by ${factorStr}`;
  const offAbs = formatNumber(Math.abs(off), 4);
  return `multiply by ${factorStr} and ${off > 0 ? "add" : "subtract"} ${offAbs}`;
}

/** "10 × 2.20462 = 22.046" (or with an offset step). */
function worked(conv: UnitConversion, value: number, resultStr: string) {
  const factorStr = formatNumber(conv.factor, 5);
  const off = conv.offset ?? 0;
  if (off === 0) return `${value} × ${factorStr} = ${resultStr}`;
  const offAbs = formatNumber(Math.abs(off), 4);
  return `${value} × ${factorStr} ${off > 0 ? "+" : "−"} ${offAbs} = ${resultStr}`;
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
  return pageMetadata({
    locale,
    path: `units/${slug}`,
    title: `${value} ${conv.fromUnit} to ${conv.toUnit}`,
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
  const fLabel = conv.fromLabel ?? conv.fromUnit;
  const tLabel = conv.toLabel ?? conv.toUnit;
  const off = conv.offset ?? 0;
  const result = formatNumber(convertUnit(value, conv), conv.precision);
  const factorStr = formatNumber(conv.factor, 5);
  const tool = getCalc(conv.converterSlug);
  const rows = tableValues(conv, value);
  const formulaPhrase = formula(conv);

  const q1 = `What is ${value} ${conv.fromUnit} in ${conv.toName}?`;
  const a1 = `${value} ${conv.fromName} equals ${result} ${conv.toName}. To convert, ${formulaPhrase}.`;
  const q2 = `How do you convert ${conv.fromName} to ${conv.toName}?`;
  const a2 = `To convert ${conv.fromName} to ${conv.toName}, ${formulaPhrase}. For ${value}: ${worked(conv, value, result)} ${tLabel}.`;

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
          <Link href={`/${locale}/${conv.converterSlug}`} className="hover:text-[var(--accent)]">
            {tool.title}
          </Link>
        ) : (
          <span>{conv.category}</span>
        )}
        <span>/</span>
        <span className="text-[var(--ink)]">
          {value} {fLabel} → {tLabel}
        </span>
      </nav>

      <h1 className="display mt-4 text-4xl sm:text-5xl">
        {value} {fLabel} to {tLabel}
      </h1>
      <p className="mt-3 text-lg text-[var(--ink-soft)]">
        {value} {conv.fromName} to {conv.toName}
      </p>

      <div className="mt-6">
        <ToolCard>
          <Stat
            label="Result"
            accent
            value={`${value} ${fLabel} = ${result} ${tLabel}`}
            sub={
              off === 0
                ? `1 ${fLabel} = ${factorStr} ${tLabel} · 1 ${tLabel} = ${formatNumber(1 / conv.factor, 5)} ${fLabel}`
                : `Formula: ${conv.fromNameSingular} × ${factorStr} + ${formatNumber(conv.offset ?? 0, 4)}`
            }
          />
          <div className="mt-4 text-sm text-[var(--ink-soft)] leading-relaxed">
            To convert {conv.fromName} to {conv.toName}, {formulaPhrase}. So{" "}
            <strong className="text-[var(--ink)]">
              {worked(conv, value, result)} {tLabel}
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
              <th className="py-1.5 font-medium">{fLabel}</th>
              <th className="py-1.5 font-medium">{tLabel}</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {rows.map((v) => (
              <tr key={v} className="border-t border-[var(--rule)]">
                <td className="py-1.5">
                  {v === value ? (
                    <strong>
                      {v} {fLabel}
                    </strong>
                  ) : (
                    <Link
                      href={`/${locale}/units/${v}-${conv.fromUnit}-to-${conv.toUnit}`}
                      className="text-[var(--accent)] hover:underline"
                    >
                      {v} {fLabel}
                    </Link>
                  )}
                </td>
                <td className="py-1.5">
                  {formatNumber(convertUnit(v, conv), conv.precision)} {tLabel}
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

      {(() => {
        const reverse = reverseConv(conv);
        const siblings = siblingTypes(conv);
        if (!reverse && siblings.length === 0) return null;
        const chip = (
          fromUnit: string,
          toUnit: string,
          v: number,
          fl: string,
          tl: string,
        ) => (
          <Link
            key={`${v}-${fromUnit}-${toUnit}`}
            href={`/${locale}/units/${v}-${fromUnit}-to-${toUnit}`}
            className="chip"
          >
            {v} {fl} to {tl}
          </Link>
        );
        return (
          <section className="mt-10">
            <h2 className="text-xl font-semibold">Related conversions</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {reverse
                ? popularValues(reverse, 4).map((v) =>
                    chip(
                      reverse.fromUnit,
                      reverse.toUnit,
                      v,
                      reverse.fromLabel ?? reverse.fromUnit,
                      reverse.toLabel ?? reverse.toUnit,
                    ),
                  )
                : null}
              {siblings.map((s) => {
                const v = popularValues(s, 1)[0];
                if (v == null) return null;
                return chip(
                  s.fromUnit,
                  s.toUnit,
                  v,
                  s.fromLabel ?? s.fromUnit,
                  s.toLabel ?? s.toUnit,
                );
              })}
            </div>
          </section>
        );
      })()}

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
