// Serves /ads.txt. Once NEXT_PUBLIC_ADSENSE_ID (ca-pub-…) is set in Vercel,
// this emits the AdSense authorized-seller line automatically.
export const dynamic = "force-static";

export function GET() {
  const pub = process.env.NEXT_PUBLIC_ADSENSE_ID; // e.g. "ca-pub-1234567890123456"
  const body = pub
    ? `google.com, ${pub.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`
    : "# ads.txt — set NEXT_PUBLIC_ADSENSE_ID (ca-pub-…) after AdSense approval to activate.\n";
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
