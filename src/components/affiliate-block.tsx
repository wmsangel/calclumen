import type { CalcDef } from "@/lib/calculators/registry";
import { offersForCalc } from "@/lib/offers";

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
      <h2 className="text-xl font-semibold">{group.label}</h2>
      <p className="mt-1 text-xs text-[var(--ink-soft)]">
        Some of these are affiliate links — we may earn a commission at no extra
        cost to you.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {group.offers.map((o) => (
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
