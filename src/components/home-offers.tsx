"use client";

import { useEffect, useState } from "react";
import { HOME_FEATURED, HOME_OFFERS_LABEL } from "@/lib/offers";

/**
 * A single, tasteful affiliate block for the homepage. Shows up to `max`
 * offers from the curated pool, shuffled on mount so it rotates across visits.
 * Renders deterministically on the server (first `max` in order) and reshuffles
 * after hydration to avoid a mismatch. Nothing renders if the pool is empty.
 */
export function HomeOffers({ max = 3 }: { max?: number }) {
  const [offers, setOffers] = useState(() => HOME_FEATURED.slice(0, max));

  useEffect(() => {
    const shuffled = [...HOME_FEATURED];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setOffers(shuffled.slice(0, max));
  }, [max]);

  if (offers.length === 0) return null;

  return (
    <section className="py-8 border-b border-[var(--rule)]">
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <h2 className="text-lg font-semibold">{HOME_OFFERS_LABEL}</h2>
        <span className="text-xs text-[var(--ink-soft)]">Ad</span>
      </div>
      <p className="text-xs text-[var(--ink-soft)] mb-4">
        Some of these are affiliate links — we may earn a commission at no extra
        cost to you.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((o) => (
          <a
            key={o.id}
            href={o.url}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="card card-hover p-4 flex items-center justify-between gap-3"
          >
            <span className="min-w-0">
              <span className="font-semibold text-sm block">{o.name}</span>
              <span className="text-xs text-[var(--ink-soft)] block truncate">
                {o.blurb}
              </span>
            </span>
            <span className="text-sm font-medium text-[var(--accent)] shrink-0">
              {o.cta ?? "Visit"} →
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
