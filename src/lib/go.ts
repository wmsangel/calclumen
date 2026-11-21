// /go/<slug> affiliate cloak: destination map + the human-gesture gate.
//
// Gate (network rule 2026-11-20, confirmed on pawdget/testsweep/prodom): bots,
// prefetchers and link scanners get 204 and never reach the network, so click
// counts stop being inflated (costtrek: ~500 bot clicks/day, 0 conversions).
// Real navigations from modern browsers carry Sec-Fetch-Mode: navigate and
// Sec-Fetch-User: ?1 (Chrome 76+, Firefox 90+, Safari 16.4+ and every iOS
// browser on WebKit). Older browsers that predate Sec-Fetch-* get a soft pass
// only with a Referer.
import { AMAZON_GO_REDIRECTS } from "./amazon";

export const KEEPER_TRACKING = "https://keepertax.go2cloud.org/aff_c?offer_id=25&aff_id=2191";

/** Where /go/<slug> points; `label` = the page slug from ?src= (sub-id). */
export function goDestination(slug: string, label: string | null): string | null {
  const sub = label && /^[a-z0-9-]{1,64}$/.test(label) ? label : null;
  if (slug === "keeper") return sub ? `${KEEPER_TRACKING}&aff_sub=calclumen-${sub}` : KEEPER_TRACKING;
  const hit = AMAZON_GO_REDIRECTS.find((r) => r.slug === slug);
  if (!hit) return null;
  return sub ? `${hit.url}&ascsubtag=calclumen-${sub}` : hit.url;
}

export type GateVerdict =
  | { pass: true; reason: "gesture" | "legacy-referer" }
  | { pass: false; reason: "bot-ua" | "prefetch" | "not-navigate" | "ua-mismatch" | "no-user-gesture" | "no-referer" };

const BOT_UA = /bot|crawl|spider|slurp|fetch|curl|wget|python|httpclient|headless|preview|scan|monitor|facebookexternalhit|whatsapp|telegram|discord|slack|embedly|lighthouse|pingdom|uptime/i;

function version(ua: string, token: RegExp): number | null {
  const m = ua.match(token);
  return m ? parseInt(m[1], 10) : null;
}

/** Does this UA belong to a browser that always sends Sec-Fetch-User on real clicks? */
function supportsSecFetchUser(ua: string): boolean {
  const crios = version(ua, /CriOS\/(\d+)/);
  const fxios = version(ua, /FxiOS\/(\d+)/);
  if (crios !== null || fxios !== null || /iPhone|iPad/.test(ua)) {
    const v = version(ua, /Version\/(\d+)(?:\.(\d+))?/);
    // iOS WebKit: Safari 16.4+ → yes; unknown → assume modern.
    return v === null ? true : v > 16 || (v === 16 && /Version\/16\.[4-9]/.test(ua));
  }
  const chrome = version(ua, /(?:Chrome|CriOS|Edg|OPR)\/(\d+)/);
  if (chrome !== null) return chrome >= 76;
  const firefox = version(ua, /Firefox\/(\d+)/);
  if (firefox !== null) return firefox >= 90;
  if (/Safari\//.test(ua)) {
    const v = ua.match(/Version\/(\d+)\.(\d+)/);
    if (!v) return true;
    const major = +v[1], minor = +v[2];
    return major > 16 || (major === 16 && minor >= 4);
  }
  return false; // unknown engines → legacy path
}

export function gate(h: { get(name: string): string | null }): GateVerdict {
  const ua = h.get("user-agent") ?? "";
  if (!ua || BOT_UA.test(ua)) return { pass: false, reason: "bot-ua" };
  const purpose = (h.get("sec-purpose") ?? h.get("purpose") ?? "").toLowerCase();
  if (purpose.includes("prefetch") || purpose.includes("prerender")) return { pass: false, reason: "prefetch" };
  const mode = h.get("sec-fetch-mode");
  const user = h.get("sec-fetch-user");
  const dest = h.get("sec-fetch-dest");
  const hasSecFetch = mode !== null || user !== null || dest !== null || h.get("sec-fetch-site") !== null;
  if (mode !== null && mode !== "navigate") return { pass: false, reason: "not-navigate" };
  if (supportsSecFetchUser(ua)) {
    if (!hasSecFetch) return { pass: false, reason: "ua-mismatch" };
    if (user !== "?1") return { pass: false, reason: "no-user-gesture" };
    return { pass: true, reason: "gesture" };
  }
  // Legacy browser: no Sec-Fetch-* support — accept only with a Referer.
  if (h.get("referer")) return { pass: true, reason: "legacy-referer" };
  return { pass: false, reason: "no-referer" };
}
