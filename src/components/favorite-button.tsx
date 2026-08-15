"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { FAV_EVENT, isFavorite, recordVisit, toggleFavorite } from "@/lib/favorites";

/**
 * Star toggle for a calculator page. Also records a visit on mount so the
 * "recently used" / "most used" home sections stay up to date.
 */
export function FavoriteButton({ slug }: { slug: string }) {
  const [fav, setFav] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFav(isFavorite(slug));
    recordVisit(slug);
    const sync = () => setFav(isFavorite(slug));
    window.addEventListener(FAV_EVENT, sync);
    return () => window.removeEventListener(FAV_EVENT, sync);
  }, [slug]);

  return (
    <button
      type="button"
      onClick={() => setFav(toggleFavorite(slug))}
      aria-pressed={fav}
      aria-label={fav ? "Remove from favorites" : "Save to favorites"}
      title={fav ? "Saved" : "Save to favorites"}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--rule-strong)] bg-[var(--paper-2)] px-3 py-2 text-sm font-medium hover:border-[var(--accent)] transition-colors"
      style={{ visibility: mounted ? "visible" : "hidden" }}
    >
      <Star
        size={16}
        className={fav ? "text-[var(--accent)]" : "text-[var(--ink-soft)]"}
        fill={fav ? "currentColor" : "none"}
        strokeWidth={2}
      />
      <span className={fav ? "text-[var(--accent)]" : "text-[var(--ink-soft)]"}>
        {fav ? "Saved" : "Save"}
      </span>
    </button>
  );
}
