import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import {
  getCalc,
  getCategory,
  relatedCalcs,
  type CalcDef,
} from "@/lib/calculators/registry";
import { absUrl, SITE_NAME } from "@/lib/seo/site";
import { AdSlot } from "./ad-slot";
import { CalcBadge } from "./calc-icon";
import { FavoriteButton } from "./favorite-button";

export interface FaqItem {
  q: string;
  a: string;
}

export interface CalcContent {
  intro: string[];
  steps: string[];
  faq: FaqItem[];
  extra?: React.ReactNode;
}

export function CalcShell({
  locale,
  slug,
  children,
  content,
}: {
  locale: Locale;
  slug: string;
  children: React.ReactNode;
  content: CalcContent;
}) {
  const calc = getCalc(slug) as CalcDef;
  const category = getCategory(calc.category);
  const url = absUrl(locale, slug);
  const related = relatedCalcs(slug);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: calc.heading,
      description: calc.description,
      url,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@type": "Organization", name: SITE_NAME },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: absUrl(locale) },
        {
          "@type": "ListItem",
          position: 2,
          name: category.title,
          item: absUrl(locale, category.slug),
        },
        { "@type": "ListItem", position: 3, name: calc.title, item: url },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm text-[var(--ink-soft)]">
        <Link href={`/${locale}`} className="hover:text-[var(--accent)]">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/${locale}/${category.slug}`}
          className="hover:text-[var(--accent)]"
        >
          {category.title}
        </Link>
        <span>/</span>
        <span className="text-[var(--ink)]">{calc.title}</span>
      </nav>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <CalcBadge calc={calc} size={26} tile={54} />
          <h1 className="display text-3xl sm:text-4xl">{calc.heading}</h1>
        </div>
        <div className="shrink-0 pt-1">
          <FavoriteButton slug={slug} />
        </div>
      </div>
      <p className="mt-3 text-lg text-[var(--ink-soft)] leading-relaxed">
        {calc.description}
      </p>

      {/* The interactive calculator */}
      <div className="mt-7">{children}</div>

      <AdSlot className="mt-8" />

      {/* SEO long-form content */}
      <section className="mt-14">
        {content.intro.map((p, i) => (
          <p
            key={i}
            className="text-[var(--ink-soft)] leading-relaxed mt-4 first:mt-0"
          >
            {p}
          </p>
        ))}

        {content.extra ? <div className="mt-8">{content.extra}</div> : null}

        <h2 className="mt-12 text-xl font-semibold">How to use it</h2>
        <ol className="mt-4 space-y-3">
          {content.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-none w-6 h-6 rounded-full bg-[var(--accent-soft)] text-[var(--accent-2)] text-xs font-bold grid place-items-center">
                {i + 1}
              </span>
              <span className="text-[var(--ink-soft)]">{step}</span>
            </li>
          ))}
        </ol>

        <h2 className="mt-12 text-xl font-semibold">Frequently asked questions</h2>
        <div className="mt-4 space-y-2">
          {content.faq.map((f) => (
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

      {/* Related */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Related calculators</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {related.map((c) => (
            <Link
              key={c.slug}
              href={`/${locale}/${c.slug}`}
              className="card card-hover p-4 block"
            >
              <div className="flex items-center gap-2.5">
                <CalcBadge calc={c} size={16} tile={32} />
                <div className="font-semibold">{c.title}</div>
              </div>
              <p className="mt-2 text-sm text-[var(--ink-soft)] leading-snug">
                {c.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
