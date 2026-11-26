import { HouseAd } from "./house-ad";

// Ad slot. Until AdSense is approved this position is empty on inner pages:
// the network cross-promo card (<HouseAd/>) is allowed only on the home page
// (owner decision 24.11 — sitewide blocks linking network domains are a
// link-scheme risk; only / and /about may carry them, nofollow). When real
// ads are ready, swap in the AdSense <ins> unit here and it propagates.
export function AdSlot({ className = "", house = false }: { label?: string; className?: string; house?: boolean }) {
  return house ? <HouseAd className={className} /> : null;
}
