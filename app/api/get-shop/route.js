import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const shopId = req.headers.get("x-shop-id"); // Header dari middleware
    if (!shopId) return NextResponse.json({ error: "Missing shop id" }, { status: 400 });

    const snapshot = await db.ref(`shops/${shopId}`).once("value");
    const data = snapshot.val();

    if (!data) return NextResponse.json({ error: "Shop not found" }, { status: 404 });

    return NextResponse.json({ shop: data });
  } catch (error) {
    console.error("GET /api/get-shop error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
