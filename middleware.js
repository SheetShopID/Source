// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const host = req.headers.get("host")?.toLowerCase() || "";
  const url = new URL(req.url);

  // =============================
  // 🔐 INTERNAL AUTH (LOGIN-BASED)
  // =============================
  if (url.pathname.startsWith("/_internal")) {
    if (url.pathname.startsWith("/_internal/login")) {
      return NextResponse.next();
    }

    const session = req.cookies.get("admin_session")?.value;
    if (session !== process.env.ADMIN_SESSION_SECRET) {
      return NextResponse.redirect(new URL("/_internal/login", req.url));
    }

    return NextResponse.next();
  }

  // =============================
  // 🌐 SUBDOMAIN HANDLER (AS-IS)
  // =============================
  const isLocalhost = host.includes("localhost");
  const isVercel = host.includes("vercel.app");
  const isProduction = host.includes("tokoinstan.online");

  const parts = host.split(".");
  const sub = isLocalhost
    ? parts[0] === "localhost" ? null : parts[0]
    : parts.length > 2
    ? parts[0]
    : parts[0] === "www"
    ? null
    : parts[0];

  if (!sub || sub === "tokoinstan" || sub === "www" || sub === "api") {
    return NextResponse.rewrite(new URL("/register", req.url));
  }

  if (!isLocalhost && !isProduction && !isVercel) {
    return NextResponse.json({ error: "Domain tidak dikenal" }, { status: 403 });
  }

  const res = NextResponse.next();
  res.headers.set("x-shop-id", sub);
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
