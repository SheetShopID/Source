import { NextResponse } from "next/server";

const BASE_FIREBASE_URL = "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get("shop");

    if (!shop) {
      return NextResponse.json(
        { error: "Parameter 'shop' wajib diisi." },
        { status: 400 }
      );
    }

    const firebaseUrl = `${BASE_FIREBASE_URL}/shops/${encodeURIComponent(shop)}.json`;

    const res = await fetch(firebaseUrl, {
      method: "GET",
      cache: "no-store",
      headers: { "Cache-Control": "no-store" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Gagal mengambil data dari Firebase." },
        { status: res.status }
      );
    }

    let data = null;
    try {
      data = await res.json();
    } catch {
      return NextResponse.json(
        { error: "Respon Firebase tidak valid." },
        { status: 502 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Toko tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });

  } catch (err) {
    console.error("[API GET-SHOP]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
