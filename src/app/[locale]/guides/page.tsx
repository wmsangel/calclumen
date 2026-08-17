import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCategory } from "@/lib/calculators/registry";
import { GUIDES } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo/metadata";
import { SITE_NAME } from "@/lib/seo/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({
    locale,
    path: "guides",
    title: "Guides",
    description: `Plain-English guides to the math behind ${SITE_NAME}'s calculators — mortgages, compound interest, BMI, tax and more.`,
  });
}

export default async function GuidesIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <nav className="flex items-center gap-1.5 text-sm text-[var(--ink-soft)]">
        <Link href={`/${locale}`} className="hover:text-[var(--accent)]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[var(--ink)]">Guides</span>
      </nav>

      <h1 className="display mt-4 text-3xl sm:text-4xl">Guides</h1>
      <p className="mt-3 text-lg text-[var(--ink-soft)] leading-relaxed max-w-2xl">
        Short, plain-English explainers for the math behind our calculators — so
        you understand the result, not just the number.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {GUIDES.map((g) => {
          const cat = getCategory(g.category);
          return (
            <Link
              key={g.slug}
              href={`/${locale}/guides/${g.slug}`}
              className="card card-hover p-5 flex flex-col"
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: cat.accent }}
                />
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
                  {cat.title} · {g.readMins} min read
                </span>
              </div>
              <h2 className="mt-2 font-semibold text-lg leading-tight">
                {g.title}
              </h2>
              <p className="mt-1.5 text-sm text-[var(--ink-soft)] flex-1 leading-snug">
                {g.description}
              </p>
              <span className="mt-3 text-sm text-[var(--accent)] font-medium">
                Read guide →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
