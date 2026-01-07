import { NextResponse } from "next/server";

const BASE_FIREBASE_URL =
  "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

export async function POST(req) {
  try {
    const { name, wa, email, subdomain, theme } = await req.json();

    // 0️⃣ VALIDASI
    if (!name || !wa || !email || !subdomain || !theme) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      return NextResponse.json(
        { error: "Subdomain tidak valid" },
        { status: 400 }
      );
    }

    // 1️⃣ CEK SUBDOMAIN
    const shopUrl = `${BASE_FIREBASE_URL}/shops/${subdomain}.json`;
    const checkRes = await fetch(shopUrl, { cache: "no-store" });
    const exists = await checkRes.json();

    if (exists) {
      return NextResponse.json(
        { error: "Subdomain sudah digunakan" },
        { status: 409 }
      );
    }

    // 2️⃣ PANGGIL APPS SCRIPT (COPY SHEET + SHARE)
    const scriptRes = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        shopName: name,
        theme,
      }),
    });

    if (!scriptRes.ok) {
      const html = await scriptRes.text();
      console.error("[APPS SCRIPT ERROR]", html);
      throw new Error("Apps Script gagal diakses");
    }

    const rawText = await scriptRes.text();
    let sheetResult;

    try {
      sheetResult = JSON.parse(rawText);
    } catch {
      console.error("[APPS SCRIPT HTML]", rawText);
      throw new Error("Response Apps Script tidak valid");
    }

    if (!sheetResult.ok || !sheetResult.sheetUrl) {
      throw new Error(sheetResult.error || "Gagal membuat Google Sheet");
    }

    // 3️⃣ SIMPAN KE FIREBASE
    const data = {
      name,
      wa,
      email,
      subdomain,
      theme,
      sheetUrl: sheetResult.sheetUrl,
      status: "active",
      createdAt: Date.now(),
    };

    const saveRes = await fetch(shopUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!saveRes.ok) {
      throw new Error("Gagal menyimpan data ke Firebase");
    }

    console.log("[REGISTER SHOP SUCCESS]", subdomain);

    // 4️⃣ SUCCESS
    return NextResponse.json({
      success: true,
      redirect: `https://${subdomain}.tokoinstan.online`,
    });

  } catch (err) {
    console.error("[REGISTER SHOP ERROR]", err);

    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
