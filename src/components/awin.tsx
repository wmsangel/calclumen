import Script from "next/script";

// Awin MasterTag — affiliate conversion tracking. Inactive until you set
// NEXT_PUBLIC_AWIN_MASTERTAG to the numeric MasterTag ID from the Awin
// dashboard (Toolbox → MasterTag). Then, in production, it loads the tag.
// ads.txt verification is separate (see src/app/ads.txt/route.ts) — the
// MasterTag only powers tracking, so afterInteractive is fine.
const ID = process.env.NEXT_PUBLIC_AWIN_MASTERTAG;

export function AwinMasterTag() {
  if (process.env.NODE_ENV !== "production" || !ID) return null;
  return (
    <Script
      id="awin-mastertag"
      strategy="afterInteractive"
      src={`https://www.dwin1.com/${ID}.js`}
    />
  );
}
