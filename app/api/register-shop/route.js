import { NextResponse } from "next/server";

const FIREBASE_BASE = "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

/** 🔹 Utility: kirim log ke Firebase (non-blocking) */
async function pushLog(label, data, requestId) {
  try {
    const ts = new Date().toISOString();
    const payload = { ts, label, data, requestId };
    await fetch(`${FIREBASE_BASE}/logs.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("[LOGGING FAILED]", err.message);
  }
}

/** 🔹 Generate unique requestId */
function makeRequestId() {
  return (
    "req_" +
    Date.now().toString(36) +
    "_" +
    Math.random().toString(36).substring(2, 8)
  );
}

export async function POST(req) {
  const requestId = makeRequestId();
  const startTime = Date.now();

  await pushLog("REGISTER_API_HIT", {}, requestId);

  try {
    // ==================================================
    // 1️⃣ ENV VALIDATION
    // ==================================================
    if (!APPS_SCRIPT_URL) throw new Error("APPS_SCRIPT_URL belum diset");

    // ==================================================
    // 2️⃣ PARSE BODY
    // ==================================================
    const body = await req.json();
    const { name, wa, email, subdomain, theme } = body;

    await pushLog("BODY_PARSED", { email, subdomain, theme }, requestId);

    if (!name || !wa || !email || !subdomain || !theme)
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });

    // ==================================================
    // 3️⃣ VALIDASI SUBDOMAIN
    // ==================================================
    const RESERVED = ["www", "admin", "api"];
    if (!/^[a-z0-9-]+$/.test(subdomain))
      return NextResponse.json({ error: "Subdomain hanya huruf kecil/angka/-" }, { status: 400 });
    if (RESERVED.includes(subdomain))
      return NextResponse.json({ error: "Subdomain tidak diperbolehkan" }, { status: 400 });

    // ==================================================
    // 4️⃣ CHECK FIREBASE DUPLICATE
    // ==================================================
    const shopUrl = `${FIREBASE_BASE}/shops/${subdomain}.json`;
    const shopCheck = await fetch(shopUrl, { cache: "no-store" });
    const exists = await shopCheck.json();
    if (exists)
      return NextResponse.json({ error: "Subdomain sudah digunakan" }, { status: 409 });

    const allShops = await fetch(`${FIREBASE_BASE}/shops.json`, { cache: "no-store" })
      .then((r) => r.json())
      .catch(() => null);

    if (allShops) {
      const duplicate = Object.values(allShops).some(
        (s) => s.email === email && s.active
      );
      if (duplicate)
        return NextResponse.json(
          { error: "Email ini sudah memiliki toko aktif." },
          { status: 409 }
        );
    }

    // ==================================================
    // 5️⃣ CALL APPS SCRIPT (ASYNC SAFE)
    // ==================================================
    await pushLog("CALL_APPS_SCRIPT", { APPS_SCRIPT_URL }, requestId);

    let sheetId = null;
    let sheetUrl = null;
    let scriptDuration = 0;

    try {
      const t0 = Date.now();
      const scriptRes = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createSheet",
          email,
          shopName: name,
          theme,
          requestId,
        }),
      });

      const scriptText = await scriptRes.text();
      scriptDuration = Date.now() - t0;

      let scriptJson;
      try {
        scriptJson = JSON.parse(scriptText);
      } catch {
        await pushLog("APPS_SCRIPT_NON_JSON", { scriptText }, requestId);
        throw new Error("Apps Script response bukan JSON");
      }

      if (!scriptJson.ok) {
        await pushLog("APPS_SCRIPT_FAIL", scriptJson, requestId);
        throw new Error(scriptJson.error || "Apps Script gagal");
      }

      sheetId = scriptJson.sheetId;
      sheetUrl = scriptJson.sheetUrl;
      await pushLog("SHEET_CREATED", { sheetId, sheetUrl, scriptDuration }, requestId);
    } catch (err) {
      await pushLog("APPS_SCRIPT_ERROR", { message: err.message }, requestId);
      throw err;
    }

    // ==================================================
    // 6️⃣ SAVE TO FIREBASE
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
      requestId,
    };

    const saveRes = await fetch(shopUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(shopData),
    });

    if (!saveRes.ok) {
      const errText = await saveRes.text();
      await pushLog("FIREBASE_SAVE_FAIL", { errText }, requestId);
      throw new Error("Gagal menyimpan data ke Firebase");
    }

    await pushLog("REGISTER_SUCCESS", {
      duration: Date.now() - startTime,
      subdomain,
    }, requestId);

    // ==================================================
    // 7️⃣ RETURN SUCCESS
    // ==================================================
    return NextResponse.json({
      success: true,
      redirect: `https://${subdomain}.tokoinstan.online`,
      sheetUrl,
      requestId,
    });
  } catch (err) {
    await pushLog("REGISTER_ERROR", { message: err.message, stack: err.stack }, requestId);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
