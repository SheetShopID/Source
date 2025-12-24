// middleware.js
import { NextResponse } from "next/server";

/**
 * Middleware untuk menangani multi-subdomain pada domain tokoinstan.online
 * dan mengarahkan domain utama ke halaman register.
 */
export function middleware(req) {
  const host = req.headers.get("host")?.toLowerCase() || "";
  const url = new URL(req.url);

  // 🧩 Deteksi environment (misalnya: localhost, vercel, production)
  const isLocalhost = host.includes("localhost");
  const isVercel = host.includes("vercel.app");
  const isProduction = host.includes("tokoinstan.online");

  // 🧠 Ambil subdomain (contoh: jastip dari jastip.tokoinstan.online)
  const parts = host.split(".");
  const sub = isLocalhost
    ? parts[0] === "localhost" ? null : parts[0]
    : parts.length > 2
    ? parts[0]
    : parts[0] === "www"
    ? null
    : parts[0];

  // 🌐 Jika domain utama → arahkan ke halaman /register
  if (
    !sub ||
    sub === "tokoinstan" ||
    sub === "www" ||
    sub === "api"
  ) {
    return NextResponse.rewrite(new URL("/register", req.url));
  }

  // 🚧 Filter: Hanya domain utama yang boleh di-handle
  if (!isLocalhost && !isProduction && !isVercel) {
    return NextResponse.json(
      { error: "Domain tidak dikenal." },
      { status: 403 }
    );
  }

  // 🏷️ Tambahkan header agar bisa digunakan oleh app/page.jsx
  const res = NextResponse.next();
  res.headers.set("x-shop-id", sub);
  res.headers.set("x-shop-origin", host);

  // 🪵 Logging untuk development
  if (process.env.NODE_ENV === "development") {
    console.log("[MIDDLEWARE]", { host, sub });
  }

  return res;
}

/**
 * Jalankan middleware untuk semua route kecuali API dan aset statis.
 */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
