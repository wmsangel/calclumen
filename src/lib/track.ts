// Tiny GA4 event helper. Pushes the event into window.dataLayer — the same
// queue gtag.js drains — so an event fired before gtag.js has loaded (e.g.
// `tool_opened` at hydration, which runs before the afterInteractive GA
// script) is not lost. On the server, in dev, on /embed pages or on non-prod
// hosts no GA script ever loads, so the push is inert. Consent Mode still
// applies: in EEA/UK/CH with analytics denied, GA4 sends cookieless pings.
// Never throws.
type Params = Record<string, string | number | boolean | undefined>;

export function track(event: string, params?: Params): void {
  if (typeof window === "undefined") return;
  try {
    const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
    if (typeof w.gtag === "function") {
      w.gtag("event", event, params ?? {});
      return;
    }
    // gtag.js not initialised yet: queue in the exact `arguments`-like shape
    // gtag() itself pushes, so the tag processes it when it loads.
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push(toArguments(["event", event, params ?? {}]));
  } catch {
    /* analytics must never break the UI */
  }
}

/** gtag.js only processes dataLayer entries that are `arguments` objects. */
function toArguments(items: unknown[]): IArguments {
  return (function () {
    return arguments;
  }).apply(null, items as []);
}
