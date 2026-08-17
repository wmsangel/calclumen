import Script from "next/script";

// Google AdSense loader. Inactive until you set NEXT_PUBLIC_ADSENSE_ID
// (e.g. "ca-pub-1234567890123456") in Vercel — then it loads in production
// and the site is ready for AdSense review / Auto ads.
const PUB = process.env.NEXT_PUBLIC_ADSENSE_ID;

export function AdSense() {
  if (process.env.NODE_ENV !== "production" || !PUB) return null;
  return (
    <Script
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUB}`}
    />
  );
}
