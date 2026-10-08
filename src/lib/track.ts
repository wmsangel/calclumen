// Tiny GA4 event helper. Calls the global gtag() that <GoogleAnalytics/> sets up
// (dataLayer + consent mode). Safe no-op when gtag isn't present — on the server,
// in dev (GA only loads in production), inside /embed pages (GA is intentionally
// not loaded there), or before the script has initialised. Consent Mode still
// applies: with analytics denied, GA4 sends cookieless pings, so this stays
// GDPR-friendly. Never throws.
type Params = Record<string, string | number | boolean | undefined>;

export function track(event: string, params?: Params): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  try {
    gtag("event", event, params ?? {});
  } catch {
    /* analytics must never break the UI */
  }
}
