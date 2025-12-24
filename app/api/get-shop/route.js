import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get("shop");

    if (!shop) {
      return NextResponse.json({ error: "No shop param" }, { status: 400 });
    }

    const firebaseUrl = `https://tokoinstan-3e6d5-default-rtdb.firebaseio.com/shops/${shop}.json`;

    const res = await fetch(firebaseUrl, { cache: "no-store" });

    if (!res.ok) {
      return NextResponse.json({ error: "Firebase fetch failed" }, { status: res.status });
    }

    const data = await res.json();

    if (!data) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
