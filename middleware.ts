import { NextResponse, type NextRequest } from "next/server";

const locales = ["id", "en"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;

  const cookie = req.cookies.get("locale")?.value;
  const accept = req.headers.get("accept-language") ?? "";
  const locale =
    cookie && locales.includes(cookie) ? cookie : /^\s*id|,\s*id/i.test(accept) || !/en/i.test(accept) ? "id" : "en";

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|images|cv|favicon.ico|icon|robots.txt|sitemap.xml|.*\\..*).*)"],
};
