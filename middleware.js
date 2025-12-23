import { NextResponse } from "next/server";

export function middleware(req) {
  const host = req.headers.get("host") || "";
  const parts = host.split(".");
  const sub = parts[0];

  // Jika domain utama → tampilkan homepage
  if (sub === "tokoinstan" || sub === "www") {
    //return NextResponse.next();
    return NextResponse.rewrite(new URL("/register", req.url));
  }

  const res = NextResponse.next();
  res.headers.set("x-shop-id", sub);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
