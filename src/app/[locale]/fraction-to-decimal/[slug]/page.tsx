import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { absUrl, SITE_NAME } from "@/lib/seo/site";
import {
  FRACDEC_PAGES,
  fractionToDecimal,
  parseFracDecSlug,
  relatedFracDec,
} from "@/lib/programmatic/fracdec";
import { AdSlot } from "@/components/ad-slot";
import { Stat, ToolCard } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    FRACDEC_PAGES.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = parseFracDecSlug(slug);
  if (!page) return {};
  const { a, b } = page;
  const { decimal } = fractionToDecimal(a, b);
  return pageMetadata({
    locale,
    path: `fraction-to-decimal/${slug}`,
    title: `${a}/${b} as a Decimal`,
    description: `${a}/${b} as a decimal is ${decimal}. See the step-by-step method, the percentage and a free fraction-to-decimal calculator.`,
    keywords: [
      `${a}/${b} as a decimal`,
      `what is ${a}/${b} as a decimal`,
      `${a}/${b} in decimal form`,
      `convert ${a}/${b} to a decimal`,
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
  const page = parseFracDecSlug(slug);
  if (!page) notFound();

  const { a, b } = page;
  const { decimal, terminating, percent } = fractionToDecimal(a, b);
  const related = relatedFracDec(page);

  const q1 = `What is ${a}/${b} as a decimal?`;
  const a1 = `${a}/${b} as a decimal is ${decimal}. It is a ${
    terminating ? "terminating" : "repeating"
  } decimal, found by dividing ${a} by ${b}.`;
  const q2 = `How do you turn ${a}/${b} into a decimal?`;
  const a2 = `Divide the numerator by the denominator: ${a} ÷ ${b} = ${decimal}. A fraction gives a terminating decimal when the denominator's only prime factors are 2 and 5, and a repeating decimal otherwise.`;

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
        { "@type": "ListItem", position: 3, name: `${a}/${b} as a decimal`, item: absUrl(locale, `fraction-to-decimal/${slug}`) },
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
          href={`/${locale}/fraction-calculator`}
          className="hover:text-[var(--accent)]"
        >
          Fractions
        </Link>
        <span>/</span>
        <span className="text-[var(--ink)]">{a}/{b} as a decimal</span>
      </nav>

      <h1 className="display mt-4 text-4xl sm:text-5xl">
        {a}/{b} as a Decimal
      </h1>
      <p className="mt-3 text-lg text-[var(--ink-soft)]">
        The fraction {a}/{b} written as a decimal.
      </p>

      <div className="mt-6">
        <ToolCard>
          <Stat
            label={`${a}/${b} as a decimal`}
            accent
            value={decimal}
            sub={`= ${percent}% · ${terminating ? "terminating" : "repeating"} decimal`}
          />
        </ToolCard>
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold">How it works</h2>
        <p className="mt-2 text-[var(--ink-soft)] leading-relaxed">
          To turn a fraction into a decimal, divide the numerator by the
          denominator: {a} ÷ {b} ={" "}
          <strong className="text-[var(--ink)]">{decimal}</strong>.
        </p>
        <p className="mt-3 text-[var(--ink-soft)] leading-relaxed">
          {terminating
            ? `Because ${b}'s only prime factors are 2 and 5, the division ends cleanly, so ${a}/${b} is a terminating decimal.`
            : `Because ${b} has a prime factor other than 2 or 5, the division never ends, so ${a}/${b} is a repeating decimal (rounded above).`}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Convert another number</h2>
        <p className="mt-2 text-[var(--ink-soft)]">
          The{" "}
          <Link
            href={`/${locale}/fraction-calculator`}
            className="text-[var(--accent)] font-medium hover:underline"
          >
            fraction calculator
          </Link>{" "}
          adds, subtracts, multiplies, divides and simplifies any fractions, and
          shows each result as a decimal too.
        </p>
      </section>

      {related.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Related fractions</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/${locale}/fraction-to-decimal/${p.slug}`}
                className="rounded-lg border border-[var(--rule)] px-3 py-1.5 text-sm text-[var(--accent)] hover:border-[var(--accent)]"
              >
                {p.a}/{p.b}
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
