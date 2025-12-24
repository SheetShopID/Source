import { NextResponse } from "next/server";

export function middleware(req) {
  const host = req.headers.get("host") || "";
  const parts = host.split(".");
  const sub = parts[0];

  // DOMAIN UTAMA → HALAMAN REGISTER
  if (sub === "tokoinstan" || sub === "www") {
    return NextResponse.rewrite(new URL("/register", req.url));
  }

  // SUBDOMAIN TOKO
  const res = NextResponse.next();
  res.headers.set("x-shop-id", sub);
  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ],
};
