import Script from "next/script";

// Google Analytics 4 with Consent Mode v2 (GDPR-friendly, region-scoped).
// EEA/UK/CH default to "denied" until "Accept all"; elsewhere "granted" until
// "Reject non-essential" (see @/lib/consent and the privacy page).
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-JY9FBM2921";

// GA — including the gtag.js network request — must fire ONLY on the live
// domain, never on the *.workers.dev mirror, a Vercel preview alias or local
// dev. NODE_ENV is not enough: production aliases pass it too (privacy audit
// 2026-10-31). So we gate on location.hostname at runtime and inject gtag.js
// from inside the guard. (The workers.dev mirror itself is also disabled via
// workers_dev:false in wrangler.jsonc — this is defence in depth.)
const PROD_HOSTS = ["calclumen.com", "www.calclumen.com"];

// Regions where storage must stay denied until the visitor opts in:
// EEA (27) + Iceland/Liechtenstein/Norway + UK + Switzerland.
const CONSENT_REGIONS = [
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE",
  "IS","LI","NO","GB","CH",
];

export function GoogleAnalytics() {
  // Skip entirely in local dev so it never pollutes the GA property.
  if (process.env.NODE_ENV !== "production" || !GA_ID) return null;

  const init = `
(function(){
  if (${JSON.stringify(PROD_HOSTS)}.indexOf(location.hostname) === -1) return;
  window.dataLayer=window.dataLayer||[];
  function gtag(){dataLayer.push(arguments);}
  window.gtag=gtag;
  // Consent Mode v2, region-scoped (the privacy page describes exactly this):
  // EEA + UK + Switzerland default to DENIED until the banner is accepted;
  // everywhere else analytics/ads default to GRANTED (US/CA/AU — our audience)
  // and the banner's "Reject non-essential" switches them off. A global
  // "denied" default (used until 2026-11-17) meant ~99% of sessions were
  // unconsented cookieless pings, which GA4 drops from standard reports at
  // our volume (behavioural modelling needs ~1k consented events/day) —
  // hence "1 session per 14 days" against ~380 real visits.
  var CONSENT_REGIONS=${JSON.stringify(CONSENT_REGIONS)};
  gtag('consent','default',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',wait_for_update:500});
  gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',region:CONSENT_REGIONS,wait_for_update:500});
  try{
    var c=localStorage.getItem('ec-consent');
    if(c==='all'){gtag('consent','update',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});}
    else if(c==='essential'){gtag('consent','update',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});}
  }catch(e){}
  gtag('js',new Date());
  gtag('config','${GA_ID}');
  var s=document.createElement('script');
  s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';
  document.head.appendChild(s);
})();
`.trim();

  return (
    <Script id="ga-consent-init" strategy="afterInteractive">
      {init}
    </Script>
  );
}
