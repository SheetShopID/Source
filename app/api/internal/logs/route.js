import { NextResponse } from "next/server";

const FIREBASE_BASE = process.env.FIREBASE_BASE;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get("shop");

  if (!shop) {
    return NextResponse.json({ ok: false, error: "Shop wajib diisi" });
  }

  const res = await fetch(`${FIREBASE_BASE}/logs.json`);
  const data = await res.json();

  const logs = Object.values(data || {}).filter(
    (l) => l.data?.subdomain === shop || l.data?.shop === shop
  );

  return NextResponse.json({
    ok: true,
    count: logs.length,
    logs,
  });
}
