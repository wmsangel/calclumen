// Google Consent Mode v2 helper. The banner calls this when the visitor
// accepts or rejects; it pushes a consent "update" that GA/Ads respect.
type Grant = "granted" | "denied";

interface Gtag {
  (...args: unknown[]): void;
}

export function updateConsent(granted: boolean) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: Gtag };
  w.dataLayer = w.dataLayer || [];
  const gtag: Gtag = w.gtag ?? ((...args: unknown[]) => w.dataLayer!.push(args));
  const value: Grant = granted ? "granted" : "denied";
  gtag("consent", "update", {
    analytics_storage: value,
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  });
}
