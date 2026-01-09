import { NextResponse } from "next/server";

const FIREBASE_BASE   = "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

export async function POST(req) {
  console.log("[1] REGISTER API HIT");
  const startTime = Date.now();
  let subdomain = null;

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
    const { name, wa, email, theme } = body;
    subdomain = body.subdomain;

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

    if (exists?.status === "pending") {
      return NextResponse.json(
        { error: "Website sedang diproses, mohon tunggu" },
        { status: 409 }
      );
    }

    if (exists) {
      return NextResponse.json(
        { error: "Subdomain sudah digunakan" },
        { status: 409 }
      );
    }

    // ==================================================
    // 3️⃣ SIMPAN STATUS PENDING (AWAL)
    // ==================================================
    const pendingData = {
      name,
      wa,
      email,
      subdomain,
      theme,
      status: "pending",
      active: false,
      createdAt: Date.now(),
    };

    console.log("[4] SAVE PENDING");

    await fetch(shopUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pendingData),
    });

    // ==================================================
    // 4️⃣ APPS SCRIPT → CREATE & SHARE SHEET
    // ==================================================
    console.log("[5] CALL APPS SCRIPT");

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
      throw new Error("Apps Script tidak mengembalikan JSON");
    }

    if (!scriptRes.ok || !scriptJson.ok) {
      throw new Error(scriptJson.error || "Gagal membuat Google Sheet");
    }

    const { sheetId, sheetUrl } = scriptJson;

    if (!sheetId || !sheetUrl) {
      throw new Error("Sheet ID / URL tidak valid");
    }

    console.log("[6] SHEET CREATED", sheetId);

    // ==================================================
    // 5️⃣ UPDATE STATUS READY
    // ==================================================
    await fetch(shopUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sheetId,
        sheetUrl,
        status: "ready",
        active: true,
        readyAt: Date.now(),
      }),
    });

    console.log(
      "[7] REGISTER SUCCESS",
      subdomain,
      Date.now() - startTime,
      "ms"
    );

    return NextResponse.json({
      success: true,
      status: "ready",
      redirect: `https://${subdomain}.tokoinstan.online`,
    });

  } catch (err) {
    console.error("[REGISTER SHOP ERROR]", err);

    // ==================================================
    // 6️⃣ TANDAI FAILED (JIKA SUDAH ADA SUBDOMAIN)
    // ==================================================
    if (subdomain) {
      await fetch(`${FIREBASE_BASE}/shops/${subdomain}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "failed",
          errorMessage: err.message,
          failedAt: Date.now(),
        }),
      });
    }

    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
