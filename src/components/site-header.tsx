import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { categories } from "@/lib/calculators/registry";
import { SiteSearch } from "./site-search";
import { ThemeToggle } from "./theme-toggle";
import { BrandMark } from "./brand";

export function SiteHeader({ locale }: { locale: Locale }) {
  return (
    <header className="sticky top-0 z-30 bg-[var(--paper)]/85 backdrop-blur-md border-b border-[var(--rule)]">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center gap-4">
        <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
          <BrandMark size={32} />
          <span className="font-semibold text-lg tracking-tight hidden sm:inline">
            Calc<span className="text-[var(--accent)]">Lumen</span>
          </span>
        </Link>

        <div className="flex-1 max-w-sm mx-auto sm:mx-0">
          <SiteSearch locale={locale} />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <nav className="hidden lg:flex items-center gap-1 text-sm">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${locale}/${cat.slug}`}
                className="px-3 py-1.5 rounded-lg whitespace-nowrap text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--paper-2)] transition-colors"
              >
                {cat.title}
              </Link>
            ))}
            <Link
              href={`/${locale}/guides`}
              className="px-3 py-1.5 rounded-lg whitespace-nowrap text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--paper-2)] transition-colors"
            >
              Guides
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
