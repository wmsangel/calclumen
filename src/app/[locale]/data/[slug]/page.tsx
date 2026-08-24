import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { absUrl, SITE_NAME } from "@/lib/seo/site";
import {
  SIZE_PAGES,
  convertBinary,
  convertDecimal,
  fmtSize,
  parseSizeSlug,
  sizeTableValues,
} from "@/lib/programmatic/datasize";
import { AdSlot } from "@/components/ad-slot";
import { Stat, ToolCard } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    SIZE_PAGES.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = parseSizeSlug(slug);
  if (!page) return {};
  const { conv, value } = page;
  const dec = fmtSize(convertDecimal(value, conv));
  return pageMetadata({
    locale,
    path: `data/${slug}`,
    title: `${value} ${conv.fromLabel} to ${conv.toLabel}`,
    description: `${value} ${conv.fromName} = ${dec} ${conv.toName} (decimal). See the binary value, the formula and a data storage converter.`,
    keywords: [
      `${value} ${conv.from} to ${conv.to}`,
      `${value} ${conv.from} in ${conv.to}`,
      `${value} ${conv.fromName} to ${conv.toName}`,
      `convert ${value} ${conv.fromName} to ${conv.toName}`,
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
  const page = parseSizeSlug(slug);
  if (!page) notFound();

  const { conv, value } = page;
  const dec = fmtSize(convertDecimal(value, conv));
  const bin = fmtSize(convertBinary(value, conv));
  const rows = sizeTableValues(conv, value);

  const q1 = `How many ${conv.toName} is ${value} ${conv.fromLabel}?`;
  const a1 = `${value} ${conv.fromLabel} equals ${dec} ${conv.toLabel} using the decimal (SI) standard that drive makers and Google use, or ${bin} ${conv.toLabel} using the binary standard that operating systems use.`;
  const q2 = `Why are there two answers?`;
  const a2 = `Storage is measured two ways: decimal (1 ${conv.toLabel} = 1000 of the next unit down) and binary (1 ${conv.toLabel} = 1024). Hard-drive and SSD capacities are advertised in decimal, while Windows and other systems report sizes in binary — which is why a "1 TB" drive shows as about 931 GB in your operating system.`;

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
        { "@type": "ListItem", position: 3, name: `${value} ${conv.fromLabel} to ${conv.toLabel}`, item: absUrl(locale, `data/${slug}`) },
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
        <Link href={`/${locale}/data-storage-converter`} className="hover:text-[var(--accent)]">
          Data storage
        </Link>
        <span>/</span>
        <span className="text-[var(--ink)]">
          {value} {conv.fromLabel} → {conv.toLabel}
        </span>
      </nav>

      <h1 className="display mt-4 text-4xl sm:text-5xl">
        {value} {conv.fromLabel} to {conv.toLabel}
      </h1>
      <p className="mt-3 text-lg text-[var(--ink-soft)]">
        {value} {conv.fromName} to {conv.toName}
      </p>

      <div className="mt-6">
        <ToolCard>
          <Stat
            label="Decimal (SI) — what most people mean"
            accent
            value={`${value} ${conv.fromLabel} = ${dec} ${conv.toLabel}`}
            sub={`Binary (IEC): ${value} ${conv.fromLabel} = ${bin} ${conv.toLabel}`}
          />
          <div className="mt-4 text-sm text-[var(--ink-soft)] leading-relaxed">
            In the decimal standard (used by storage makers and Google), 1{" "}
            {conv.fromLabel} = 1000 of the next unit down, so {value}{" "}
            {conv.fromLabel} ={" "}
            <strong className="text-[var(--ink)]">
              {dec} {conv.toLabel}
            </strong>
            . Operating systems use the binary standard (×1024), giving{" "}
            <strong className="text-[var(--ink)]">
              {bin} {conv.toLabel}
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
        <p className="mt-1 text-sm text-[var(--ink-soft)]">Decimal (SI) values.</p>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--ink-soft)]">
              <th className="py-1.5 font-medium">{conv.fromLabel}</th>
              <th className="py-1.5 font-medium">{conv.toLabel}</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {rows.map((v) => (
              <tr key={v} className="border-t border-[var(--rule)]">
                <td className="py-1.5">
                  {v === value ? (
                    <strong>
                      {v} {conv.fromLabel}
                    </strong>
                  ) : (
                    <Link
                      href={`/${locale}/data/${v}-${conv.from}-to-${conv.to}`}
                      className="text-[var(--accent)] hover:underline"
                    >
                      {v} {conv.fromLabel}
                    </Link>
                  )}
                </td>
                <td className="py-1.5">
                  {fmtSize(convertDecimal(v, conv))} {conv.toLabel}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Convert any size</h2>
        <p className="mt-2 text-[var(--ink-soft)]">
          Need a different value or unit? The full{" "}
          <Link
            href={`/${locale}/data-storage-converter`}
            className="text-[var(--accent)] font-medium hover:underline"
          >
            data storage converter
          </Link>{" "}
          handles bits, bytes, KB, MB, GB, TB and PB.
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
