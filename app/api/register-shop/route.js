import { NextResponse } from "next/server";

const FIREBASE_BASE =
  "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, wa, email, subdomain, theme } = body;

    // ==================================================
    // 0️⃣ VALIDASI INPUT
    // ==================================================
    if (!name || !wa || !email || !subdomain || !theme) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      return NextResponse.json(
        { error: "Subdomain hanya boleh huruf kecil, angka, dan -" },
        { status: 400 }
      );
    }

    const RESERVED = ["www", "admin", "api"];
    if (RESERVED.includes(subdomain)) {
      return NextResponse.json(
        { error: "Subdomain tidak diperbolehkan" },
        { status: 400 }
      );
    }

    const shopUrl = `${FIREBASE_BASE}/shops/${subdomain}.json`;

    // ==================================================
    // 1️⃣ CEK SUBDOMAIN DI FIREBASE
    // ==================================================
    const checkRes = await fetch(shopUrl, { cache: "no-store" });
    const exists = await checkRes.json();

    if (exists) {
      return NextResponse.json(
        { error: "Subdomain sudah digunakan" },
        { status: 409 }
      );
    }

    // ==================================================
    // 2️⃣ APPS SCRIPT → COPY SHEET + SHARE GMAIL
    // ==================================================
    const scriptRes = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "createSheet",
        email,
        shopName: name,
        theme,
      }),
    });

    const scriptText = await scriptRes.text();
    let scriptJson;

    try {
      scriptJson = JSON.parse(scriptText);
    } catch (err) {
      console.error("[APPS SCRIPT NON-JSON]", scriptText);
      throw new Error("Apps Script tidak mengembalikan JSON");
    }

    if (!scriptRes.ok || !scriptJson.ok) {
      console.error("[APPS SCRIPT ERROR]", scriptJson);
      throw new Error(scriptJson.error || "Gagal membuat Google Sheet");
    }

    const { sheetId, sheetUrl } = scriptJson;

    if (!sheetId || !sheetUrl) {
      throw new Error("Sheet ID / URL tidak valid");
    }

    // ==================================================
    // 3️⃣ SIMPAN DATA TOKO KE FIREBASE
    // ==================================================
    const shopData = {
      name,
      wa,
      email,
      subdomain,
      theme,
      sheetId,
      sheetUrl,
      active: true,
      createdAt: Date.now(),
    };

    const saveRes = await fetch(shopUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(shopData),
    });

    if (!saveRes.ok) {
      const errText = await saveRes.text();
      console.error("[FIREBASE ERROR]", errText);
      throw new Error("Gagal menyimpan data ke Firebase");
    }

    console.log("[REGISTER SHOP SUCCESS]", subdomain);

    // ==================================================
    // 4️⃣ RESPONSE SUCCESS
    // ==================================================
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
