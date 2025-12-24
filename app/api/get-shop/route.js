import { NextResponse } from "next/server";

export const runtime = "nodejs"; // WAJIB
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get("shop");

    if (!shop) {
      return NextResponse.json(
        { error: "Missing shop parameter" },
        { status: 400 }
      );
    }

    const url = `${process.env.FIREBASE_DATABASE_URL}/shops/${shop}.json`;

    // ⏱️ Tambahkan timeout agar tidak menggantung
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Firebase" },
        { status: 500 }
      );
    }

    const data = await res.json();

    if (!data) {
      return NextResponse.json(
        { error: "Shop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);

  } catch (err) {
    console.error("[GET SHOP ERROR]", err);

    return NextResponse.json(
      { error: "Server timeout or internal error" },
      { status: 500 }
    );
  }
}
