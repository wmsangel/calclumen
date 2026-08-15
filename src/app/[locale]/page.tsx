import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import {
  calcsInCategory,
  calculators,
  categories,
} from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo/site";
import { AdSlot } from "@/components/ad-slot";
import { SiteSearch } from "@/components/site-search";
import { FloatingGlyphs } from "@/components/floating-glyphs";
import { CalcBadge, CategoryBadge } from "@/components/calc-icon";
import { MyCalculators } from "@/components/my-calculators";
import { SiteJsonLd } from "@/components/site-jsonld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({
    locale,
    path: "",
    title: `${SITE_NAME} — Free Online Calculators`,
    description: SITE_TAGLINE,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const popular = calculators.filter((c) => c.popular).slice(0, 8);

  return (
    <div>
      <SiteJsonLd locale={locale} />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <FloatingGlyphs />
        <div className="relative z-10 mx-auto max-w-3xl px-5 pt-16 pb-10 sm:pt-20 text-center">
          <span className="eyebrow justify-center">
            {calculators.length} free calculators · no signup
          </span>
          <h1 className="display mt-4 text-4xl sm:text-5xl">
            Every calculator you need,
            <br className="hidden sm:block" /> in one calm place.
          </h1>
          <p className="mt-4 text-lg text-[var(--ink-soft)] leading-relaxed">
            {SITE_TAGLINE} Instant results, no clutter, works on any device.
          </p>
          <div className="mt-7 max-w-md mx-auto">
            <SiteSearch locale={locale} placeholder="Search calculators… (press /)" />
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {popular.map((c) => (
              <Link key={c.slug} href={`/${locale}/${c.slug}`} className="chip">
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5">
        <AdSlot className="mt-4" />

        <MyCalculators locale={locale} />

        {/* Category sections */}
        <div className="py-10 space-y-12">
          {categories.map((cat) => (
            <section key={cat.id} id={cat.slug} className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-5">
                <CategoryBadge cat={cat} size={20} tile={40} />
                <div>
                  <h2 className="text-lg font-semibold">
                    <Link
                      href={`/${locale}/${cat.slug}`}
                      className="hover:text-[var(--accent)] transition-colors"
                    >
                      {cat.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-[var(--ink-soft)]">{cat.blurb}</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {calcsInCategory(cat.id).map((calc) => (
                  <Link
                    key={calc.slug}
                    href={`/${locale}/${calc.slug}`}
                    className="card card-hover p-5 flex flex-col"
                  >
                    <div className="flex items-center gap-3">
                      <CalcBadge calc={calc} />
                      <span className="font-semibold flex-1">{calc.title}</span>
                      {calc.popular ? (
                        <span className="badge">Popular</span>
                      ) : null}
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
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
