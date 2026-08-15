import Script from "next/script";

// Google Analytics 4 with Consent Mode v2 (GDPR-friendly).
// Everything defaults to "denied"; the cookie banner flips it to "granted"
// only when the visitor clicks "Accept all" (see @/lib/consent).
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-JY9FBM2921";

export function GoogleAnalytics() {
  // Only load in production so local dev doesn't pollute the GA property.
  if (process.env.NODE_ENV !== "production" || !GA_ID) return null;

  const init = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
try{if(localStorage.getItem('ec-consent')==='all'){gtag('consent','update',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});}}catch(e){}
gtag('js',new Date());
gtag('config','${GA_ID}');
`.trim();

  return (
    <>
      <Script id="ga-consent-init" strategy="afterInteractive">
        {init}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
