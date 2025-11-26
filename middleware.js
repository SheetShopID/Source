import { NextResponse } from "next/server";

export function middleware(req) {
  const host = req.headers.get("host") || "";
  
  // contoh host: nama.tokoinstan.online
  const shop = host.split(".")[0];

  // abaikan domain utama
  if (shop === "tokoinstan" || shop === "www") {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  res.headers.set("x-shop-id", shop);

  return res;
}
