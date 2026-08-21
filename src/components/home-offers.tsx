"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
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
    <section className="py-8">
      <div className="offer-panel">
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid place-items-center w-7 h-7 rounded-lg bg-[var(--accent)] text-[var(--on-accent)] shrink-0">
              <Sparkles size={15} />
            </span>
            <h2 className="text-lg font-semibold">{HOME_OFFERS_LABEL}</h2>
          </div>
          <span className="text-[11px] uppercase tracking-wide text-[var(--ink-soft)]">
            Ad
          </span>
        </div>
        <p className="mt-1 text-xs text-[var(--ink-soft)]">
          Some of these are affiliate links — we may earn a commission at no
          extra cost to you.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((o) => (
            <a
              key={o.id}
              href={o.url}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="offer-card"
            >
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{o.name}</span>
                  {o.badge ? (
                    <span className="offer-badge">{o.badge}</span>
                  ) : null}
                </span>
                <span className="mt-0.5 block text-xs text-[var(--ink-soft)] leading-snug line-clamp-2">
                  {o.blurb}
                </span>
              </span>
              <span className="offer-cta">{o.cta ?? "Visit"} →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
