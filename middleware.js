import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;
  const host = req.headers.get("host") || "";

  const parts = host.split(".");
  const shop = parts[0];

  // Jika domain utama → tampilkan landing (app/page.jsx)
  if (shop === "tokoinstan" || shop === "www") {
    return NextResponse.next();
  }

  // Rewrite subdomain ke dynamic route:
  // bogor.tokoinstan.online → /__shop/bogor
  url.pathname = `/__shop/${shop}`;

  return NextResponse.rewrite(url);
}
