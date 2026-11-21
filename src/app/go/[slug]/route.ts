import { NextResponse, type NextRequest } from "next/server";
import { gate, goDestination } from "@/lib/go";

// /go/<slug>?src=<page> — affiliate cloak with a human-gesture gate (see
// src/lib/go.ts). Bots, prefetch and non-gesture requests get 204 (no
// redirect, no network click); real clicks get a 302 to the tagged link.
// Dynamic by design (reads request headers); not prerendered.
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const dest = goDestination(slug, req.nextUrl.searchParams.get("src"));
  if (!dest) return new NextResponse(null, { status: 404, headers: NO_STORE });
  const v = gate(req.headers);
  if (!v.pass) {
    return new NextResponse(null, { status: 204, headers: { ...NO_STORE, "X-Go-Gate": v.reason } });
  }
  return NextResponse.redirect(dest, { status: 302, headers: { ...NO_STORE, "X-Go-Gate": v.reason } });
}
