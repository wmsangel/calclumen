import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import {
  calcsInCategory,
  calculators,
  categories,
} from "@/lib/calculators/registry";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo/site";
import { BrandMark } from "./brand";

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="mt-20 border-t border-[var(--rule)] bg-[var(--paper-2)]">
      <div className="mx-auto max-w-6xl px-5 py-14">
        {/* Brand row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-10 border-b border-[var(--rule)]">
          <div>
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <BrandMark size={36} radius={12} />
              <span className="font-semibold text-xl tracking-tight">
                Calc<span className="text-[var(--accent)]">Lumen</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-[var(--ink-soft)] max-w-sm leading-relaxed">
              {SITE_TAGLINE}
            </p>
          </div>
          <div className="text-sm text-[var(--ink-soft)] sm:text-right">
            <span className="font-semibold text-[var(--ink)]">
              {calculators.length}
            </span>{" "}
            free calculators · no signup
          </div>
        </div>

        {/* Category sitemap */}
        <div className="grid gap-x-6 gap-y-9 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 pt-10">
          {categories.map((cat) => (
            <div key={cat.id}>
              <Link
                href={`/${locale}/${cat.slug}`}
                className="flex items-center gap-2 mb-3 group"
              >
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.accent }}
                />
                <span className="text-sm font-semibold group-hover:text-[var(--accent)] transition-colors">
                  {cat.title}
                </span>
              </Link>
              <ul className="space-y-2">
                {calcsInCategory(cat.id).map((calc) => (
                  <li key={calc.slug}>
                    <Link
                      href={`/${locale}/${calc.slug}`}
                      className="text-sm text-[var(--ink-soft)] hover:text-[var(--accent)] transition-colors"
                    >
                      {calc.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--rule)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--ink-soft)]">
          <span>© 2026 {SITE_NAME}</span>
          <nav className="flex items-center gap-4 flex-wrap justify-center">
            <Link
              href={`/${locale}/about`}
              className="hover:text-[var(--accent)]"
            >
              About
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="hover:text-[var(--accent)]"
            >
              Contact
            </Link>
            <Link
              href={`/${locale}/privacy`}
              className="hover:text-[var(--accent)]"
            >
              Privacy
            </Link>
            <Link
              href={`/${locale}/cookies`}
              className="hover:text-[var(--accent)]"
            >
              Cookies
            </Link>
            <Link
              href={`/${locale}/terms`}
              className="hover:text-[var(--accent)]"
            >
              Terms
            </Link>
          </nav>
          <span>Results are estimates — for general information only.</span>
        </div>
      </div>
    </footer>
  );
}
