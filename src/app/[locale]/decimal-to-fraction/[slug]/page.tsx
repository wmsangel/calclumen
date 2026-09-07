import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { absUrl, SITE_NAME } from "@/lib/seo/site";
import {
  DECFRAC_PAGES,
  decimalToFraction,
  parseDecFracSlug,
  relatedDecimals,
} from "@/lib/programmatic/decfrac";
import { AdSlot } from "@/components/ad-slot";
import { Stat, ToolCard } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    DECFRAC_PAGES.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = parseDecFracSlug(slug);
  if (!page) return {};
  const { decimal } = page;
  const { num, den } = decimalToFraction(decimal);
  return pageMetadata({
    locale,
    path: `decimal-to-fraction/${slug}`,
    title: `${decimal} as a Fraction`,
    description: `${decimal} as a fraction is ${num}/${den} in simplest form. See the step-by-step method, the percentage and a free decimal-to-fraction calculator.`,
    keywords: [
      `${decimal} as a fraction`,
      `what is ${decimal} as a fraction`,
      `${decimal} in fraction form`,
      `convert ${decimal} to a fraction`,
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
  const page = parseDecFracSlug(slug);
  if (!page) notFound();

  const { decimal } = page;
  const { num, den, rawNum, rawDen, whole, rem, percent } =
    decimalToFraction(decimal);
  const related = relatedDecimals(page);
  const improper = whole > 0 && den !== 1 && rem > 0;
  const mixed = improper ? `${whole} ${rem}/${den}` : null;

  const q1 = `What is ${decimal} as a fraction?`;
  const a1 = `${decimal} as a fraction is ${num}/${den} in simplest form.${
    mixed ? ` As a mixed number that is ${mixed}.` : ""
  }`;
  const q2 = `How do you convert ${decimal} to a fraction?`;
  const a2 = `Write the decimal over a power of 10 — ${decimal} = ${rawNum}/${rawDen} — then divide the top and bottom by their greatest common factor to reduce it to ${num}/${den}.`;

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
        { "@type": "ListItem", position: 3, name: `${decimal} as a fraction`, item: absUrl(locale, `decimal-to-fraction/${slug}`) },
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
        <span className="text-[var(--ink)]">{decimal} as a fraction</span>
      </nav>

      <h1 className="display mt-4 text-4xl sm:text-5xl">
        {decimal} as a Fraction
      </h1>
      <p className="mt-3 text-lg text-[var(--ink-soft)]">
        The decimal {decimal} written as a fraction in simplest form.
      </p>

      <div className="mt-6">
        <ToolCard>
          <Stat
            label={`${decimal} as a fraction`}
            accent
            value={`${num}/${den}`}
            sub={
              mixed
                ? `= ${mixed} as a mixed number · ${percent}% as a percentage`
                : `= ${percent}% as a percentage`
            }
          />
        </ToolCard>
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold">How it works</h2>
        <ul className="mt-3 space-y-1 text-[var(--ink)]">
          <li>
            Write {decimal} over a power of 10:{" "}
            <strong>
              {rawNum}/{rawDen}
            </strong>
          </li>
          <li>
            Divide the top and bottom by their greatest common factor to reduce
            it to <strong>{num}/{den}</strong>
          </li>
          {mixed ? (
            <li>
              As a mixed number: <strong>{mixed}</strong>
            </li>
          ) : null}
        </ul>
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
          adds, subtracts, multiplies, divides and simplifies any fractions.
        </p>
      </section>

      {related.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Related decimals</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/${locale}/decimal-to-fraction/${p.slug}`}
                className="rounded-lg border border-[var(--rule)] px-3 py-1.5 text-sm text-[var(--accent)] hover:border-[var(--accent)]"
              >
                {p.decimal}
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
