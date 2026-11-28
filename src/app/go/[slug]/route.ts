import { NextResponse, type NextRequest } from "next/server";
import { gate, goDestination } from "@/lib/go";
import { goTokenValid } from "@/lib/gotoken";

// /go/<id>?s=<page>&t=<time>&k=<sig> — affiliate cloak. Requires a fresh token
// written by the browser script on a trusted click (src/lib/gotoken.ts) AND the
// header gate (src/lib/go.ts). Bare, stale, forged or bot requests → 204; real
// clicks → 302 to the tagged link with the page sub-id. Dynamic, not prerendered.
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug: id } = await ctx.params;
  const q = req.nextUrl.searchParams;
  const page = q.get("s") ?? "";
  const dest = goDestination(id, page || null);
  if (!dest) return new NextResponse(null, { status: 404, headers: NO_STORE });
  if (!goTokenValid(id, page, q.get("t"), q.get("k"))) {
    return new NextResponse(null, { status: 204, headers: { ...NO_STORE, "X-Go-Gate": "no-token" } });
  }
  const v = gate(req.headers);
  if (!v.pass) {
    return new NextResponse(null, { status: 204, headers: { ...NO_STORE, "X-Go-Gate": v.reason } });
  }
  return NextResponse.redirect(dest, { status: 302, headers: { ...NO_STORE, "X-Go-Gate": v.reason } });
}
