import { NextResponse } from "next/server";
import { db } from "@/firebase/client";
import { ref, get } from "firebase/database";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get("shop");

    if (!shop)
      return NextResponse.json({ error: "No shop param" }, { status: 400 });

    console.log("📌 Request shop:", shop);

    const shopRef = ref(db, `shops/${shop}`);
    const snap = await get(shopRef);

    if (!snap.exists()) {
      console.log("❌ Shop not found:", shop);
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    console.log("✅ Found:", snap.val());

    return NextResponse.json(snap.val());
  } catch (e) {
    console.error("🔥 Firebase error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
