// Serves /ads.txt.
//
// - Ezoic: set NEXT_PUBLIC_EZOIC_ADSTXT to the Ads.txt Manager URL Ezoic gives
//   you (e.g. "https://srv.adstxtmanager.com/19390/calclumen.com"). We 301 to
//   it so Ezoic keeps the authorized-seller list current for all its partners.
// - AdSense only (no Ezoic): set NEXT_PUBLIC_ADSENSE_ID (ca-pub-…) and we emit
//   the Google authorized-seller line.
export const dynamic = "force-static";

export function GET() {
  const ezoic = process.env.NEXT_PUBLIC_EZOIC_ADSTXT;
  if (ezoic) {
    return new Response(null, {
      status: 301,
      headers: { Location: ezoic },
    });
  }

  const pub = process.env.NEXT_PUBLIC_ADSENSE_ID; // e.g. "ca-pub-1234567890123456"
  const body = pub
    ? `google.com, ${pub.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`
    : "# ads.txt — set NEXT_PUBLIC_ADSENSE_ID (ca-pub-…) after AdSense approval to activate.\n";
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
