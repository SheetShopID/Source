import { NextResponse } from "next/server";

export function middleware(req) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl;
  const mainDomain = "tokoinstan.online";

  // if request is for main domain or vercel preview, continue normally
  if (host === mainDomain || host.endsWith(".vercel.app")) {
    return NextResponse.next();
  }

  // take the left-most label as shop slug
  const parts = host.split(".");
  const shop = parts[0];

  // rewrite to internal shop route
  url.pathname = `/_shop/${shop}`;
  return NextResponse.rewrite(url);
}
