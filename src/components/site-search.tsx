"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { calculators, getCalc, getCategory } from "@/lib/calculators/registry";
import { CalcBadge } from "./calc-icon";

interface Hit {
  slug: string;
  title: string;
  category: string;
  score: number;
}

/** Instant client-side search over the calculator catalog. */
export function SiteSearch({
  locale,
  placeholder = "Search calculators…",
}: {
  locale: Locale;
  placeholder?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pre-build a lowercase haystack per calculator.
  const index = useMemo(
    () =>
      calculators.map((c) => ({
        calc: c,
        title: c.title,
        category: getCategory(c.category).title,
        hay: [
          c.title,
          c.heading,
          c.description,
          getCategory(c.category).title,
          ...c.keywords,
        ]
          .join(" ")
          .toLowerCase(),
        titleLc: c.title.toLowerCase(),
      })),
    [],
  );

  const hits: Hit[] = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    const out: Hit[] = [];
    for (const item of index) {
      if (!item.hay.includes(query)) continue;
      let score = 3;
      if (item.titleLc.startsWith(query)) score = 0;
      else if (item.titleLc.includes(query)) score = 1;
      else if (item.calc.keywords.some((k) => k.toLowerCase().includes(query)))
        score = 2;
      out.push({
        slug: item.calc.slug,
        title: item.title,
        category: item.category,
        score,
      });
    }
    return out.sort((a, b) => a.score - b.score || a.title.localeCompare(b.title)).slice(0, 8);
  }, [q, index]);

  // Close on outside click.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // "/" focuses the search from anywhere.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => setActive(0), [q]);

  function go(slug: string) {
    setOpen(false);
    setQ("");
    router.push(`/${locale}/${slug}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || hits.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, hits.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(hits[active].slug);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-soft)] pointer-events-none"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label="Search calculators"
          className="field !pl-9 !py-2 text-sm"
          style={{ borderRadius: 10 }}
        />
      </div>

      {open && q.trim() ? (
        <div className="absolute z-40 mt-2 w-full card p-1.5 overflow-hidden">
          {hits.length === 0 ? (
            <div className="px-3 py-3 text-sm text-[var(--ink-soft)]">
              No calculators match “{q.trim()}”.
            </div>
          ) : (
            <ul>
              {hits.map((h, i) => (
                <li key={h.slug}>
                  <Link
                    href={`/${locale}/${h.slug}`}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => {
                      setOpen(false);
                      setQ("");
                    }}
                    className={`flex items-center justify-between gap-3 px-2.5 py-2 rounded-lg ${
                      i === active ? "bg-[var(--accent-soft)]" : ""
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <CalcBadge calc={getCalc(h.slug)!} size={14} tile={26} />
                      <span className="text-sm font-medium text-[var(--ink)] truncate">
                        {h.title}
                      </span>
                    </span>
                    <span className="text-xs text-[var(--ink-soft)] shrink-0">
                      {h.category}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
