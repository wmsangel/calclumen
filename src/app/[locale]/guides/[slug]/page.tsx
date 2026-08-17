import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { getCalc, getCategory } from "@/lib/calculators/registry";
import { GUIDES, getGuide, type Block } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo/metadata";
import { absUrl, SITE_NAME, SITE_URL } from "@/lib/seo/site";
import { CalcBadge } from "@/components/calc-icon";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => GUIDES.map((g) => ({ locale, slug: g.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const guide = getGuide(slug);
  if (!guide) return {};
  return pageMetadata({
    locale,
    path: `guides/${slug}`,
    title: guide.title,
    description: guide.description,
  });
}

function renderBlock(block: Block, i: number) {
  switch (block.t) {
    case "h2":
      return (
        <h2 key={i} className="mt-10 text-xl font-semibold">
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p key={i} className="mt-4 text-[var(--ink-soft)] leading-relaxed">
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul key={i} className="mt-4 space-y-2">
          {block.items.map((it, j) => (
            <li key={j} className="flex gap-2 text-[var(--ink-soft)]">
              <span className="text-[var(--accent)] mt-0.5">•</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol key={i} className="mt-4 space-y-3">
          {block.items.map((it, j) => (
            <li key={j} className="flex gap-3">
              <span className="flex-none w-6 h-6 rounded-full bg-[var(--accent-soft)] text-[var(--accent-2)] text-xs font-bold grid place-items-center">
                {j + 1}
              </span>
              <span className="text-[var(--ink-soft)]">{it}</span>
            </li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <div
          key={i}
          className="mt-5 rounded-xl border border-[var(--rule)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--ink)] leading-relaxed"
        >
          {block.text}
        </div>
      );
  }
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const guide = getGuide(slug);
  if (!guide) notFound();

  const cat = getCategory(guide.category);
  const url = absUrl(locale, `guides/${slug}`);
  const primary = getCalc(guide.calcSlugs[0]);
  const related = guide.calcSlugs.map(getCalc).filter(Boolean);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      datePublished: `${guide.updated}-01`,
      dateModified: `${guide.updated}-01`,
      author: { "@type": "Organization", name: SITE_NAME },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` },
      },
      mainEntityOfPage: url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: absUrl(locale) },
        { "@type": "ListItem", position: 2, name: "Guides", item: absUrl(locale, "guides") },
        { "@type": "ListItem", position: 3, name: guide.title, item: url },
      ],
    },
  ];

  return (
    <article className="mx-auto max-w-3xl px-5 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="flex items-center gap-1.5 text-sm text-[var(--ink-soft)]">
        <Link href={`/${locale}`} className="hover:text-[var(--accent)]">
          Home
        </Link>
        <span>/</span>
        <Link href={`/${locale}/guides`} className="hover:text-[var(--accent)]">
          Guides
        </Link>
        <span>/</span>
        <span className="text-[var(--ink)] truncate">{guide.title}</span>
      </nav>

      <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
        <span className="inline-block w-2 h-2 rounded-full" style={{ background: cat.accent }} />
        {cat.title} · {guide.readMins} min read
      </div>
      <h1 className="display mt-2 text-3xl sm:text-4xl">{guide.title}</h1>
      <p className="mt-3 text-lg text-[var(--ink-soft)] leading-relaxed">
        {guide.description}
      </p>

      {primary ? (
        <Link
          href={`/${locale}/${primary.slug}`}
          className="mt-6 card card-hover p-4 flex items-center gap-3"
        >
          <CalcBadge calc={primary} size={18} tile={40} />
          <span className="flex-1">
            <span className="font-semibold text-sm block">
              Try the {primary.title.toLowerCase()} calculator
            </span>
            <span className="text-xs text-[var(--ink-soft)]">
              Put these numbers to work
            </span>
          </span>
          <span className="text-[var(--accent)] font-medium text-sm shrink-0">
            Open →
          </span>
        </Link>
      ) : null}

      <div className="mt-4">{guide.body.map(renderBlock)}</div>

      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Related calculators</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map((c) =>
              c ? (
                <Link
                  key={c.slug}
                  href={`/${locale}/${c.slug}`}
                  className="card card-hover p-4 flex items-center gap-3"
                >
                  <CalcBadge calc={c} size={16} tile={34} />
                  <span className="font-medium text-sm">{c.title}</span>
                </Link>
              ) : null,
            )}
          </div>
        </section>
      ) : null}
    </article>
  );
}
