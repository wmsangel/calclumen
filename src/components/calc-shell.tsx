import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import {
  getCalc,
  getCategory,
  relatedCalcs,
  type CalcDef,
  type CategoryId,
} from "@/lib/calculators/registry";
import { absUrl, SITE_NAME, SITE_URL } from "@/lib/seo/site";
import { guideForCalc } from "@/lib/guides";
import { AdSlot } from "./ad-slot";
import { CalcBadge } from "./calc-icon";
import { AffiliateBlock } from "./affiliate-block";
import { EuOfferBlock } from "./eu-offer-block";
import { FavoriteButton } from "./favorite-button";
import { PrintButton } from "./print-button";
import { EmbedSnippet } from "./embed-snippet";
import { CalcUseTracker } from "./calc-use-tracker";
import { embeddableFor } from "@/lib/embeddable";
import { crossLinkFor } from "@/lib/cross-links";
import { spotlightForPage } from "@/lib/spotlight";
import { AmazonMaterials } from "./amazon-materials";
import calcUpdated from "@/lib/generated/calc-updated.json";
import { AUTHOR } from "@/lib/seo/author";

// Per-calculator "last updated" date from git history (scripts/calc-updated.mjs):
// the latest commit touching the page, its component or its math module. An
// honest freshness signal — not the build timestamp, which made every page
// claim it changed today.
const UPDATED: Record<string, string> = calcUpdated;
function updatedIso(slug: string): string {
  return UPDATED[slug] ?? new Date().toISOString().slice(0, 10);
}
function updatedLabel(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

// Google-recognized applicationCategory enums, mapped from our category so the
// schema states what each tool actually does instead of a generic "Utility".
const APP_CATEGORY: Record<CategoryId, string> = {
  finance: "FinanceApplication",
  auto: "FinanceApplication",
  business: "BusinessApplication",
  health: "HealthApplication",
  datetime: "UtilitiesApplication",
  math: "UtilitiesApplication",
  conversions: "UtilitiesApplication",
  homediy: "UtilitiesApplication",
};

// Stable entity @ids so every page's WebApplication links back to the same
// Organization + WebSite — helps a young domain consolidate its entity graph.
const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export interface FaqItem {
  q: string;
  a: string;
}

export interface SourceRef {
  label: string;
  url: string;
}

export interface CalcContent {
  intro: string[];
  steps: string[];
  faq: FaqItem[];
  extra?: React.ReactNode;
  /** "How it's calculated": formula, assumptions, what is NOT modelled. */
  methodology?: string[];
  /** Primary sources the formula / rates come from (linked, do-follow). */
  sources?: SourceRef[];
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
  const guide = guideForCalc(slug);
  const updatedIsoDate = updatedIso(slug);
  const updated = updatedLabel(updatedIsoDate);
  const sources = content.sources ?? [];

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: calc.heading,
      description: calc.description,
      url,
      applicationCategory: APP_CATEGORY[calc.category],
      operatingSystem: "Any",
      inLanguage: "en",
      isAccessibleForFree: true,
      dateModified: updatedIsoDate,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@type": "Organization", "@id": ORG_ID, name: SITE_NAME },
      maintainer: {
        "@type": "Person",
        "@id": `${SITE_URL}/en/about#${AUTHOR.id}`,
        name: AUTHOR.name,
        jobTitle: AUTHOR.role,
        url: `${SITE_URL}/en/about`,
      },
      ...(sources.length
        ? {
            citation: sources.map((src) => ({
              "@type": "CreativeWork",
              name: src.label,
              url: src.url,
            })),
          }
        : {}),
      isPartOf: { "@type": "WebSite", "@id": SITE_ID, name: SITE_NAME, url: SITE_URL },
      publisher: {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE_NAME,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` },
      },
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
        <div className="shrink-0 pt-1 flex items-center gap-2 no-print">
          <PrintButton />
          <FavoriteButton slug={slug} />
        </div>
      </div>
      <p className="mt-3 text-lg text-[var(--ink-soft)] leading-relaxed">
        {calc.description}
      </p>
      <p className="mt-2 text-xs text-[var(--ink-soft)]">
        By {SITE_NAME} · Reviewed by{" "}
        <Link href={`/${locale}/about#${AUTHOR.id}`} className="prose-link">
          {AUTHOR.name}
        </Link>{" "}
        · Updated{" "}
        <time dateTime={updatedIsoDate}>{updated}</time> ·{" "}
        <Link href={`/${locale}/editorial-policy`} className="prose-link">
          How we check our math
        </Link>
      </p>

      {/* The interactive calculator */}
      <div className="mt-7">
        <CalcUseTracker slug={slug}>{children}</CalcUseTracker>
      </div>

      {(() => {
        const money = ["finance", "auto", "business"].includes(calc.category);
        const health = calc.category === "health";
        if (!money && !health) return null;
        return (
          <p className="mt-3 text-xs text-[var(--ink-soft)] leading-relaxed">
            {money
              ? "This is an estimate for general information only and is not financial, tax or investment advice. Figures may differ from a lender or advisor."
              : "This is an estimate for general information only and is not medical advice. Talk to a healthcare professional for decisions about your health."}{" "}
            <Link href={`/${locale}/disclaimer`} className="prose-link">
              Read our disclaimer
            </Link>
            .
          </p>
        );
      })()}

      {guide ? (
        <Link
          href={`/${locale}/guides/${guide.slug}`}
          className="mt-6 card card-hover p-4 flex items-center gap-3 no-print"
        >
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-[var(--accent-soft)] text-[var(--accent-2)] shrink-0">
            <BookOpen size={18} />
          </span>
          <span className="flex-1 min-w-0">
            <span className="font-medium text-sm block">Read the guide</span>
            <span className="text-xs text-[var(--ink-soft)] truncate block">
              {guide.title}
            </span>
          </span>
          <span className="text-[var(--accent)] text-sm font-medium shrink-0">
            Read →
          </span>
        </Link>
      ) : null}

      <AdSlot className="mt-8 no-print" />

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

        {(() => {
          const cl = crossLinkFor(slug);
          if (!cl) return null;
          return (
            <p className="text-[var(--ink-soft)] leading-relaxed mt-4">
              {cl.before}
              <a href={cl.href} rel="noopener" className="prose-link">
                {cl.anchor}
              </a>
              {cl.after}
            </p>
          );
        })()}

        {content.extra ? <div className="mt-8">{content.extra}</div> : null}

        <h2 className="mt-12 text-xl font-semibold">How to use the {calc.heading.toLowerCase()}</h2>
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

        {content.methodology?.length || sources.length ? (
          <section aria-labelledby="methodology" className="mt-12">
            <h2 id="methodology" className="text-xl font-semibold">
              How the {calc.heading.toLowerCase()} works
            </h2>
            {content.methodology?.map((p, i) => (
              <p key={i} className="text-[var(--ink-soft)] leading-relaxed mt-4">
                {p}
              </p>
            ))}
            {sources.length ? (
              <div className="mt-5 card p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
                  Sources
                </div>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {sources.map((src) => (
                    <li key={src.url}>
                      <a
                        href={src.url}
                        rel="noopener"
                        target="_blank"
                        className="prose-link"
                      >
                        {src.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-[var(--ink-soft)]">
                  Formula and figures last reviewed{" "}
                  <time dateTime={updatedIsoDate}>{updated}</time>. Found an
                  error?{" "}
                  <Link href={`/${locale}/contact`} className="prose-link">
                    Tell us
                  </Link>{" "}
                  and we will fix it — see our{" "}
                  <Link href={`/${locale}/editorial-policy`} className="prose-link">
                    editorial policy
                  </Link>
                  .
                </p>
              </div>
            ) : null}
          </section>
        ) : null}

        <h2 className="mt-12 text-xl font-semibold">{calc.title} questions, answered</h2>
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

      {/* Intent-matched affiliate recommendations — after the explanatory
          content, so the first H2 and the reading flow belong to the topic. */}
      <div className="no-print">
        <AffiliateBlock calc={calc} />
        {/* EU-only offers (e.g. BLUETTI), gated client-side by visitor
            timezone so pages stay static and non-EU visitors don't see them. */}
        <EuOfferBlock calc={calc} />
      </div>

      {/* Embed widget — only for curated embeddable calculators. The snippet's
          do-follow credit link is a backlink-seeding play (our #1 deficit). */}
      {(() => {
        const emb = embeddableFor(slug);
        if (!emb) return null;
        return (
          <EmbedSnippet
            slug={slug}
            heading={calc.heading}
            src={`${SITE_URL}/embed/${slug}`}
            canonical={url}
            height={emb.height}
          />
        );
      })()}

      {/* Amazon Associates — native "materials for this project" (DIY/health/
          finance pages only; renders nothing elsewhere). */}
      <AmazonMaterials slug={slug} />

      {/* "Try also" — one rotating internal link to a flagship money page /
          guide (never the current page). Static HTML = a crawlable internal link
          from every calculator, spread across the roster weekly. */}
      {(() => {
        const sp = spotlightForPage(slug);
        return (
          <Link
            href={`/${locale}${sp.path}`}
            className="mt-12 card card-hover p-4 flex items-center gap-3 no-print"
          >
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-[var(--accent-soft)] text-[var(--accent-2)] shrink-0">
              <Sparkles size={18} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="text-xs text-[var(--ink-soft)] block">Try also</span>
              <span className="font-medium text-sm block truncate">{sp.title}</span>
            </span>
            <span className="text-[var(--accent)] text-sm font-medium shrink-0">Open →</span>
          </Link>
        );
      })()}

      {/* Related */}
      <section className="mt-12 no-print">
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
