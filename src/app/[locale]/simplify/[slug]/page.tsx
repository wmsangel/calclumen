import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { absUrl, SITE_NAME } from "@/lib/seo/site";
import {
  SIMPLIFY_PAGES,
  equivalents,
  parseSimplifySlug,
  relatedSimplify,
  simplify,
} from "@/lib/programmatic/simplify";
import { AdSlot } from "@/components/ad-slot";
import { Stat, ToolCard } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    SIMPLIFY_PAGES.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = parseSimplifySlug(slug);
  if (!page) return {};
  const { a, b } = page;
  const { na, nb } = simplify(a, b);
  return pageMetadata({
    locale,
    path: `simplify/${slug}`,
    title: `${a}/${b} Simplified`,
    description: `${a}/${b} in simplest form is ${na}/${nb}. See the step-by-step method, the decimal and percentage, and a free fraction calculator.`,
    keywords: [
      `simplify ${a}/${b}`,
      `${a}/${b} simplified`,
      `${a}/${b} in simplest form`,
      `reduce ${a}/${b}`,
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
  const page = parseSimplifySlug(slug);
  if (!page) notFound();

  const { a, b } = page;
  const { g, na, nb, decimal, percent } = simplify(a, b);
  const equiv = equivalents(na, nb);
  const related = relatedSimplify(page);

  const q1 = `What is ${a}/${b} in simplest form?`;
  const a1 = `${a}/${b} simplifies to ${na}/${nb}. Both the numerator and denominator share a greatest common factor of ${g}, and dividing each by ${g} gives ${na}/${nb}.`;
  const q2 = `How do you simplify ${a}/${b}?`;
  const a2 = `Find the greatest common factor (GCF) of ${a} and ${b}, which is ${g}, then divide the top and bottom by it: ${a} ÷ ${g} = ${na} and ${b} ÷ ${g} = ${nb}, giving ${na}/${nb}.`;

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
        { "@type": "ListItem", position: 3, name: `${a}/${b} simplified`, item: absUrl(locale, `simplify/${slug}`) },
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
        <span className="text-[var(--ink)]">
          {a}/{b} simplified
        </span>
      </nav>

      <h1 className="display mt-4 text-4xl sm:text-5xl">
        {a}/{b} Simplified
      </h1>
      <p className="mt-3 text-lg text-[var(--ink-soft)]">
        The fraction {a}/{b} written in its simplest form.
      </p>

      <div className="mt-6">
        <ToolCard>
          <Stat
            label={`${a}/${b} in simplest form`}
            accent
            value={`${na}/${nb}`}
            sub={`= ${decimal} as a decimal · ${percent}% as a percentage`}
          />
        </ToolCard>
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold">How it works</h2>
        <p className="mt-2 text-[var(--ink-soft)] leading-relaxed">
          To reduce a fraction, divide the numerator and denominator by their
          greatest common factor (GCF).
        </p>
        <ul className="mt-3 space-y-1 text-[var(--ink)]">
          <li>
            GCF of {a} and {b} = <strong>{g}</strong>
          </li>
          <li>
            {a} ÷ {g} = <strong>{na}</strong>
          </li>
          <li>
            {b} ÷ {g} = <strong>{nb}</strong>
          </li>
        </ul>
        <p className="mt-3 text-[var(--ink-soft)] leading-relaxed">
          So {a}/{b} = <strong className="text-[var(--ink)]">{na}/{nb}</strong>,
          which cannot be reduced further because {na} and {nb} share no common
          factor other than 1.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Equivalent fractions</h2>
        <p className="mt-2 text-[var(--ink-soft)]">
          {a}/{b} = {na}/{nb} = {equiv.join(" = ")} — all equal to {decimal}.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Simplify another fraction</h2>
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
          <h2 className="text-xl font-semibold">Related fractions</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/${locale}/simplify/${p.slug}`}
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
