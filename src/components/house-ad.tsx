"use client";

import { useEffect, useState } from "react";
import { PROMOS } from "@/lib/house-ads";

/**
 * A cross-promotion card for our own network, shown in ad slots until real
 * ads go live. Rotates to a random promo on each load; SSR renders the first
 * one so hydration stays stable. Links are rel="sponsored nofollow".
 */
export function HouseAd({ className = "" }: { className?: string }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (PROMOS.length > 1) setI(Math.floor(Math.random() * PROMOS.length));
  }, []);

  const p = PROMOS[i];
  if (!p) return null;

  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer sponsored nofollow"
      className={`group flex items-center gap-4 rounded-xl border border-[var(--rule)] bg-[var(--paper-2)] px-4 py-3 min-h-[90px] transition-colors hover:border-[var(--accent)] ${className}`}
    >
      <span
        className="grid place-items-center w-11 h-11 rounded-xl shrink-0 font-bold text-lg text-white"
        style={{ background: p.accent }}
      >
        {p.name.charAt(0)}
      </span>
      <span className="flex-1 min-w-0">
        <span className="flex items-center gap-2">
          <span className="font-semibold truncate">{p.name}</span>
          {p.lang ? (
            <span className="text-[0.6rem] uppercase tracking-wide rounded bg-[var(--rule)] text-[var(--ink-soft)] px-1.5 py-0.5">
              {p.lang}
            </span>
          ) : null}
        </span>
        <span className="block text-sm text-[var(--ink-soft)] leading-snug line-clamp-2">
          {p.tagline}
        </span>
      </span>
      <span className="shrink-0 flex flex-col items-end gap-1">
        <span className="text-[0.55rem] uppercase tracking-wider text-[var(--ink-soft)]">
          Our network
        </span>
        <span className="text-sm font-medium text-[var(--accent)] group-hover:translate-x-0.5 transition-transform">
          Visit →
        </span>
      </span>
    </a>
  );
}
