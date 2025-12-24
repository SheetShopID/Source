// app/api/get-shop/route.js
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get("shop");

    if (!shop) {
      return NextResponse.json({ error: "No shop param" }, { status: 400 });
    }

    const url = `https://tokoinstan-3e6d5-default-rtdb.firebaseio.com/shops/${shop}.json`;

    const res = await fetch(url, { cache: "no-store" }); // Hindari cache

    if (!res.ok) {
      return NextResponse.json({ error: "Firebase error" }, { status: res.status });
    }

    const data = await res.json();

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
