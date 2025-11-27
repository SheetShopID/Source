import { NextResponse } from "next/server";
import shops from "@/data/shop.json";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get("shop");

    if (!shop)
      return NextResponse.json({ error: "No shop param" }, { status: 400 });

    const data = shops[shop];

    if (!data)
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
