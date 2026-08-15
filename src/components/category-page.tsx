import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import {
  calcsInCategory,
  getCategory,
  type CategoryId,
} from "@/lib/calculators/registry";
import { absUrl, SITE_NAME } from "@/lib/seo/site";
import { AdSlot } from "./ad-slot";
import { CalcBadge, CategoryBadge } from "./calc-icon";

export function CategoryPage({
  locale,
  categoryId,
}: {
  locale: Locale;
  categoryId: CategoryId;
}) {
  const cat = getCategory(categoryId);
  const calcs = calcsInCategory(categoryId);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: absUrl(locale) },
        {
          "@type": "ListItem",
          position: 2,
          name: cat.title,
          item: absUrl(locale, cat.slug),
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${cat.title} Calculators`,
      itemListElement: calcs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.heading,
        url: absUrl(locale, c.slug),
      })),
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="flex items-center gap-1.5 text-sm text-[var(--ink-soft)]">
        <Link href={`/${locale}`} className="hover:text-[var(--accent)]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[var(--ink)]">{cat.title}</span>
      </nav>

      <div className="mt-5 flex items-center gap-3">
        <CategoryBadge cat={cat} size={24} tile={52} />
        <div>
          <h1 className="display text-3xl">{cat.title} Calculators</h1>
          <p className="text-[var(--ink-soft)]">{cat.blurb}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {calcs.map((calc) => (
          <Link
            key={calc.slug}
            href={`/${locale}/${calc.slug}`}
            className="card card-hover p-5 flex flex-col"
          >
            <div className="flex items-center gap-3">
              <CalcBadge calc={calc} />
              <span className="font-semibold flex-1">{calc.heading}</span>
              {calc.popular ? <span className="badge">Popular</span> : null}
            </div>
            <p className="mt-3 text-sm text-[var(--ink-soft)] flex-1 leading-snug">
              {calc.description}
            </p>
            <span className="mt-3 text-sm text-[var(--accent)] font-medium">
              Open →
            </span>
          </Link>
        ))}
      </div>

      <AdSlot className="mt-10" />
    </div>
  );
}
