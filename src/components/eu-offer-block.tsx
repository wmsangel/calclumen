"use client";

import { useEffect, useState } from "react";
import type { CalcDef } from "@/lib/calculators/registry";
import { euOffersForCalc } from "@/lib/offers";
import { OfferPanel } from "./offer-panel";

/**
 * True when the visitor looks European, from their browser timezone. This is
 * a static-friendly geo signal: no request headers, no network call and no
 * cookies, so the page stays prerendered and CDN-cached. Timezone (rather
 * than language) is used because a European in any UI language still has a
 * `Europe/*` zone. Falls back to false (hide the offer) on any error.
 */
function isEuropeanVisitor(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    // Mainland/UK Europe, plus European-owned Atlantic islands that carry
    // their own IANA zones (Canary/Madeira/Azores/Faroe).
    return (
      tz.startsWith("Europe/") ||
      tz === "Atlantic/Canary" ||
      tz === "Atlantic/Madeira" ||
      tz === "Atlantic/Azores" ||
      tz === "Atlantic/Faroe"
    );
  } catch {
    return false;
  }
}

/**
 * Renders an EU-only affiliate offer (e.g. BLUETTI) but only to European
 * visitors. The check runs after mount, so the offer is absent from the
 * static HTML and appears for EU visitors on the client — non-EU visitors
 * (US/UK-of-scope aside, our US/CA/AU traffic) never see it.
 */
export function EuOfferBlock({ calc }: { calc: CalcDef }) {
  const [isEu, setIsEu] = useState(false);
  useEffect(() => {
    setIsEu(isEuropeanVisitor());
  }, []);

  if (!isEu) return null;
  const group = euOffersForCalc(calc);
  if (!group || group.offers.length === 0) return null;

  return <OfferPanel group={group} />;
}
