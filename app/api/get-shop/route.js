import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get("shop");

    if (!shop) {
      return NextResponse.json(
        { error: "Shop param wajib" },
        { status: 400 }
      );
    }

    const snapshot = await db.ref(`shops/${shop}`).get();

    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: "Toko tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(snapshot.val());
  } catch (err) {
    console.error("GET SHOP ERROR:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
