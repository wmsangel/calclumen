import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { absUrl, SITE_NAME } from "@/lib/seo/site";
import {
  NUMWORDS_PAGES,
  integerToWords,
  parseNumWordsSlug,
  relatedNumbers,
  titleCaseWords,
} from "@/lib/programmatic/numwords";
import { AdSlot } from "@/components/ad-slot";
import { Stat, ToolCard } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    NUMWORDS_PAGES.map((p) => ({ locale, slug: p.slug })),
  );
}

const fmt = (n: number) => n.toLocaleString("en-US");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = parseNumWordsSlug(slug);
  if (!page) return {};
  const { n } = page;
  const words = integerToWords(n);
  return pageMetadata({
    locale,
    path: `number-in-words/${slug}`,
    title: `${fmt(n)} in Words`,
    description: `${fmt(n)} in words is "${words}". See how to write and spell ${fmt(n)}, plus a free number-to-words converter.`,
    keywords: [
      `${n} in words`,
      `how to write ${n} in words`,
      `how do you spell ${n}`,
      `${n} spelling`,
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
  const page = parseNumWordsSlug(slug);
  if (!page) notFound();

  const { n } = page;
  const words = integerToWords(n);
  const title = titleCaseWords(words);
  const related = relatedNumbers(page);

  const q1 = `How do you write ${fmt(n)} in words?`;
  const a1 = `${fmt(n)} in words is written as "${words}".`;
  const q2 = `How do you write ${fmt(n)} on a cheque?`;
  const a2 = `On a cheque you would write "${title}" for the amount in words, capitalising the start of each word.`;

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
        { "@type": "ListItem", position: 3, name: `${fmt(n)} in words`, item: absUrl(locale, `number-in-words/${slug}`) },
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
          href={`/${locale}/number-to-words-calculator`}
          className="hover:text-[var(--accent)]"
        >
          Number to words
        </Link>
        <span>/</span>
        <span className="text-[var(--ink)]">{fmt(n)} in words</span>
      </nav>

      <h1 className="display mt-4 text-4xl sm:text-5xl">{fmt(n)} in Words</h1>
      <p className="mt-3 text-lg text-[var(--ink-soft)]">
        How to write and spell the number {fmt(n)}.
      </p>

      <div className="mt-6">
        <ToolCard>
          <Stat
            label={`${fmt(n)} in words`}
            accent
            value={words}
            sub={`Capitalised: ${title}`}
          />
        </ToolCard>
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold">How to say it</h2>
        <p className="mt-2 text-[var(--ink-soft)] leading-relaxed">
          To read {fmt(n)} out loud, break it into groups of three digits from
          the right and name each group with its place value (thousand, million,
          and so on). That gives{" "}
          <strong className="text-[var(--ink)]">{words}</strong>.
        </p>
        <p className="mt-3 text-[var(--ink-soft)] leading-relaxed">
          When writing it on a cheque, capitalise each word:{" "}
          <strong className="text-[var(--ink)]">{title}</strong>.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Spell another number</h2>
        <p className="mt-2 text-[var(--ink-soft)]">
          The{" "}
          <Link
            href={`/${locale}/number-to-words-calculator`}
            className="text-[var(--accent)] font-medium hover:underline"
          >
            number to words converter
          </Link>{" "}
          writes any number in words, including decimals and a cheque-style
          amount.
        </p>
      </section>

      {related.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Related numbers</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/${locale}/number-in-words/${p.slug}`}
                className="rounded-lg border border-[var(--rule)] px-3 py-1.5 text-sm text-[var(--accent)] hover:border-[var(--accent)]"
              >
                {fmt(p.n)}
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
