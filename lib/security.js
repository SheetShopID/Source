import { NextResponse } from "next/server";

export function applySecurityHeaders(res) {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // HSTS hanya production
  if (process.env.NODE_ENV === "production") {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self';",
      "connect-src 'self' https://*.google.com https://*.googleusercontent.com https://firebasestorage.googleapis.com https://tokoinstan.online;",
      "img-src 'self' data: https://*;",
      "style-src 'self' 'unsafe-inline';",
      "script-src 'self' 'unsafe-inline';",
    ].join(" ")
  );

  return res;
}
