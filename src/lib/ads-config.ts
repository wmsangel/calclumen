// Google AdSense publisher ID. This is a PUBLIC value — it appears in the
// on-page ad script and in /ads.txt — so it's safe to keep in code. An env
// var (NEXT_PUBLIC_ADSENSE_ID in Vercel) still overrides it per environment.
export const ADSENSE_PUB =
  process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-5535516142831006";
