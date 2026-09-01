import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { absUrl, SITE_NAME } from "@/lib/seo/site";
import {
  FACTOR_PAGES,
  divisorsOf,
  factorPairs,
  factorizationString,
  groupNum,
  isPrime,
  nearbyNumbers,
  parseFactorSlug,
} from "@/lib/programmatic/factors";
import { AdSlot } from "@/components/ad-slot";
import { Stat, ToolCard } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    FACTOR_PAGES.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = parseFactorSlug(slug);
  if (!page) return {};
  const { n } = page;
  const divs = divisorsOf(n);
  const list = divs.map(groupNum).join(", ");
  const fz = factorizationString(n);
  return pageMetadata({
    locale,
    path: `factors/${slug}`,
    title: `Factors of ${n}`,
    description: `The factors of ${n} are ${list}. Prime factorization: ${fz}. See all factor pairs, the divisor count and sum.`,
    keywords: [
      `factors of ${n}`,
      `prime factorization of ${n}`,
      `divisors of ${n}`,
      `${n} factors`,
      `what are the factors of ${n}`,
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
  const page = parseFactorSlug(slug);
  if (!page) notFound();

  const { n } = page;
  const divs = divisorsOf(n);
  const pairs = factorPairs(n);
  const fz = factorizationString(n);
  const prime = isPrime(n);
  const sum = divs.reduce((a, b) => a + b, 0);
  const list = divs.map(groupNum).join(", ");
  const nearby = nearbyNumbers(n);

  const q1 = `What are the factors of ${n}?`;
  const a1 = `The factors of ${n} are ${list} — that is ${divs.length} factors in total.`;
  const q2 = `What is the prime factorization of ${n}?`;
  const a2 = prime
    ? `${n} is a prime number, so its only factors are 1 and ${n} and its prime factorization is just ${n}.`
    : `The prime factorization of ${n} is ${fz}.`;
  const q3 = `Is ${n} a prime number?`;
  const a3 = prime
    ? `Yes. ${n} has exactly two factors, 1 and itself, so it is prime.`
    : `No. ${n} has ${divs.length} factors, more than just 1 and itself, so it is a composite number.`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: q1, acceptedAnswer: { "@type": "Answer", text: a1 } },
        { "@type": "Question", name: q2, acceptedAnswer: { "@type": "Answer", text: a2 } },
        { "@type": "Question", name: q3, acceptedAnswer: { "@type": "Answer", text: a3 } },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: absUrl(locale) },
        { "@type": "ListItem", position: 2, name: "Math", item: absUrl(locale, "math") },
        { "@type": "ListItem", position: 3, name: `Factors of ${n}`, item: absUrl(locale, `factors/${slug}`) },
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
          href={`/${locale}/prime-factorization-calculator`}
          className="hover:text-[var(--accent)]"
        >
          Prime factorization
        </Link>
        <span>/</span>
        <span className="text-[var(--ink)]">Factors of {n}</span>
      </nav>

      <h1 className="display mt-4 text-4xl sm:text-5xl">Factors of {n}</h1>
      <p className="mt-3 text-lg text-[var(--ink-soft)]">
        {n} has {divs.length} factors{prime ? " — it is a prime number" : ""}.
      </p>

      <div className="mt-6">
        <ToolCard>
          <Stat
            label={`All factors of ${n}`}
            accent
            value={list}
            sub={`Prime factorization: ${fz}${prime ? " (prime)" : ""}`}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Stat label="Number of factors" value={groupNum(divs.length)} />
            <Stat label="Sum of factors" value={groupNum(sum)} />
            <Stat label="Prime?" value={prime ? "Yes" : "No"} />
          </div>
        </ToolCard>
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Factor pairs of {n}</h2>
        <p className="mt-2 text-[var(--ink-soft)]">
          Each pair multiplies together to make {n}:
        </p>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--ink-soft)]">
              <th className="py-1.5 font-medium">Pair</th>
              <th className="py-1.5 font-medium">Product</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {pairs.map(([a, b]) => (
              <tr key={a} className="border-t border-[var(--rule)]">
                <td className="py-1.5">
                  {groupNum(a)} × {groupNum(b)}
                </td>
                <td className="py-1.5">{groupNum(n)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Factors of nearby numbers</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {nearby.map((m) =>
            m === n ? (
              <span
                key={m}
                className="rounded-lg border border-[var(--rule)] bg-[var(--accent-soft)] px-3 py-1.5 text-sm font-medium"
              >
                {m}
              </span>
            ) : (
              <Link
                key={m}
                href={`/${locale}/factors/${m}`}
                className="rounded-lg border border-[var(--rule)] px-3 py-1.5 text-sm text-[var(--accent)] hover:border-[var(--accent)]"
              >
                {m}
              </Link>
            ),
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Factor any number</h2>
        <p className="mt-2 text-[var(--ink-soft)]">
          Need a different number? The{" "}
          <Link
            href={`/${locale}/prime-factorization-calculator`}
            className="text-[var(--accent)] font-medium hover:underline"
          >
            prime factorization calculator
          </Link>{" "}
          breaks any number into its prime factors and lists all its divisors.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Frequently asked questions</h2>
        <div className="mt-4 space-y-2">
          {[
            { q: q1, a: a1 },
            { q: q2, a: a2 },
            { q: q3, a: a3 },
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
