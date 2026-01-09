import { NextResponse } from "next/server";
import { parseCSV, convertSheetToCSVUrl } from "@/lib/csv";

// 🔥 WAJIB: paksa route ini DINAMIS
export const dynamic = "force-dynamic";
export const revalidate = 0;

const FIREBASE_BASE =
  "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";

// ==================================================
// IN-MEMORY CACHE (BEST EFFORT, NON-CRITICAL)
// ⚠️ Vercel serverless bisa reset kapan saja
// ==================================================
const cache = {};
const CACHE_TTL = 1000 * 60; // 1 menit

export async function GET(req) {
  try {
    // ==================================================
    // 0️⃣ AMBIL PARAMETER
    // ==================================================
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
    // 1️⃣ CACHE CHECK (SAFE MODE)
    // ==================================================
    const cached = cache[shop];
    if (cached && now - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data, { status: 200 });
    }

    // ==================================================
    // 2️⃣ AMBIL DATA TOKO DARI FIREBASE
    // ==================================================
    const firebaseUrl = `${FIREBASE_BASE}/shops/${encodeURIComponent(
      shop
    )}.json`;

    const fbRes = await fetch(firebaseUrl, {
      cache: "no-store",
      headers: { "Cache-Control": "no-store" },
    });

    if (!fbRes.ok) {
      throw new Error("Gagal mengambil data toko");
    }

    const shopData = await fbRes.json();

    if (!shopData || shopData.active !== true) {
      return NextResponse.json(
        { error: "Toko tidak ditemukan atau belum aktif" },
        { status: 404 }
      );
    }

    // ==================================================
    // 3️⃣ AMBIL PRODUK DARI GOOGLE SHEET
    // ==================================================
    let products = [];

    if (shopData.sheetId || shopData.sheetUrl) {
      try {
        const csvUrl = shopData.sheetId
          ? `https://docs.google.com/spreadsheets/d/${shopData.sheetId}/export?format=csv`
          : convertSheetToCSVUrl(shopData.sheetUrl);

        const csvRes = await fetch(csvUrl, { cache: "no-store" });

        if (!csvRes.ok) {
          throw new Error("CSV tidak dapat diakses");
        }

        const csvText = await csvRes.text();
        const parsedRows = parseCSV(csvText);

        products = parsedRows
          .filter((row) => row.name && row.status !== "off")
          .map((row) => ({
            name: row.name,
            price: Number(row.price) || 0,
            fee: Number(row.fee) || 0,
            img: row.img || "",
            category: row.category || "",
            promo: row.promo || "",
            estimasi: row.estimasi || "",
            status: row.status || "on",
            shopName: row.shop || shopData.name,
          }));
      } catch (sheetErr) {
        // ⚠️ Sheet error TIDAK BOLEH bikin toko mati
        console.warn(
          "[GET-SHOP] Sheet error, lanjut tanpa produk:",
          sheetErr.message
        );
        products = [];
      }
    }

    // ==================================================
    // 4️⃣ FINAL RESPONSE
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

    // ==================================================
    // 5️⃣ SIMPAN CACHE (BEST EFFORT)
    // ==================================================
    cache[shop] = {
      timestamp: now,
      data: responseData,
    };

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[API GET-SHOP ERROR]", err);

    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
