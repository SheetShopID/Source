// middleware.js
import { NextResponse } from "next/server";

/**
 * Middleware Tokoinstan
 * - Multi subdomain
 * - Internal route guard
 * - Security headers
 */
export function middleware(req) {
  const host = req.headers.get("host")?.toLowerCase() || "";
  const url = new URL(req.url);

  const isLocalhost = host.includes("localhost");
  const isVercel = host.includes("vercel.app");
  const isProduction = host.includes("tokoinstan.online");

  // =============================
  // SUBDOMAIN PARSING (SAFE)
  // =============================
  const parts = host.split(".");
  const sub = isLocalhost
    ? parts[0] === "localhost"
      ? null
      : parts[0]
    : parts.length > 2
    ? parts[0]
    : parts[0] === "www"
    ? null
    : parts[0];

  // =============================
  // INTERNAL ROUTE GUARD
  // =============================
  if (url.pathname.startsWith("/_internal")) {
    const token =
      req.cookies.get("internal_auth")?.value ||
      req.headers.get("x-internal-key") ||
      url.searchParams.get("key");

    if (token !== process.env.INTERNAL_DASHBOARD_KEY) {
      return NextResponse.rewrite(new URL("/404", req.url));
    }

    const res = NextResponse.next();
    addSecurityHeaders(res);
    return res;
  }

  // =============================
  // ROOT DOMAIN → REGISTER
  // =============================
  if (!sub || sub === "tokoinstan" || sub === "www" || sub === "api") {
    const res = NextResponse.rewrite(new URL("/register", req.url));
    addSecurityHeaders(res);
    return res;
  }

  // =============================
  // DOMAIN FILTER
  // =============================
  if (!isLocalhost && !isProduction && !isVercel) {
    const res = NextResponse.json(
      { error: "Domain tidak dikenal." },
      { status: 403 }
    );
    addSecurityHeaders(res);
    return res;
  }

  // =============================
  // PASS TO APP
  // =============================
  const res = NextResponse.next();
  res.headers.set("x-shop-id", sub);
  res.headers.set("x-shop-origin", host);

  addSecurityHeaders(res);

  // Dev visibility
  if (process.env.NODE_ENV === "development") {
    console.log("[MIDDLEWARE]", {
      host,
      path: url.pathname,
      sub,
    });
  }

  return res;
}

/**
 * Security headers
 */
function addSecurityHeaders(res) {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );
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
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
};
