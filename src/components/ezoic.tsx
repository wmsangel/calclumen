import Script from "next/script";

// Ezoic loader (JavaScript / "standalone" integration — the right choice on
// Vercel, where we don't want to hand DNS to Ezoic's nameservers).
//
// Inactive until you set NEXT_PUBLIC_EZOIC=1 in Vercel. Then, in production,
// it loads Ezoic's sa.min.js and initialises the ezstandalone queue so ad
// placeholders (see <EzoicSlot/>) can render. Turning it on/off is one env
// var + redeploy — same pattern as <AdSense/>.
const ENABLED = process.env.NEXT_PUBLIC_EZOIC;

export function Ezoic() {
  if (process.env.NODE_ENV !== "production" || !ENABLED) return null;
  return (
    <>
      <Script
        id="ezoic-init"
        strategy="beforeInteractive"
      >
        {"window.ezstandalone=window.ezstandalone||{};ezstandalone.cmd=ezstandalone.cmd||[];"}
      </Script>
      <Script
        id="ezoic-sa"
        strategy="afterInteractive"
        src="https://www.ezojs.com/ezoic/sa.min.js"
      />
    </>
  );
}
