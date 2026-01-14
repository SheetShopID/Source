import { NextResponse } from "next/server";
import { applySecurityHeaders } from "@/lib/security";

export function middleware(req) {
  const host = req.headers.get("host") || "";
  const parts = host.split(".");
  const isLocalhost = host.includes("localhost");

  const subdomain = isLocalhost
    ? parts[0] === "localhost" ? null : parts[0]
    : parts.length > 2 ? parts[0] : null;

  if (!subdomain || subdomain === "www") {
    const res = NextResponse.rewrite(new URL("/register", req.url));
    return applySecurityHeaders(res);
  }

  const res = NextResponse.next();
  res.headers.set("x-shop-id", subdomain);
  res.headers.set("x-shop-origin", host);

  return applySecurityHeaders(res);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
};
