import { NextResponse } from "next/server";

export function middleware(req) {
  const host = req.headers.get("host") || "";
  const subdomain = host.split(".")[0];

  if (subdomain === "tokoinstan" || subdomain === "www") {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  res.headers.set("x-shop-id", subdomain);
  return res;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
