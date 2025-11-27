// /middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;
  const host = req.headers.get("host") || "";
  
  // domain utama = tokoinstan.online
  const rootDomain = "tokoinstan.online";

  // pastikan host mengandung subdomain
  const isSubdomain = host.endsWith(rootDomain) && host !== rootDomain;

  if (isSubdomain) {
    const shop = host.replace("." + rootDomain, ""); // ambil subdomain

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-shop", shop);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next();
}
