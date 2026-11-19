// Per-page sub-id on every affiliate link (network rule, 2026-11-16): the
// affiliate accounts are shared across the whole network, so without a label
// the network's report cannot say which site and which page sent the click.
// Each network has its own parameter name; the value is the page slug.
import type { Offer } from "./offers";

const PARAM: Record<Offer["network"], string | null> = {
  indoleads: "p1",
  admitad: "subid",
  cj: "sid",
  amazon: null, // handled by /go/?src= → ascsubtag in next.config redirects
  house: null,
};

/** Shortest safe label: slug chars only, max 64 (CJ limit; fine for the rest). */
export function subIdValue(tool?: string): string {
  const v = (tool ?? "home").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 64);
  return v || "home";
}

export function withSubId(url: string, network: Offer["network"], tool?: string): string {
  const param = PARAM[network];
  if (!param) return url;
  try {
    const u = new URL(url);
    if (!u.searchParams.has(param)) u.searchParams.set(param, subIdValue(tool));
    return u.toString();
  } catch {
    return url;
  }
}
