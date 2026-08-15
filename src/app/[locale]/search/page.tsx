import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { calculators, getCategory } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcBadge } from "@/components/calc-icon";
import { SiteSearch } from "@/components/site-search";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const meta = pageMetadata({
    locale,
    path: "search",
    title: "Search calculators",
    description: "Search all CalcLumen calculators and converters.",
  });
  // Query pages shouldn't be indexed, but links should still be followed.
  return { ...meta, robots: { index: false, follow: true } };
}

function search(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return calculators
    .map((c) => {
      const hay = [c.title, c.heading, c.description, ...c.keywords]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return null;
      const score = c.title.toLowerCase().startsWith(q)
        ? 0
        : c.title.toLowerCase().includes(q)
          ? 1
          : 2;
      return { calc: c, score };
    })
    .filter((x): x is { calc: (typeof calculators)[number]; score: number } => x !== null)
    .sort((a, b) => a.score - b.score || a.calc.title.localeCompare(b.calc.title));
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { q = "" } = await searchParams;
  const results = search(q);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="display text-3xl sm:text-4xl">Search</h1>
      <div className="mt-5 max-w-md">
        <SiteSearch locale={locale} />
      </div>

      {q.trim() ? (
        <p className="mt-6 text-sm text-[var(--ink-soft)]">
          {results.length} result{results.length === 1 ? "" : "s"} for “{q.trim()}”
        </p>
      ) : (
        <p className="mt-6 text-sm text-[var(--ink-soft)]">
          Type above to search all {calculators.length} calculators.
        </p>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {results.map(({ calc }) => (
          <Link
            key={calc.slug}
            href={`/${locale}/${calc.slug}`}
            className="card card-hover p-4 flex items-center gap-3"
          >
            <CalcBadge calc={calc} size={16} tile={34} />
            <span>
              <span className="font-medium text-sm block">{calc.title}</span>
              <span className="text-xs text-[var(--ink-soft)]">
                {getCategory(calc.category).title}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
