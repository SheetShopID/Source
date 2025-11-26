import { NextResponse } from "next/server";

export function middleware(req) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl;

  const mainDomain = "tokoinstan.online";

  // Jika domain utama → lanjut normal
  if (host === mainDomain || host.endsWith(".vercel.app")) {
    return NextResponse.next();
  }

  // Ambil subdomain (tokoA, tokoB, dll)
  const shop = host.split(".")[0];

  // Rewrite ke folder toko
  url.pathname = `/_shop/${shop}`;

  return NextResponse.rewrite(url);
}
