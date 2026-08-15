import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { formatNumber } from "@/lib/format";
import { pageMetadata } from "@/lib/seo/metadata";
import { absUrl, SITE_NAME } from "@/lib/seo/site";
import { PERCENT_PAGES, parsePercentSlug } from "@/lib/programmatic/percent";
import { AdSlot } from "@/components/ad-slot";
import { Stat, ToolCard } from "@/components/ui";

// Only pages we pre-generate exist; anything else 404s. This keeps the
// root-level dynamic slug from colliding with the static calculator routes.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    PERCENT_PAGES.map((p) => ({ locale, slug: `${p.a}-percent-of-${p.b}` })),
  );
}

function data(slugRaw: string) {
  const pair = parsePercentSlug(slugRaw);
  if (!pair) return null;
  const { a, b } = pair;
  return { a, b, result: (a / 100) * b };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const d = data(slug);
  if (!d) return {};
  const title = `What is ${formatNumber(d.a, 0)}% of ${formatNumber(d.b, 0)}?`;
  return pageMetadata({
    locale,
    path: slug,
    title,
    description: `${formatNumber(d.a, 0)}% of ${formatNumber(d.b, 0)} is ${formatNumber(
      d.result,
    )}. Step-by-step answer and a free percentage calculator.`,
    keywords: [
      `${d.a} percent of ${d.b}`,
      `what is ${d.a}% of ${d.b}`,
      "percentage calculator",
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
  const d = data(slug);
  if (!d) notFound();

  const a0 = formatNumber(d.a, 0);
  const b0 = formatNumber(d.b, 0);
  const res = formatNumber(d.result);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is ${a0}% of ${b0}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${a0}% of ${b0} is ${res}. Multiply ${b0} by ${a0} and divide by 100.`,
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
        <Link href={`/${locale}/math`} className="hover:text-[var(--accent)]">
          Math
        </Link>
        <span className="text-[var(--ink-soft)]">/</span>
        <span className="text-[var(--ink)]">
          {a0}% of {b0}
        </span>
      </nav>

      <h1 className="display mt-4 text-4xl sm:text-5xl">
        What is {a0}% of {b0}?
      </h1>

      <div className="mt-6">
        <ToolCard>
          <Stat
            label="Answer"
            accent
            value={`${a0}% of ${b0} = ${res}`}
            sub={`${a0} ÷ 100 × ${b0} = ${res}`}
          />
          <div className="mt-4 text-sm text-[var(--ink-soft)] leading-relaxed">
            To find {a0}% of {b0}, convert the percentage to a decimal (
            {formatNumber(d.a / 100, 2)}) and multiply by {b0}. That gives{" "}
            <strong className="text-[var(--ink)]">{res}</strong>.
          </div>
        </ToolCard>
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Try your own numbers</h2>
        <p className="mt-2 text-[var(--ink-soft)]">
          Need a different calculation? The full{" "}
          <Link
            href={`/${locale}/percentage-calculator`}
            className="text-[var(--accent)] font-medium hover:underline"
          >
            percentage calculator
          </Link>{" "}
          handles “% of a number”, percentage change, and “X is what percent of
          Y”.
        </p>
      </section>

      <p className="mt-8 text-xs text-[var(--ink-soft)]">
        {SITE_NAME} ·{" "}
        <Link href={absUrl(locale, "percentage-calculator")} className="hover:underline">
          Percentage calculator
        </Link>
      </p>
    </div>
  );
}
