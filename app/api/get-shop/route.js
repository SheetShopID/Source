import { NextResponse } from "next/server";
import shops from "@/data/shops.json"; // path harus benar

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const shopName = searchParams.get("shop");

    console.log("📌 Incoming shop request:", shopName);
    console.log("📌 Available shops:", Object.keys(shops));

    if (!shopName) {
      return NextResponse.json({ error: "Missing shop parameter" }, { status: 400 });
    }

    const shopData = shops[shopName];

    if (!shopData) {
      console.log("❌ Shop not found:", shopName);
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    console.log("✅ Shop found:", shopData);

    return NextResponse.json(shopData, { status: 200 });

  } catch (error) {
    console.error("🔥 Route error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
