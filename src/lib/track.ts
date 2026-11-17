// Tiny GA4 event helper. Calls the global gtag() that <GoogleAnalytics/> sets
// up (dataLayer + consent mode). If gtag isn't initialised yet — e.g.
// `tool_opened` fires at hydration, before the afterInteractive GA script has
// run — the call is retried every 250 ms for up to 5 s instead of being queued
// raw in dataLayer (events queued before `config` are dropped by gtag.js).
// Safe no-op on the server, in dev, on /embed pages and on non-prod hosts (no
// GA ever loads there, so the retries simply expire). Consent Mode applies:
// in EEA/UK/CH with analytics denied GA4 sends cookieless pings. Never throws.
type Params = Record<string, string | number | boolean | undefined>;

const RETRY_MS = 250;
const MAX_TRIES = 20;

export function track(event: string, params?: Params): void {
  if (typeof window === "undefined") return;
  const payload = params ?? {};
  let tries = 0;
  const fire = () => {
    try {
      const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
      if (typeof gtag === "function") {
        gtag("event", event, payload);
        return;
      }
      if (++tries < MAX_TRIES) setTimeout(fire, RETRY_MS);
    } catch {
      /* analytics must never break the UI */
    }
  };
  fire();
}
