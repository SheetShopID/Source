import { NextResponse } from "next/server";

const FIREBASE_BASE =
  "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const subdomain = searchParams.get("subdomain");

  if (!subdomain) {
    return NextResponse.json({ error: "No subdomain" }, { status: 400 });
  }

  const res = await fetch(
    `${FIREBASE_BASE}/shops/${subdomain}.json`,
    { cache: "no-store" }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
