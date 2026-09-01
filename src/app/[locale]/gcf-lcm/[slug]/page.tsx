import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { absUrl, SITE_NAME } from "@/lib/seo/site";
import {
  GCFLCM_PAGES,
  factorString,
  gcd,
  lcm,
  parseGcfLcmSlug,
  relatedPairs,
} from "@/lib/programmatic/gcflcm";
import { AdSlot } from "@/components/ad-slot";
import { Stat, ToolCard } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    GCFLCM_PAGES.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = parseGcfLcmSlug(slug);
  if (!page) return {};
  const { a, b } = page;
  const g = gcd(a, b);
  const l = lcm(a, b);
  return pageMetadata({
    locale,
    path: `gcf-lcm/${slug}`,
    title: `GCF and LCM of ${a} and ${b}`,
    description: `The GCF of ${a} and ${b} is ${g} and the LCM is ${l}. See the prime factorizations, the step-by-step method and a free GCF/LCM calculator.`,
    keywords: [
      `gcf of ${a} and ${b}`,
      `lcm of ${a} and ${b}`,
      `greatest common factor of ${a} and ${b}`,
      `least common multiple of ${a} and ${b}`,
      `${a} and ${b} gcf lcm`,
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
  const page = parseGcfLcmSlug(slug);
  if (!page) notFound();

  const { a, b } = page;
  const g = gcd(a, b);
  const l = lcm(a, b);
  const related = relatedPairs(page);

  const q1 = `What is the GCF of ${a} and ${b}?`;
  const a1 = `The greatest common factor (GCF) of ${a} and ${b} is ${g} — the largest number that divides both ${a} and ${b} with no remainder.`;
  const q2 = `What is the LCM of ${a} and ${b}?`;
  const a2 = `The least common multiple (LCM) of ${a} and ${b} is ${l} — the smallest number that both ${a} and ${b} divide into. It equals ${a} × ${b} ÷ GCF = ${a * b} ÷ ${g} = ${l}.`;

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
        { "@type": "ListItem", position: 3, name: `GCF & LCM of ${a} and ${b}`, item: absUrl(locale, `gcf-lcm/${slug}`) },
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
          href={`/${locale}/lcm-gcd-calculator`}
          className="hover:text-[var(--accent)]"
        >
          GCF &amp; LCM
        </Link>
        <span>/</span>
        <span className="text-[var(--ink)]">
          {a} and {b}
        </span>
      </nav>

      <h1 className="display mt-4 text-4xl sm:text-5xl">
        GCF and LCM of {a} and {b}
      </h1>
      <p className="mt-3 text-lg text-[var(--ink-soft)]">
        The greatest common factor and least common multiple of {a} and {b}.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <ToolCard>
          <Stat label={`GCF of ${a} and ${b}`} accent value={String(g)} />
        </ToolCard>
        <ToolCard>
          <Stat label={`LCM of ${a} and ${b}`} accent value={String(l)} />
        </ToolCard>
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold">How it works</h2>
        <p className="mt-2 text-[var(--ink-soft)] leading-relaxed">
          Break each number into its prime factors:
        </p>
        <ul className="mt-3 space-y-1 text-[var(--ink)]">
          <li>
            {a} = <strong>{factorString(a)}</strong>
          </li>
          <li>
            {b} = <strong>{factorString(b)}</strong>
          </li>
        </ul>
        <p className="mt-3 text-[var(--ink-soft)] leading-relaxed">
          The <strong className="text-[var(--ink)]">GCF ({g})</strong> multiplies
          the primes both share, at the lowest power each appears. The{" "}
          <strong className="text-[var(--ink)]">LCM ({l})</strong> multiplies
          every prime that appears in either number, at the highest power — which
          is also {a} × {b} ÷ {g} = {l}.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Try other numbers</h2>
        <p className="mt-2 text-[var(--ink-soft)]">
          Need a different pair? The{" "}
          <Link
            href={`/${locale}/lcm-gcd-calculator`}
            className="text-[var(--accent)] font-medium hover:underline"
          >
            LCM &amp; GCF calculator
          </Link>{" "}
          computes the GCF and LCM for any two numbers.
        </p>
      </section>

      {related.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Related pairs</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/${locale}/gcf-lcm/${p.slug}`}
                className="rounded-lg border border-[var(--rule)] px-3 py-1.5 text-sm text-[var(--accent)] hover:border-[var(--accent)]"
              >
                {p.a} and {p.b}
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
