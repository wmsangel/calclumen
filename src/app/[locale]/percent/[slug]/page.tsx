import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { absUrl, SITE_NAME } from "@/lib/seo/site";
import {
  PERCENT_CONV_PAGES,
  parsePercentSlug,
  percentToParts,
  relatedPercents,
} from "@/lib/programmatic/percentconv";
import { AdSlot } from "@/components/ad-slot";
import { Stat, ToolCard } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    PERCENT_CONV_PAGES.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = parsePercentSlug(slug);
  if (!page) return {};
  const { percent } = page;
  const { num, den, decimal } = percentToParts(percent);
  return pageMetadata({
    locale,
    path: `percent/${slug}`,
    title: `${percent}% as a Fraction and Decimal`,
    description: `${percent}% as a fraction is ${num}/${den} and as a decimal is ${decimal}. See the step-by-step method and a free percentage calculator.`,
    keywords: [
      `${percent}% as a fraction`,
      `${percent}% as a decimal`,
      `what is ${percent}% as a fraction`,
      `convert ${percent} percent to a fraction`,
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
  const page = parsePercentSlug(slug);
  if (!page) notFound();

  const { percent } = page;
  const { num, den, rawNum, rawDen, decimal, whole, rem } =
    percentToParts(percent);
  const related = relatedPercents(page);
  const improper = whole > 0 && den !== 1 && rem > 0;
  const mixed = improper ? `${whole} ${rem}/${den}` : null;

  const q1 = `What is ${percent}% as a fraction?`;
  const a1 = `${percent}% as a fraction is ${num}/${den} in simplest form${
    mixed ? ` (${mixed} as a mixed number)` : ""
  }. A percent means "out of 100", so ${percent}% = ${rawNum}/${rawDen}, which reduces to ${num}/${den}.`;
  const q2 = `What is ${percent}% as a decimal?`;
  const a2 = `${percent}% as a decimal is ${decimal}. To convert a percent to a decimal, divide by 100 (move the decimal point two places left).`;

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
        { "@type": "ListItem", position: 2, name: "Math", item: absUrl(locale, "math") },
        { "@type": "ListItem", position: 3, name: `${percent}% as a fraction and decimal`, item: absUrl(locale, `percent/${slug}`) },
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
        <Link href={`/${locale}/math`} className="hover:text-[var(--accent)]">
          Math
        </Link>
        <span>/</span>
        <Link
          href={`/${locale}/percentage-calculator`}
          className="hover:text-[var(--accent)]"
        >
          Percentages
        </Link>
        <span>/</span>
        <span className="text-[var(--ink)]">{percent}%</span>
      </nav>

      <h1 className="display mt-4 text-4xl sm:text-5xl">
        {percent}% as a Fraction and a Decimal
      </h1>
      <p className="mt-3 text-lg text-[var(--ink-soft)]">
        Convert {percent}% to a fraction in simplest form and to a decimal.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <ToolCard>
          <Stat
            label={`${percent}% as a fraction`}
            accent
            value={`${num}/${den}`}
            sub={mixed ? `= ${mixed} as a mixed number` : undefined}
          />
        </ToolCard>
        <ToolCard>
          <Stat label={`${percent}% as a decimal`} accent value={decimal} />
        </ToolCard>
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold">How it works</h2>
        <p className="mt-2 text-[var(--ink-soft)] leading-relaxed">
          &ldquo;Percent&rdquo; means &ldquo;out of 100&rdquo;, so {percent}% is{" "}
          {percent}/100.
        </p>
        <ul className="mt-3 space-y-1 text-[var(--ink)]">
          <li>
            <strong>As a fraction:</strong> {percent}/100 = {rawNum}/{rawDen} ={" "}
            <strong>{num}/{den}</strong> after dividing by the greatest common
            factor.
          </li>
          <li>
            <strong>As a decimal:</strong> {percent} ÷ 100 ={" "}
            <strong>{decimal}</strong>.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Work with percentages</h2>
        <p className="mt-2 text-[var(--ink-soft)]">
          The{" "}
          <Link
            href={`/${locale}/percentage-calculator`}
            className="text-[var(--accent)] font-medium hover:underline"
          >
            percentage calculator
          </Link>{" "}
          finds a percent of a number, percentage change and more.
        </p>
      </section>

      {related.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Related percentages</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/${locale}/percent/${p.slug}`}
                className="rounded-lg border border-[var(--rule)] px-3 py-1.5 text-sm text-[var(--accent)] hover:border-[var(--accent)]"
              >
                {p.percent}%
              </Link>
            ))}
          </div>
        </section>
      ) : null}

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
