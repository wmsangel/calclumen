import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { absUrl, SITE_NAME } from "@/lib/seo/site";
import {
  CHOOSE_PAGES,
  chooseTableKs,
  groupBig,
  nCr,
  nPr,
  parseChooseSlug,
} from "@/lib/programmatic/combinations";
import { AdSlot } from "@/components/ad-slot";
import { Stat, ToolCard } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    CHOOSE_PAGES.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = parseChooseSlug(slug);
  if (!page) return {};
  const { n, k } = page;
  const c = groupBig(nCr(n, k));
  return pageMetadata({
    locale,
    path: `combinations/${slug}`,
    title: `${n} choose ${k}`,
    description: `${n} choose ${k} = ${c}. See the formula, the permutations value and a free combinations calculator.`,
    keywords: [
      `${n} choose ${k}`,
      `${n}C${k}`,
      `${n} choose ${k} combinations`,
      `how many ways to choose ${k} from ${n}`,
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
  const page = parseChooseSlug(slug);
  if (!page) notFound();

  const { n, k } = page;
  const c = groupBig(nCr(n, k));
  const p = groupBig(nPr(n, k));
  const rows = chooseTableKs(n, k);

  const q1 = `What is ${n} choose ${k}?`;
  const a1 = `${n} choose ${k} equals ${c}. It counts the number of ways to choose ${k} items from ${n} when the order does not matter.`;
  const q2 = `What is the formula for ${n} choose ${k}?`;
  const a2 = `The combinations formula is C(n, k) = n! / (k! · (n − k)!). For ${n} choose ${k}: ${n}! / (${k}! · ${n - k}!) = ${c}.`;

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
        { "@type": "ListItem", position: 3, name: `${n} choose ${k}`, item: absUrl(locale, `combinations/${slug}`) },
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
          href={`/${locale}/permutations-combinations-calculator`}
          className="hover:text-[var(--accent)]"
        >
          Combinations
        </Link>
        <span>/</span>
        <span className="text-[var(--ink)]">
          {n} choose {k}
        </span>
      </nav>

      <h1 className="display mt-4 text-4xl sm:text-5xl">
        {n} choose {k}
      </h1>
      <p className="mt-3 text-lg text-[var(--ink-soft)]">
        Choosing {k} from {n} — order doesn&apos;t matter.
      </p>

      <div className="mt-6">
        <ToolCard>
          <Stat
            label="Combinations (order doesn't matter)"
            accent
            value={`${n}C${k} = ${c}`}
            sub={`Permutations (order matters): ${n}P${k} = ${p}`}
          />
          <div className="mt-4 text-sm text-[var(--ink-soft)] leading-relaxed">
            There are <strong className="text-[var(--ink)]">{c}</strong> ways to
            choose {k} items from {n} when order doesn&apos;t matter, using the
            formula C(n, k) = n! / (k! · (n − k)!).
          </div>
        </ToolCard>
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold">{n} choose k table</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--ink-soft)]">
              <th className="py-1.5 font-medium">Expression</th>
              <th className="py-1.5 font-medium">Combinations</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {rows.map((kk) => (
              <tr key={kk} className="border-t border-[var(--rule)]">
                <td className="py-1.5">
                  {kk === k ? (
                    <strong>
                      {n} choose {kk}
                    </strong>
                  ) : (
                    <Link
                      href={`/${locale}/combinations/${n}-choose-${kk}`}
                      className="text-[var(--accent)] hover:underline"
                    >
                      {n} choose {kk}
                    </Link>
                  )}
                </td>
                <td className="py-1.5">{groupBig(nCr(n, kk))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Try your own numbers</h2>
        <p className="mt-2 text-[var(--ink-soft)]">
          Need different values? The full{" "}
          <Link
            href={`/${locale}/permutations-combinations-calculator`}
            className="text-[var(--accent)] font-medium hover:underline"
          >
            permutations &amp; combinations calculator
          </Link>{" "}
          computes nCr and nPr for any n and k.
        </p>
      </section>

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
