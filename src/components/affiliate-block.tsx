import type { CalcDef } from "@/lib/calculators/registry";
import { offersForCalc } from "@/lib/offers";
import { OfferPanel } from "./offer-panel";

/**
 * Intent-matched affiliate recommendations for a calculator. Renders nothing
 * unless the calculator's cluster has offers, so it's safe while empty.
 * Links are rel="sponsored nofollow" and the block carries an FTC disclosure.
 */
export function AffiliateBlock({ calc }: { calc: CalcDef }) {
  const group = offersForCalc(calc);
  if (!group || group.offers.length === 0) return null;
  return <OfferPanel group={group} />;
}
