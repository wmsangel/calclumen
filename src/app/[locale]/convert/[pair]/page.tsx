import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { pageMetadata } from "@/lib/seo/metadata";
import { RATES, RATES_UPDATED, convert } from "@/lib/programmatic/rates";
import { AdSlot } from "@/components/ad-slot";
import { Stat, ToolCard } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  const pairs: { locale: string; pair: string }[] = [];
  for (const locale of locales) {
    for (const from of CURRENCIES) {
      for (const to of CURRENCIES) {
        if (from === to) continue;
        pairs.push({
          locale,
          pair: `${from.toLowerCase()}-to-${to.toLowerCase()}`,
        });
      }
    }
  }
  return pairs;
}

function parsePair(pair: string): { from: string; to: string } | null {
  const m = /^([a-z]{3})-to-([a-z]{3})$/.exec(pair);
  if (!m) return null;
  const from = m[1].toUpperCase();
  const to = m[2].toUpperCase();
  if (!(from in RATES) || !(to in RATES) || from === to) return null;
  return { from, to };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pair: string }>;
}): Promise<Metadata> {
  const { locale, pair } = await params;
  if (!isLocale(locale)) return {};
  const p = parsePair(pair);
  if (!p) return {};
  const rate = convert(1, p.from, p.to);
  return {
    ...pageMetadata({
      locale,
      path: `convert/${pair}`,
      title: `Convert ${p.from} to ${p.to}`,
      description: `1 ${p.from} = ${formatNumber(rate, 4)} ${p.to}. Convert ${p.from} to ${p.to} with a fast, free currency calculator.`,
      keywords: [
        `${p.from.toLowerCase()} to ${p.to.toLowerCase()}`,
        `convert ${p.from} to ${p.to}`,
        "currency converter",
      ],
    }),
    // Thin templated pages: keep them for users but out of the index.
    robots: { index: false, follow: true },
  };
}

const AMOUNTS = [1, 5, 10, 50, 100, 500, 1000];

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; pair: string }>;
}) {
  const { locale, pair } = await params;
  if (!isLocale(locale)) notFound();
  const p = parsePair(pair);
  if (!p) notFound();

  const rate = convert(1, p.from, p.to);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How much is 1 ${p.from} in ${p.to}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `1 ${p.from} is about ${formatNumber(rate, 4)} ${p.to} at an indicative rate (updated ${RATES_UPDATED}).`,
        },
      },
    ],
  };

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
        <span className="text-[var(--ink-soft)]">/</span>
        <Link href={`/${locale}/conversions`} className="hover:text-[var(--accent)]">
          Conversions
        </Link>
        <span className="text-[var(--ink-soft)]">/</span>
        <span className="text-[var(--ink)]">
          {p.from} → {p.to}
        </span>
      </nav>

      <h1 className="display mt-4 text-4xl sm:text-5xl">
        Convert {p.from} to {p.to}
      </h1>

      <div className="mt-6">
        <ToolCard>
          <Stat
            label="Exchange rate"
            accent
            value={`1 ${p.from} = ${formatNumber(rate, 4)} ${p.to}`}
            sub={`1 ${p.to} = ${formatNumber(convert(1, p.to, p.from), 4)} ${p.from}`}
          />
          <table className="mt-5 w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--ink-soft)]">
                <th className="py-1.5 font-medium">{p.from}</th>
                <th className="py-1.5 font-medium">{p.to}</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {AMOUNTS.map((amt) => (
                <tr key={amt} className="border-t border-[var(--rule)]">
                  <td className="py-1.5">{formatMoney(amt, p.from)}</td>
                  <td className="py-1.5">{formatMoney(convert(amt, p.from, p.to), p.to)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs text-[var(--ink-soft)]">
            Indicative rates (updated {RATES_UPDATED}) for estimation only — not
            live quotes.
          </p>
        </ToolCard>
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Convert any amount</h2>
        <p className="mt-2 text-[var(--ink-soft)]">
          Use the full{" "}
          <Link
            href={`/${locale}/currency-converter`}
            className="text-[var(--accent)] font-medium hover:underline"
          >
            currency converter
          </Link>{" "}
          to enter your own amount and switch between{" "}
          {CURRENCIES.length} currencies.
        </p>
      </section>
    </div>
  );
}
