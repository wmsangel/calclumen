// Per-page sub-id on every affiliate link (network rule): value is
// <domain>-<place>, e.g. calclumen-loan-calculator. Each network has its own
// parameter name; appended server-side in /go, never written into HTML.
import type { Offer } from "./offers";

export const SUBID_PARAM: Record<Offer["network"], string | null> = {
  indoleads: "p1",
  admitad: "subid",
  cj: "sid",
  hasoffers: "aff_sub",
  amazon: "ascsubtag",
  house: null,
};

/** calclumen-<page slug>, slug chars only, max 64 (CJ limit). */
export function subIdValue(place?: string): string {
  const v = (place ?? "home").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 52);
  return `calclumen-${v || "home"}`;
}

export function withSubId(url: string, network: Offer["network"], place?: string): string {
  const param = SUBID_PARAM[network];
  if (!param) return url;
  try {
    const u = new URL(url);
    if (!u.searchParams.has(param)) u.searchParams.set(param, subIdValue(place));
    return u.toString();
  } catch {
    return url;
  }
}
