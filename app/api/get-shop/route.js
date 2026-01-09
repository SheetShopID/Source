export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { parseCSV, convertSheetToCSVUrl } from "@/lib/csv";

const FIREBASE_BASE =
  "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";

// cache in-memory (1 menit)
const cache = {};
const CACHE_TTL = 1000 * 60 * 1;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get("shop");

    if (!shop) {
      return NextResponse.json(
        { error: "Parameter 'shop' wajib diisi" },
        { status: 400 }
      );
    }

    const now = Date.now();

    // ==================================================
    // 0️⃣ CACHE CHECK
    // ==================================================
    if (cache[shop] && now - cache[shop].timestamp < CACHE_TTL) {
      return NextResponse.json(cache[shop].data, { status: 200 });
    }

    // ==================================================
    // 1️⃣ AMBIL DATA TOKO DARI FIREBASE
    // ==================================================
    const firebaseUrl = `${FIREBASE_BASE}/shops/${encodeURIComponent(shop)}.json`;
    const fbRes = await fetch(firebaseUrl, {
      cache: "no-store",
      headers: { "Cache-Control": "no-store" },
    });

    if (!fbRes.ok) {
      throw new Error("Gagal mengambil data toko dari Firebase");
    }

    const shopData = await fbRes.json();

    if (!shopData || !shopData.active) {
      return NextResponse.json(
        { error: "Toko tidak ditemukan atau tidak aktif" },
        { status: 404 }
      );
    }

    // ==================================================
    // 2️⃣ AMBIL DATA PRODUK DARI GOOGLE SHEET
    // ==================================================
    let products = [];

    if (shopData.sheetId || shopData.sheetUrl) {
      try {
        // support sheetId (baru) & sheetUrl (legacy)
        const csvUrl = shopData.sheetId
          ? `https://docs.google.com/spreadsheets/d/${shopData.sheetId}/export?format=csv`
          : convertSheetToCSVUrl(shopData.sheetUrl);

        const csvRes = await fetch(csvUrl, { cache: "no-store" });

        if (!csvRes.ok) {
          throw new Error("CSV tidak bisa diakses");
        }

        const csvText = await csvRes.text();
        const parsed = parseCSV(csvText);

        products = parsed
          .filter((p) => p.name && p.status !== "off")
          .map((p) => ({
            name: p.name,
            price: Number(p.price) || 0,
            img: p.img || "",
            fee: Number(p.fee) || 0,
            category: p.category || "",
            promo: p.promo || "",
            estimasi: p.estimasi || "",
            status: p.status || "on",
            shopName: p.shop || shopData.name,
          }));
      } catch (sheetErr) {
        console.warn(
          "[GET-SHOP] Gagal ambil produk, lanjut tanpa produk:",
          sheetErr.message
        );
        products = [];
      }
    }

    // ==================================================
    // 3️⃣ FINAL RESPONSE + CACHE
    // ==================================================
    const responseData = {
      shop: {
        name: shopData.name,
        wa: shopData.wa,
        theme: shopData.theme,
        subdomain: shopData.subdomain,
      },
      products,
    };

    cache[shop] = {
      timestamp: now,
      data: responseData,
    };

    return NextResponse.json(responseData, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });

  } catch (err) {
    console.error("[API GET-SHOP ERROR]", err);

    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
