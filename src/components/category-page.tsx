import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import {
  calcsInCategory,
  getCalc,
  getCategory,
  type CalcDef,
  type CategoryId,
} from "@/lib/calculators/registry";
import { clustersForCategory } from "@/lib/calculators/clusters";
import { absUrl, SITE_NAME } from "@/lib/seo/site";
import { AdSlot } from "./ad-slot";
import { CalcBadge, CategoryBadge } from "./calc-icon";

function CalcCard({ locale, calc }: { locale: Locale; calc: CalcDef }) {
  return (
    <Link
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
  );
}

export function CategoryPage({
  locale,
  categoryId,
  extra,
}: {
  locale: Locale;
  categoryId: CategoryId;
  extra?: React.ReactNode;
}) {
  const cat = getCategory(categoryId);
  const calcs = calcsInCategory(categoryId);
  const clusters = clustersForCategory(categoryId);

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

  // Track which calcs a cluster layout has shown, so any not yet assigned to a
  // cluster still appear (defensive — every finance calc is mapped today).
  const shown = new Set<string>();

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

      {clusters ? (
        <div className="mt-8 space-y-10">
          {clusters.map((cl) => {
            const items = cl.slugs
              .map((s) => {
                const c = getCalc(s);
                if (c) shown.add(s);
                return c;
              })
              .filter((c): c is CalcDef => Boolean(c));
            if (items.length === 0) return null;
            return (
              <section key={cl.id}>
                <h2 className="text-xl font-semibold">{cl.title}</h2>
                <p className="mt-1 text-sm text-[var(--ink-soft)]">{cl.blurb}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {items.map((calc) => (
                    <CalcCard key={calc.slug} locale={locale} calc={calc} />
                  ))}
                </div>
              </section>
            );
          })}
          {(() => {
            const rest = calcs.filter((c) => !shown.has(c.slug));
            if (rest.length === 0) return null;
            return (
              <section>
                <h2 className="text-xl font-semibold">More {cat.title.toLowerCase()} tools</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {rest.map((calc) => (
                    <CalcCard key={calc.slug} locale={locale} calc={calc} />
                  ))}
                </div>
              </section>
            );
          })()}
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {calcs.map((calc) => (
            <CalcCard key={calc.slug} locale={locale} calc={calc} />
          ))}
        </div>
      )}

      {extra ? <div className="mt-12">{extra}</div> : null}

      <AdSlot className="mt-10" />
    </div>
  );
}
