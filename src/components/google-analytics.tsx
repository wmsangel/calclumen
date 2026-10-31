import Script from "next/script";

// Google Analytics 4 with Consent Mode v2 (GDPR-friendly).
// Everything defaults to "denied"; the cookie banner flips it to "granted"
// only when the visitor clicks "Accept all" (see @/lib/consent).
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-JY9FBM2921";

// GA — including the gtag.js network request — must fire ONLY on the live
// domain, never on the *.workers.dev mirror, a Vercel preview alias or local
// dev. NODE_ENV is not enough: production aliases pass it too (privacy audit
// 2026-10-31). So we gate on location.hostname at runtime and inject gtag.js
// from inside the guard. (The workers.dev mirror itself is also disabled via
// workers_dev:false in wrangler.jsonc — this is defence in depth.)
const PROD_HOSTS = ["calclumen.com", "www.calclumen.com"];

export function GoogleAnalytics() {
  // Skip entirely in local dev so it never pollutes the GA property.
  if (process.env.NODE_ENV !== "production" || !GA_ID) return null;

  const init = `
(function(){
  if (${JSON.stringify(PROD_HOSTS)}.indexOf(location.hostname) === -1) return;
  window.dataLayer=window.dataLayer||[];
  function gtag(){dataLayer.push(arguments);}
  window.gtag=gtag;
  gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
  try{if(localStorage.getItem('ec-consent')==='all'){gtag('consent','update',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});}}catch(e){}
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
