import { NETWORK_SITES } from "@/lib/network";

/**
 * Cross-promotion for our own sister sites. Uses FOLLOW links (rel="noopener"
 * only, no nofollow) so link equity flows between sites we own — this is
 * reciprocal promotion, not paid advertising, so there's no "Ad" label or
 * sponsored rel.
 */
export function NetworkPromo() {
  if (NETWORK_SITES.length === 0) return null;
  return (
    <section className="py-8 border-t border-[var(--rule)]">
      <h2 className="text-lg font-semibold">From our network</h2>
      <p className="mt-1 text-xs text-[var(--ink-soft)]">
        Other free tools we build.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {NETWORK_SITES.map((s) => (
          <a
            key={s.url}
            href={s.url}
            target="_blank"
            rel="noopener"
            className="offer-card"
          >
            <span className="min-w-0">
              <span className="font-semibold text-sm block">{s.name}</span>
              <span className="mt-0.5 block text-xs text-[var(--ink-soft)] leading-snug line-clamp-2">
                {s.blurb}
              </span>
            </span>
            <span className="offer-cta">{s.cta ?? "Visit"} →</span>
          </a>
        ))}
      </div>
    </section>
  );
}
