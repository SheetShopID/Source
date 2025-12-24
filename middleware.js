import { NextResponse } from "next/server";

export function middleware(req) {
  const host = req.headers.get("host") || "";
  const parts = host.split(".");
  const sub = parts[0];

  if (sub === "tokoinstan" || sub === "www") {
    return NextResponse.rewrite(new URL("/register", req.url));
  }

  // rewrite GET /shop → /api/get-shop?shopId=sub
  const url = req.nextUrl.clone();
  url.searchParams.set("shopId", sub);
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
