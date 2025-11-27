import { NextResponse } from "next/server";

export function middleware(req) {
  const host = req.headers.get("host") || "";

  // subdomain = bagian sebelum domain utama
  const parts = host.split(".");
  const sub = parts[0];

  // subdomain utama, tampilkan landing
  if (sub === "tokoinstan" || sub === "www") {
    return NextResponse.next();
  }

  // Kirim subdomain ke Next.js (header)
  const res = NextResponse.next();
  res.headers.set("x-shop-id", sub);

  return res;
}
