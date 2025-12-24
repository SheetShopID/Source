import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    /******************************
     * 1. PARSE & SANITIZE INPUT
     ******************************/
    const body = await req.json();
    let { subdomain, name, wa, sheetUrl, theme } = body || {};

    if (!subdomain || !name || !wa || !sheetUrl || !theme) {
      return NextResponse.json(
        { success: false, error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // Normalisasi
    const cleanSubdomain = subdomain.toLowerCase().trim();
    const cleanName = name.replace(/[<>]/g, "").trim();
    const cleanWa = wa.trim();
    const cleanSheetUrl = sheetUrl.trim();

    /******************************
     * 2. VALIDASI INPUT
     ******************************/
    // Subdomain format
    if (!/^[a-z0-9-]+$/.test(cleanSubdomain)) {
      return NextResponse.json(
        { success: false, error: "Subdomain hanya boleh huruf kecil, angka, dan '-'" },
        { status: 400 }
      );
    }

    // Panjang subdomain
    if (cleanSubdomain.length < 3 || cleanSubdomain.length > 20) {
      return NextResponse.json(
        { success: false, error: "Subdomain harus 3–20 karakter" },
        { status: 400 }
      );
    }

    // Reserved subdomain
    const reserved = ["www", "admin", "api", "dashboard"];
    if (reserved.includes(cleanSubdomain)) {
      return NextResponse.json(
        { success: false, error: "Subdomain tidak diperbolehkan" },
        { status: 400 }
      );
    }

    // Validasi WhatsApp
    if (!/^62[0-9]{8,13}$/.test(cleanWa)) {
      return NextResponse.json(
        { success: false, error: "Nomor WhatsApp harus diawali 62" },
        { status: 400 }
      );
    }

    // Validasi tema
    const allowedThemes = ["jastip", "makanan", "laundry"];
    if (!allowedThemes.includes(theme)) {
      return NextResponse.json(
        { success: false, error: "Tema tidak valid" },
        { status: 400 }
      );
    }

    /******************************
     * 3. CHECK EXISTING SHOP
     ******************************/
    const firebaseUrl = `https://tokoinstan-3e6d5-default-rtdb.firebaseio.com/shops/${cleanSubdomain}.json`;

    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);

    const check = await fetch(firebaseUrl, {
      method: "GET",
      signal: controller.signal,
    });

    const exists = await check.json();

    if (exists) {
      return NextResponse.json(
        { success: false, error: "Subdomain sudah digunakan" },
        { status: 409 }
      );
    }

    /******************************
     * 4. SAVE SHOP DATA
     ******************************/
    const shopData = {
      name: cleanName,
      wa: cleanWa,
      sheetUrl: cleanSheetUrl,
      theme,
      subdomain: cleanSubdomain,
      plan: "free",
      active: true,
      visit: 0,
      createdAt: Date.now(),
    };

    const save = await fetch(firebaseUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(shopData),
    });

    if (!save.ok) {
      console.error("[REGISTER] Firebase save failed", save.status);
      return NextResponse.json(
        { success: false, error: "Gagal menyimpan data toko" },
        { status: 500 }
      );
    }

    /******************************
     * 5. SUCCESS RESPONSE
     ******************************/
    const redirect = `https://${cleanSubdomain}.tokoinstan.online`;

    console.log("[REGISTER SUCCESS]", cleanSubdomain);

    return NextResponse.json({
      success: true,
      redirect,
    });

  } catch (e) {
    console.error("[REGISTER ERROR]", e);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
