import { NextResponse } from "next/server";

const FIREBASE_BASE =
  "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

export async function POST(req) {
  console.log("[1] REGISTER API HIT");
  const startTime = Date.now();

  try {
    // ==================================================
    // 0️⃣ VALIDASI ENV
    // ==================================================
    if (!APPS_SCRIPT_URL) {
      throw new Error("APPS_SCRIPT_URL belum diset");
    }

    // ==================================================
    // 1️⃣ PARSE & VALIDASI BODY
    // ==================================================
    const body = await req.json();
    const { name, wa, email, subdomain, theme } = body;

    console.log("[2] BODY PARSED", email);

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

    // ==================================================
    // 2️⃣ CEK SUBDOMAIN DI FIREBASE
    // ==================================================
    const shopUrl = `${FIREBASE_BASE}/shops/${subdomain}.json`;

    console.log("[3] CHECK SUBDOMAIN", subdomain);

    const checkRes = await fetch(shopUrl, { cache: "no-store" });
    const exists = await checkRes.json();

    if (exists) {
      return NextResponse.json(
        { error: "Subdomain sudah digunakan" },
        { status: 409 }
      );
    }

    // ==================================================
    // 2️⃣b CEK EMAIL DUPLIKAT
    // ==================================================
    console.log("[3b] CHECK EMAIL DUPLICATE");

    const allShopsRes = await fetch(
      `${FIREBASE_BASE}/shops.json`,
      { cache: "no-store" }
    );
    const allShops = await allShopsRes.json();

    if (allShops) {
      const emailUsed = Object.values(allShops).some(
        (shop) => shop.email === email && shop.active
      );

      if (emailUsed) {
        return NextResponse.json(
          {
            error:
              "Email ini sudah memiliki toko aktif. Silakan gunakan email lain.",
          },
          { status: 409 }
        );
      }
    }

    // ==================================================
    // 3️⃣ APPS SCRIPT → CREATE & SHARE SHEET
    // ==================================================
    console.log("[4] CALL APPS SCRIPT");

    let sheetId = null;
    let sheetUrlResult = null;

    try {
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
      } catch {
        console.error("[APPS SCRIPT NON-JSON]", scriptText);
        throw new Error("Apps Script response tidak valid");
      }

      if (!scriptRes.ok || !scriptJson.ok) {
        console.error("[APPS SCRIPT ERROR]", scriptJson);
        throw new Error(scriptJson.error || "Apps Script gagal");
      }

      if (!scriptJson.sheetId || !scriptJson.sheetUrl) {
        console.error("[APPS SCRIPT INVALID DATA]", scriptJson);
        throw new Error("Sheet ID / URL kosong");
      }

      sheetId = scriptJson.sheetId;
      sheetUrlResult = scriptJson.sheetUrl;

      console.log("[5] SHEET CREATED", sheetId);
    } catch (err) {
      console.error("[APPS SCRIPT FAILED - ABORT FIREBASE]", err);
      throw err; // ⛔ STOP TOTAL
    }

    // ==================================================
    // 4️⃣ SIMPAN DATA TOKO KE FIREBASE (FINAL STEP)
    // ==================================================
    if (!sheetId || !sheetUrlResult) {
      throw new Error("Sheet belum berhasil dibuat, abort save");
    }

    console.log("[6] SAVE TO FIREBASE");

    const shopData = {
      name,
      wa,
      email,
      subdomain,
      theme,
      sheetId,
      sheetUrl: sheetUrlResult,
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

    // ==================================================
    // 5️⃣ RESPONSE SUCCESS
    // ==================================================
    console.log(
      "[7] REGISTER SHOP SUCCESS",
      subdomain,
      Date.now() - startTime,
      "ms"
    );

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
