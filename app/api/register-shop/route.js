import { NextResponse } from "next/server";

const BASE_FIREBASE_URL = "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

export async function POST(req) {
  try {
    const { name, wa, email, subdomain, theme } = await req.json();

    if (!name || !wa || !email || !subdomain || !theme) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // 1️⃣ CEK SUBDOMAIN
    const shopUrl = `${BASE_FIREBASE_URL}/shops/${subdomain}.json`;
    const check = await fetch(shopUrl);
    if (await check.json()) {
      return NextResponse.json({ error: "Subdomain sudah digunakan" }, { status: 409 });
    }

    // 2️⃣ PANGGIL APPS SCRIPT
    const scriptRes = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        shopName: name,
        theme
      }),
    });

    const rawText = await scriptRes.text();
    let sheetResult;

    try {
      sheetResult = JSON.parse(rawText);
    } catch {
      console.error("Apps Script HTML:", rawText);
      throw new Error("Apps Script error");
    }

    if (!sheetResult.ok) {
      throw new Error(sheetResult.error || "Gagal membuat sheet");
    }

    // 3️⃣ SIMPAN KE FIREBASE
    const data = {
      name,
      wa,
      email,
      theme,
      sheetUrl: sheetResult.sheetUrl,
      createdAt: Date.now(),
      active: true
    };

    await fetch(shopUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return NextResponse.json({
      success: true,
      redirect: `https://${subdomain}.tokoinstan.online`,
    });

  } catch (err) {
    console.error("[REGISTER SHOP]", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
