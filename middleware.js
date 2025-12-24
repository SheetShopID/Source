import { NextResponse } from "next/server";

export function middleware(req) {
  const host = req.headers.get("host") || "";
  const parts = host.split(".");
  const sub = parts[0];

  // DOMAIN UTAMA → REGISTER
  if (sub === "tokoinstan" || sub === "www") {
    return NextResponse.rewrite(new URL("/register", req.url));
  }

  // SUBDOMAIN → rewrite ke API dengan query param shopId
  const url = req.nextUrl.clone();
  if (!req.nextUrl.pathname.startsWith("/api/")) {
    url.pathname = `/api${req.nextUrl.pathname}`; // redirect ke api
    url.searchParams.set("shopId", sub);        // inject subdomain
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
