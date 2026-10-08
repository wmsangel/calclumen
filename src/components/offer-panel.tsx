"use client";

import { Sparkles } from "lucide-react";
import type { OfferGroup } from "@/lib/offers";
import { track } from "@/lib/track";
import { OfferLogo } from "./offer-logo";

/**
 * Presentational offer panel shared by the server-rendered {@link
 * AffiliateBlock} and the client-gated EuOfferBlock, so both render identical
 * cards, disclosure and layout. Links are rel="sponsored nofollow".
 * `context` (the calculator slug, or "home") is sent with the offer_click
 * event so we can see which pages actually convert clicks.
 */
export function OfferPanel({ group, context }: { group: OfferGroup; context?: string }) {
  return (
    <section className="mt-12">
      <div className="offer-panel">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-7 h-7 rounded-lg bg-[var(--accent)] text-[var(--on-accent)] shrink-0">
            <Sparkles size={15} />
          </span>
          <h2 className="text-lg font-semibold">{group.label}</h2>
        </div>
        <p className="mt-1 text-xs text-[var(--ink-soft)]">
          Some of these are affiliate links — we may earn a commission at no
          extra cost to you.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {group.offers.map((o) => (
            <a
              key={o.id}
              href={o.url}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="offer-card"
              onClick={() =>
                track("offer_click", { offer: o.id, group: group.label, context: context ?? "" })
              }
            >
              <OfferLogo id={o.id} name={o.name} />
              <span className="offer-body">
                <span className="offer-name">
                  {o.name}
                  {o.badge ? (
                    <span className="offer-badge">{o.badge}</span>
                  ) : null}
                </span>
                <span className="offer-blurb">{o.blurb}</span>
              </span>
              <span className="offer-cta">
                {o.cta ?? "Visit"} <span className="offer-arw">→</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
