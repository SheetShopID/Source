// middleware.js
import { NextResponse } from "next/server";

/**
 * Middleware untuk menangani multi-subdomain pada domain tokoinstan.online
 * dan menambahkan header keamanan.
 */
export function middleware(req) {
  const host = req.headers.get("host")?.toLowerCase() || "";
  const url = new URL(req.url);

  // 🧩 Deteksi environment (localhost, vercel, production)
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
  if (!sub || sub === "tokoinstan" || sub === "www" || sub === "api") {
    const res = NextResponse.rewrite(new URL("/register", req.url));
    addSecurityHeaders(res);
    return res;
  }

  // 🚧 Filter: hanya domain terdaftar yang boleh di-handle
  if (!isLocalhost && !isProduction && !isVercel) {
    const res = NextResponse.json({ error: "Domain tidak dikenal." }, { status: 403 });
    addSecurityHeaders(res);
    return res;
  }

  // 🏷️ Tambahkan header agar bisa digunakan oleh app/page.jsx
  const res = NextResponse.next();
  res.headers.set("x-shop-id", sub);
  res.headers.set("x-shop-origin", host);

  // 🔒 Tambahkan security headers
  addSecurityHeaders(res);

  // 🪵 Logging untuk development
  if (process.env.NODE_ENV === "development") {
    console.log("[MIDDLEWARE]", { host, sub });
  }

  return res;
}

/**
 * 🔒 Tambahkan security headers untuk mencegah exploit umum
 */
function addSecurityHeaders(res) {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  // ✅ Izinkan fetch dan image dari domain eksternal yang diperlukan
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self';",
      "connect-src 'self' https://docs.google.com https://firebasestorage.googleapis.com;",
      "img-src 'self' data: https://*;",
      "style-src 'self' 'unsafe-inline';",
      "script-src 'self' 'unsafe-inline';",
    ].join(" ")
  );
  return res;
}

/**
 * Jalankan middleware untuk semua route kecuali API dan aset statis.
 */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
};
