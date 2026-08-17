"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { categories } from "@/lib/calculators/registry";

/** Compact category menu for small screens (header nav is hidden below lg). */
export function MobileMenu({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden relative">
      <button
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="grid place-items-center w-9 h-9 rounded-lg border border-[var(--rule-strong)] bg-[var(--paper-2)] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {open ? (
        <>
          <div
            className="fixed inset-0 z-40"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <nav className="absolute right-0 mt-2 w-56 z-50 card p-2 shadow-lg">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${locale}/${cat.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-[var(--paper)] transition-colors"
              >
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: cat.accent }}
                />
                {cat.title}
              </Link>
            ))}
            <Link
              href={`/${locale}/guides`}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-[var(--paper)] transition-colors"
            >
              Guides
            </Link>
          </nav>
        </>
      ) : null}
    </div>
  );
}
