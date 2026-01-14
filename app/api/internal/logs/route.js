// app/api/internal/logs/route.js
import { NextResponse } from "next/server";

const FIREBASE_BASE =
  "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";
const ALLOWED_LEVELS = ["info", "warn", "error"];

// POST → create log
export async function POST(req) {
  try {
    const body = await req.json();
    const level = ALLOWED_LEVELS.includes(body.level) ? body.level : "info";

    const payload = {
      ts: new Date().toISOString(),
      level,
      label: body.label || "UNKNOWN",
      data: body.data || {},
      requestId: body.requestId || crypto.randomUUID(),
      source: body.source || "api",
    };

    const res = await fetch(`${FIREBASE_BASE}/logs.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Firebase write failed");

    return NextResponse.json({ ok: true, payload });
  } catch (err) {
    console.error("[LOG POST ERROR]", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// GET → read logs
export async function GET() {
  try {
    const res = await fetch(`${FIREBASE_BASE}/logs.json`);
    if (!res.ok) throw new Error("Firebase read failed");

    const data = await res.json();
    // convert object to array and sort descending by timestamp
    const logs = Object.values(data || {}).sort(
      (a, b) => new Date(b.ts) - new Date(a.ts)
    );

    return NextResponse.json(logs);
  } catch (err) {
    console.error("[LOG GET ERROR]", err);
    return NextResponse.json([], { status: 500 });
  }
}
