/**
 * Click-time token for /go links (client + server). Network standard 27.11.2026
 * (variant B', reference: costtrek 5e142b5): pages render href="#" + data-go; on
 * a trusted press the browser script writes /go/<id>?s=<page>&t=<time>&k=<sig>
 * into the href, and the route refuses anything without a fresh matching
 * signature (TTL 15 min). A stored/replayed URL goes stale within minutes.
 * An obstacle against replay of harvested links, not cryptography — the salt
 * ships in the client bundle.
 */
const SALT = "calclumen/go/v1/c7a2e41d90b3";
export const GO_TOKEN_TTL_S = 900;

function fnv1a(str: string, seed: number): number {
  let h = seed >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export function goSig(id: string, slug: string, t: string): string {
  const s = `${SALT}|${id}|${slug}|${t}`;
  const r = s.split("").reverse().join("");
  return fnv1a(s, 0x811c9dc5).toString(36) + fnv1a(r, 0x9747b28c).toString(36);
}

/** The /go URL for a click happening now. Built in the browser at click time. */
export function goUrl(id: string, slug?: string, nowMs: number = Date.now()): string {
  const t = Math.floor(nowMs / 1000).toString(36);
  const p = new URLSearchParams();
  if (slug) p.set("s", slug);
  p.set("t", t);
  p.set("k", goSig(id, slug ?? "", t));
  return `/go/${encodeURIComponent(id)}?${p.toString()}`;
}

export function goTokenValid(id: string, slug: string, t: string | null, k: string | null, nowMs: number = Date.now()): boolean {
  if (!t || !k || !/^[0-9a-z]{1,12}$/.test(t)) return false;
  const secs = parseInt(t, 36);
  if (!Number.isFinite(secs)) return false;
  if (Math.abs(nowMs / 1000 - secs) > GO_TOKEN_TTL_S) return false;
  return k === goSig(id, slug, t);
}
