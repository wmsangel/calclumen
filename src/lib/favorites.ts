// Client-side personalization: favorite calculators + local usage stats.
// Everything lives in localStorage (no account, no server) and is guarded so
// it is safe to call in any environment.

const FAV_KEY = "ec-favorites";
const RECENT_KEY = "ec-recent";
export const FAV_EVENT = "ec-fav-change";

type RecentMap = Record<string, { count: number; last: number }>;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(FAV_EVENT));
  } catch {
    /* private mode / quota — ignore */
  }
}

// ── Favorites ────────────────────────────────────────────────────
export function getFavorites(): string[] {
  return read<string[]>(FAV_KEY, []);
}

export function isFavorite(slug: string): boolean {
  return getFavorites().includes(slug);
}

export function toggleFavorite(slug: string): boolean {
  const favs = getFavorites();
  const next = favs.includes(slug)
    ? favs.filter((s) => s !== slug)
    : [slug, ...favs];
  write(FAV_KEY, next);
  return next.includes(slug);
}

// ── Usage stats ──────────────────────────────────────────────────
export function recordVisit(slug: string) {
  const map = read<RecentMap>(RECENT_KEY, {});
  const entry = map[slug] ?? { count: 0, last: 0 };
  map[slug] = { count: entry.count + 1, last: Date.now() };
  write(RECENT_KEY, map);
}

/** Slugs ordered by most recently used. */
export function getRecent(limit = 6): string[] {
  const map = read<RecentMap>(RECENT_KEY, {});
  return Object.entries(map)
    .sort((a, b) => b[1].last - a[1].last)
    .slice(0, limit)
    .map(([slug]) => slug);
}

/** Slugs ordered by how often you've used them. */
export function getMostUsed(limit = 6): { slug: string; count: number }[] {
  const map = read<RecentMap>(RECENT_KEY, {});
  return Object.entries(map)
    .filter(([, v]) => v.count > 1)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, limit)
    .map(([slug, v]) => ({ slug, count: v.count }));
}
