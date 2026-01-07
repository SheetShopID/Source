import { NextResponse } from "next/server";

const FIREBASE_URL =
  "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com/shops";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzITOHSKZu_uYhegsxfpWA9V4c8CmdqHWAGrFmMACCuq4oD4dDEp5Iinkq-eWKP40Zedg/exec"; // ← ganti

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, wa, email, subdomain, theme } = body;

    if (!email.endsWith("@gmail.com")) {
      return NextResponse.json(
        { error: "Gunakan email Gmail" },
        { status: 400 }
      );
    }

    // 1️⃣ Cek subdomain
    const check = await fetch(`${FIREBASE_URL}/${subdomain}.json`);
    if (await check.json()) {
      return NextResponse.json(
        { error: "Subdomain sudah digunakan" },
        { status: 409 }
      );
    }

    // 2️⃣ Minta Apps Script copy Google Sheet
    const scriptRes = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        shopName: name,
        theme,
      }),
    });

    const sheetResult = await scriptRes.json();

    if (!sheetResult.sheetUrl) {
      throw new Error("Gagal membuat Google Sheet");
    }

    // 3️⃣ Simpan ke Firebase
    const shopData = {
      name,
      wa,
      email,
      theme,
      sheetUrl: sheetResult.sheetUrl,
      sheetId: sheetResult.sheetId,
      createdAt: Date.now(),
      active: true,
    };

    await fetch(`${FIREBASE_URL}/${subdomain}.json`, {
      method: "PUT",
      body: JSON.stringify(shopData),
    });

    return NextResponse.json({
      success: true,
      redirect: `https://${subdomain}.tokoinstan.online`,
    });
  } catch (err) {
    console.error("[REGISTER SHOP]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

