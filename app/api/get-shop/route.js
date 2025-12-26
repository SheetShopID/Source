import { NextResponse } from "next/server";
import { parseCSV, convertSheetToCSVUrl } from "@/lib/csv";

const BASE_FIREBASE_URL = "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";
const cache = {}; // cache in-memory 1 menit

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get("shop");

    if (!shop) {
      return NextResponse.json({ error: "Parameter 'shop' wajib diisi." }, { status: 400 });
    }

    const now = Date.now();
    if (cache[shop] && now - cache[shop].timestamp < 1000 * 60 * 1) {
      return NextResponse.json(cache[shop].data, { status: 200 });
    }

    // 🔹 Ambil metadata toko dari Firebase
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

    const shopData = await res.json();
    if (!shopData) {
      return NextResponse.json({ error: "Toko tidak ditemukan." }, { status: 404 });
    }

    // 🔹 Pastikan ada sheetUrl
    if (!shopData.sheetUrl) {
      return NextResponse.json({ shop: shopData, products: [] }, { status: 200 });
    }

    // 🔹 Ambil CSV dari Google Sheet
    const csvUrl = convertSheetToCSVUrl(shopData.sheetUrl);
    const csvRes = await fetch(csvUrl, { cache: "no-store" });
    if (!csvRes.ok) throw new Error("Gagal mengambil data produk dari Google Sheet");

    const csvText = await csvRes.text();
    const parsed = parseCSV(csvText);

    // 🔹 Parse di server → langsung format JSON siap render
    const products = parsed.map((p) => ({
      name: p.name,
      price: Number(p.price) || 0,
      img: p.img || "",
      fee: Number(p.fee) || 0,
      category: p.category || "",
      promo: p.promo || "",
      shopName: p.shop || shopData.name,
      estimasi: p.estimasi || 0,      
    }));

    const data = { shop: shopData, products };

    // 🔹 Simpan ke cache (in-memory 1 menit)
    cache[shop] = { timestamp: now, data };

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
