// Serves /ads.txt.
//
// - Ezoic: set NEXT_PUBLIC_EZOIC_ADSTXT to the Ads.txt Manager URL Ezoic gives
//   you (e.g. "https://srv.adstxtmanager.com/19390/calclumen.com"). We 301 to
//   it so Ezoic keeps the authorized-seller list current for all its partners.
//   NOTE: while this redirect is active, the local lines below are bypassed —
//   add the Awin line inside Ezoic's Ads.txt Manager (it allows custom lines).
// - Otherwise we emit our own authorized-seller lines:
//   - Awin (affiliate): on by default; override the exact line(s) with
//     NEXT_PUBLIC_AWIN_ADSTXT if your Awin dashboard shows extra entries.
//   - AdSense: set NEXT_PUBLIC_ADSENSE_ID (ca-pub-…) to add the Google line.
export const dynamic = "force-static";

// Same Awin publisher line across all our sites. Override via env if the Awin
// dashboard lists additional lines (use "\n"-separated values).
const AWIN_ADSTXT =
  process.env.NEXT_PUBLIC_AWIN_ADSTXT ?? "awin.com, 3044579, DIRECT";

export function GET() {
  const ezoic = process.env.NEXT_PUBLIC_EZOIC_ADSTXT;
  if (ezoic) {
    return new Response(null, {
      status: 301,
      headers: { Location: ezoic },
    });
  }

  const lines: string[] = [];
  if (AWIN_ADSTXT.trim()) lines.push(AWIN_ADSTXT.trim());

  const pub = process.env.NEXT_PUBLIC_ADSENSE_ID; // e.g. "ca-pub-1234567890123456"
  if (pub) lines.push(`google.com, ${pub.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0`);

  const body = lines.length
    ? lines.join("\n") + "\n"
    : "# ads.txt — no authorized sellers configured yet.\n";
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
