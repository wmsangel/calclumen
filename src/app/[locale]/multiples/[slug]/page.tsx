import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { absUrl, SITE_NAME } from "@/lib/seo/site";
import {
  MULTIPLES_PAGES,
  multiplesOf,
  parseMultiplesSlug,
  relatedMultiples,
} from "@/lib/programmatic/multiples";
import { AdSlot } from "@/components/ad-slot";
import { Stat, ToolCard } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    MULTIPLES_PAGES.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = parseMultiplesSlug(slug);
  if (!page) return {};
  const { n } = page;
  const first = multiplesOf(n, 10).join(", ");
  return pageMetadata({
    locale,
    path: `multiples/${slug}`,
    title: `Multiples of ${n}`,
    description: `The first multiples of ${n} are ${first}, and so on. See the multiples table, the divisibility rule and a free calculator.`,
    keywords: [
      `multiples of ${n}`,
      `first multiples of ${n}`,
      `list of multiples of ${n}`,
      `what are the multiples of ${n}`,
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
  const page = parseMultiplesSlug(slug);
  if (!page) notFound();

  const { n } = page;
  const first12 = multiplesOf(n, 12);
  const table = multiplesOf(n, 30);
  const related = relatedMultiples(page);

  const q1 = `What are the multiples of ${n}?`;
  const a1 = `The multiples of ${n} are ${n} times each whole number: ${first12
    .slice(0, 10)
    .join(", ")}, and so on without end. Every multiple of ${n} divides evenly by ${n}.`;
  const q2 = `Is a number a multiple of ${n}?`;
  const a2 = `A number is a multiple of ${n} if it divides by ${n} with no remainder. For example, ${n * 6} ÷ ${n} = 6, so ${n * 6} is a multiple of ${n}; a number like ${n * 6 + 1} is not.`;

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
        { "@type": "ListItem", position: 3, name: `Multiples of ${n}`, item: absUrl(locale, `multiples/${slug}`) },
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
        <span className="text-[var(--ink)]">Multiples of {n}</span>
      </nav>

      <h1 className="display mt-4 text-4xl sm:text-5xl">Multiples of {n}</h1>
      <p className="mt-3 text-lg text-[var(--ink-soft)]">
        The numbers you get by multiplying {n} by 1, 2, 3, and so on.
      </p>

      <div className="mt-6">
        <ToolCard>
          <Stat
            label={`First 12 multiples of ${n}`}
            accent
            value={first12.join(", ")}
          />
          <p className="mt-3 text-sm text-[var(--ink-soft)] leading-relaxed">
            The multiples of {n} continue forever — each one is {n} more than the
            last. Every multiple divides exactly by {n}.
          </p>
        </ToolCard>
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Multiples of {n} table</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--ink-soft)]">
                <th className="py-1.5 font-medium">×</th>
                <th className="py-1.5 font-medium">Multiple</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {table.map((v, i) => (
                <tr key={i} className="border-t border-[var(--rule)]">
                  <td className="py-1.5">{n} × {i + 1}</td>
                  <td className="py-1.5">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Least common multiple</h2>
        <p className="mt-2 text-[var(--ink-soft)]">
          Looking for the smallest number that {n} and another number both divide
          into? The{" "}
          <Link
            href={`/${locale}/lcm-gcd-calculator`}
            className="text-[var(--accent)] font-medium hover:underline"
          >
            LCM &amp; GCF calculator
          </Link>{" "}
          finds the least common multiple of any numbers.
        </p>
      </section>

      {related.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Multiples of other numbers</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/${locale}/multiples/${p.slug}`}
                className="rounded-lg border border-[var(--rule)] px-3 py-1.5 text-sm text-[var(--accent)] hover:border-[var(--accent)]"
              >
                Multiples of {p.n}
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
