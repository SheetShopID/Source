// middleware.js
import { NextResponse } from "next/server";

/**
 * Middleware Tokoinstan
 * - Multi-subdomain handling
 * - Internal tools protection
 * - Security headers
 */
export function middleware(req) {
  const host = req.headers.get("host")?.toLowerCase() || "";
  const url = new URL(req.url);
  const pathname = url.pathname;

  // ==================================================
  // 1️⃣ INTERNAL ROUTE GUARD (Log Inspector, dll)
  // ==================================================
  if (pathname.startsWith("/internal")) {
    const token =
      req.cookies.get("internal_auth")?.value ||
      req.headers.get("x-internal-key");

    if (!process.env.INTERNAL_DASHBOARD_KEY) {
      console.error("[MIDDLEWARE] INTERNAL_DASHBOARD_KEY belum diset");
      return NextResponse.rewrite(new URL("/404", req.url));
    }

    if (token !== process.env.INTERNAL_DASHBOARD_KEY) {
      return NextResponse.rewrite(new URL("/404", req.url));
    }

    const res = NextResponse.next();
    addSecurityHeaders(res);
    return res;
  }

  // ==================================================
  // 2️⃣ ENV DETECTION
  // ==================================================
  const isLocalhost = host.includes("localhost");
  const isVercel = host.includes("vercel.app");
  const isProduction = host.endsWith("tokoinstan.online");

  // ==================================================
  // 3️⃣ SUBDOMAIN PARSING
  // ==================================================
  const parts = host.split(".");
  let subdomain = null;

  if (isLocalhost) {
    subdomain = parts[0] !== "localhost" ? parts[0] : null;
  } else if (parts.length > 2) {
    subdomain = parts[0];
  }

  // ==================================================
  // 4️⃣ ROOT DOMAIN → /register
  // ==================================================
  if (!subdomain || ["www", "tokoinstan", "api"].includes(subdomain)) {
    const res = NextResponse.rewrite(new URL("/register", req.url));
    addSecurityHeaders(res);
    return res;
  }

  // ==================================================
  // 5️⃣ DOMAIN SAFETY CHECK
  // ==================================================
  if (!isLocalhost && !isProduction && !isVercel) {
    const res = NextResponse.json(
      { error: "Domain tidak dikenal" },
      { status: 403 }
    );
    addSecurityHeaders(res);
    return res;
  }

  // ==================================================
  // 6️⃣ PASS TO SHOP APP
  // ==================================================
  const res = NextResponse.next();
  res.headers.set("x-shop-id", subdomain);
  res.headers.set("x-shop-origin", host);

  addSecurityHeaders(res);

  if (process.env.NODE_ENV === "development") {
    console.log("[MIDDLEWARE]", { host, subdomain, pathname });
  }

  return res;
}

/**
 * 🔒 Security Headers
 */
function addSecurityHeaders(res) {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self';",
      "connect-src 'self' https://tokoinstan.online https://docs.google.com https://*.googleusercontent.com https://firebasestorage.googleapis.com;",
      "img-src 'self' data: https://*;",
      "style-src 'self' 'unsafe-inline';",
      "script-src 'self' 'unsafe-inline';",
    ].join(" ")
  );
}

/**
 * Apply middleware to all pages except API & static
 */
export const config = {
  matcher: [
    "/((?!api/internal|api|_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
};
