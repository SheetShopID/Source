import { NextResponse } from "next/server";
import { db } from "@/firebase/client";
import { ref, get } from "firebase/database";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get("shop");

    if (!shop) {
      console.log("❌ Tidak ada parameter shop");
      return NextResponse.json({ error: "No shop param" }, { status: 400 });
    }

    console.log("📌 Param shop diterima:", shop);

    // Path sesuai struktur kamu: shops/<shop>
    const shopRef = ref(db, `shops/${shop}`);
    const snap = await get(shopRef);

    if (!snap.exists()) {
      console.log("❌ Shop tidak ditemukan:", shop);
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    console.log("✅ Shop ditemukan:", snap.val());
    return NextResponse.json(snap.val());

  } catch (e) {
    console.error("🔥 ERROR API:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
