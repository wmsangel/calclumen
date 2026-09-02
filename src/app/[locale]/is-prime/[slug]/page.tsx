import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { absUrl, SITE_NAME } from "@/lib/seo/site";
import {
  ISPRIME_PAGES,
  factorString,
  isPrime,
  parseIsPrimeSlug,
  relatedIsPrime,
  smallestFactor,
} from "@/lib/programmatic/isprime";
import { AdSlot } from "@/components/ad-slot";
import { Stat, ToolCard } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    ISPRIME_PAGES.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = parseIsPrimeSlug(slug);
  if (!page) return {};
  const { n } = page;
  const prime = isPrime(n);
  const answer = prime ? "Yes" : "No";
  return pageMetadata({
    locale,
    path: `is-prime/${slug}`,
    title: `Is ${n} a Prime Number?`,
    description: prime
      ? `${answer} — ${n} is a prime number. Its only divisors are 1 and ${n}. See why, with the method and a free prime factorization calculator.`
      : `${answer} — ${n} is not a prime number; it is divisible by ${smallestFactor(n)}. See the factorization, the method and a free prime factorization calculator.`,
    keywords: [
      `is ${n} a prime number`,
      `is ${n} prime`,
      `${n} prime or composite`,
      `factors of ${n}`,
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
  const page = parseIsPrimeSlug(slug);
  if (!page) notFound();

  const { n } = page;
  const prime = isPrime(n);
  const sf = smallestFactor(n);
  const facts = factorString(n);
  const related = relatedIsPrime(page);

  const reason =
    n < 2
      ? `${n} is neither prime nor composite — a prime number must be greater than 1.`
      : prime
        ? `${n} is prime because it has no divisors other than 1 and itself.`
        : `${n} is composite because it is divisible by ${sf} (${n} = ${facts}), so it has factors other than 1 and itself.`;

  const q1 = `Is ${n} a prime number?`;
  const a1 = `${prime ? "Yes" : "No"}, ${reason}`;
  const q2 = prime
    ? `What are the factors of ${n}?`
    : `What is ${n} divisible by?`;
  const a2 = prime
    ? `As a prime number, ${n} has exactly two factors: 1 and ${n}.`
    : `${n} is divisible by more than just 1 and itself. Its prime factorization is ${n} = ${facts}.`;

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
        { "@type": "ListItem", position: 3, name: `Is ${n} prime?`, item: absUrl(locale, `is-prime/${slug}`) },
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
        <span className="text-[var(--ink)]">Is {n} prime?</span>
      </nav>

      <h1 className="display mt-4 text-4xl sm:text-5xl">
        Is {n} a Prime Number?
      </h1>

      <div className="mt-6">
        <ToolCard>
          <Stat
            label={`Is ${n} prime?`}
            accent
            value={prime ? "Yes" : "No"}
            sub={
              prime
                ? `${n} has no divisors other than 1 and ${n}.`
                : `${n} = ${facts} (divisible by ${sf}).`
            }
          />
        </ToolCard>
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Why</h2>
        <p className="mt-2 text-[var(--ink-soft)] leading-relaxed">{reason}</p>
        <p className="mt-3 text-[var(--ink-soft)] leading-relaxed">
          A prime number is a whole number greater than 1 whose only factors are
          1 and itself. To check {n}, test whether any prime up to √{n} divides
          it evenly — if none do, it is prime.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Check another number</h2>
        <p className="mt-2 text-[var(--ink-soft)]">
          The{" "}
          <Link
            href={`/${locale}/prime-factorization-calculator`}
            className="text-[var(--accent)] font-medium hover:underline"
          >
            prime factorization calculator
          </Link>{" "}
          tests any number and shows its prime factors and all divisors.
        </p>
      </section>

      {related.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Nearby numbers</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/${locale}/is-prime/${p.slug}`}
                className="rounded-lg border border-[var(--rule)] px-3 py-1.5 text-sm text-[var(--accent)] hover:border-[var(--accent)]"
              >
                Is {p.n} prime?
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
