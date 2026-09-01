import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n/config";

// Next.js 16: middleware is called "proxy". Same behaviour.
// Ensures every URL carries a locale segment (e.g. "/" -> "/en").
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Only run where a locale still has to be added. Paths that already start
  // with a locale ("/en", "/en/...") are excluded, so the proxy no longer
  // fires (and bills an Edge Request) on the bulk of page + RSC requests —
  // it just needs to catch locale-less paths ("/", "/loan-calculator", …).
  // Also skips API routes, Next internals, and files with an extension.
  // NOTE: `en` is hard-coded because matchers must be static literals — add
  // any new locale here if `src/lib/i18n/config.ts` gains one.
  matcher: ["/((?!en(?:/|$)|api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
