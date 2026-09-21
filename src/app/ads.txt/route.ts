// Serves /ads.txt.
//
// - Ezoic: set NEXT_PUBLIC_EZOIC_ADSTXT to the Ads.txt Manager URL Ezoic gives
//   you (e.g. "https://srv.adstxtmanager.com/19390/calclumen.com"). We 301 to
//   it so Ezoic keeps the authorized-seller list current for all its partners.
//   NOTE: while this redirect is active, the local lines below are bypassed —
//   add any extra authorized-seller lines inside Ezoic's Ads.txt Manager.
// - Otherwise we emit our own authorized-seller lines:
//   - AdSense: ADSENSE_PUB (ca-pub-…) adds the Google authorized-seller line.
import { ADSENSE_PUB } from "@/lib/ads-config";

export const dynamic = "force-static";

export function GET() {
  const ezoic = process.env.NEXT_PUBLIC_EZOIC_ADSTXT;
  if (ezoic) {
    return new Response(null, {
      status: 301,
      headers: { Location: ezoic },
    });
  }

  const lines: string[] = [];

  if (ADSENSE_PUB)
    lines.push(
      `google.com, ${ADSENSE_PUB.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0`,
    );

  const body = lines.length
    ? lines.join("\n") + "\n"
    : "# ads.txt — no authorized sellers configured yet.\n";
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
