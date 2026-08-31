import { Sparkles } from "lucide-react";
import type { CalcDef } from "@/lib/calculators/registry";
import { offersForCalc } from "@/lib/offers";
import { OfferLogo } from "./offer-logo";

/**
 * Intent-matched affiliate recommendations for a calculator. Renders nothing
 * unless the calculator's cluster has offers, so it's safe while empty.
 * Links are rel="sponsored nofollow" and the block carries an FTC disclosure.
 */
export function AffiliateBlock({ calc }: { calc: CalcDef }) {
  const group = offersForCalc(calc);
  if (!group || group.offers.length === 0) return null;

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
              <span className="offer-cta">{o.cta ?? "Visit"} →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
