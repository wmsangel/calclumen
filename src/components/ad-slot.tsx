import { HouseAd } from "./house-ad";

// Ad slot. Until AdSense is approved, these positions show cross-promotion
// for our own network (see @/lib/house-ads). When real ads are ready, swap
// <HouseAd/> here for the AdSense <ins> unit and it propagates everywhere.
export function AdSlot({ className = "" }: { label?: string; className?: string }) {
  return <HouseAd className={className} />;
}
