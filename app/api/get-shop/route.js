import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    /******************************
     * 1. PARSE & VALIDATE PARAM
     ******************************/
    const { searchParams } = new URL(req.url);
    const shopParam = searchParams.get("shop");

    if (!shopParam) {
      return NextResponse.json(
        { success: false, error: "Parameter shop wajib diisi" },
        { status: 400 }
      );
    }

    const shop = shopParam.toLowerCase().trim();

    // Validasi subdomain (samakan dengan register)
    if (!/^[a-z0-9-]+$/.test(shop)) {
      return NextResponse.json(
        { success: false, error: "Format shop tidak valid" },
        { status: 400 }
      );
    }

    /******************************
     * 2. FETCH FROM FIREBASE
     ******************************/
    const firebaseUrl = `https://tokoinstan-3e6d5-default-rtdb.firebaseio.com/shops/${shop}.json`;

    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);

    const res = await fetch(firebaseUrl, {
      method: "GET",
      signal: controller.signal,
      // Cache ringan → bagus untuk performa
      next: { revalidate: 60 }, // 60 detik
    });

    if (!res.ok) {
      console.error("[GET SHOP] Firebase error:", res.status);
      return NextResponse.json(
        { success: false, error: "Gagal mengambil data toko" },
        { status: 500 }
      );
    }

    const data = await res.json();

    /******************************
     * 3. VALIDATE RESULT
     ******************************/
    if (!data || !data.active) {
      return NextResponse.json(
        { success: false, error: "Toko tidak ditemukan atau nonaktif" },
        { status: 404 }
      );
    }

    /******************************
     * 4. RESPONSE (SANITIZED)
     ******************************/
    // Jangan kirim data internal yang tidak perlu
    const response = {
      name: data.name,
      wa: data.wa,
      sheetUrl: data.sheetUrl,
      theme: data.theme,
      subdomain: data.subdomain,
      plan: data.plan || "free",
    };

    return NextResponse.json(
      { success: true, data: response },
      { status: 200 }
    );

  } catch (e) {
    console.error("[GET SHOP ERROR]", e);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
