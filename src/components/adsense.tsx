import Script from "next/script";
import { ADSENSE_PUB } from "@/lib/ads-config";

// Google AdSense loader. Loads the adsbygoogle.js script (with our publisher
// client) on every page in production — this is what AdSense review / Auto ads
// need. Skipped in dev so we don't load ads locally.
export function AdSense() {
  if (process.env.NODE_ENV !== "production" || !ADSENSE_PUB) return null;
  return (
    <Script
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB}`}
    />
  );
}
