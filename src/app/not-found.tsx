import Link from "next/link";
import { defaultLocale } from "@/lib/i18n/config";
import { calculators } from "@/lib/calculators/registry";
import { SITE_NAME } from "@/lib/seo/site";
import { SiteSearch } from "@/components/site-search";
import { CalcBadge } from "@/components/calc-icon";
import { BrandMark } from "@/components/brand";

export default function NotFound() {
  const locale = defaultLocale;
  const popular = calculators.filter((c) => c.popular).slice(0, 6);

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <BrandMark size={32} />
            <span className="font-semibold text-lg tracking-tight">
              Calc<span className="text-[var(--accent)]">Lumen</span>
            </span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-5 py-16 sm:py-20 text-center">
        <div className="display text-7xl sm:text-8xl text-[var(--accent)]">404</div>
        <h1 className="display mt-4 text-2xl sm:text-3xl">
          This page didn&rsquo;t add up
        </h1>
        <p className="mt-3 text-[var(--ink-soft)] leading-relaxed">
          The page you&rsquo;re looking for isn&rsquo;t here. Try a search, or
          jump to one of our popular calculators.
        </p>

        <div className="mt-7 max-w-md mx-auto text-left">
          <SiteSearch locale={locale} placeholder="Search calculators…" />
        </div>

        <div className="mt-10 text-left">
          <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)] mb-3 text-center">
            Popular calculators
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {popular.map((c) => (
              <Link
                key={c.slug}
                href={`/${locale}/${c.slug}`}
                className="card card-hover p-4 flex items-center gap-3"
              >
                <CalcBadge calc={c} size={16} tile={34} />
                <span className="font-medium text-sm">{c.title}</span>
              </Link>
            ))}
          </div>
        </div>

        <Link href={`/${locale}`} className="btn-primary mt-10 inline-flex">
          Back to {SITE_NAME}
        </Link>
      </div>
    </div>
  );
}
