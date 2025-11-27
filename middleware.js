import { NextResponse } from "next/server";

export function middleware(req) {
  const host = req.headers.get("host") || "";
  const parts = host.split(".");
  const sub = parts[0];

  if (sub === "tokoinstan" || sub === "www") {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  res.headers.set("x-shop-id", sub);
  return res;
}
