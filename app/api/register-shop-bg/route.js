import { NextResponse } from "next/server";

const FIREBASE_BASE = "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, theme, subdomain } = body;

    // ===========================
    // CALL APPS SCRIPT
    // ===========================
    const scriptRes = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "createSheet", email, shopName: name, theme }),
    });

    const scriptJson = await scriptRes.json();

    if (!scriptRes.ok || !scriptJson.ok) {
      throw new Error(scriptJson.error || "Gagal membuat Google Sheet");
    }

    const { sheetId, sheetUrl } = scriptJson;

    if (!sheetId || !sheetUrl) throw new Error("Sheet ID / URL tidak valid");

    // ===========================
    // UPDATE FIREBASE → ACTIVE
    // ===========================
    const shopUrl = `${FIREBASE_BASE}/shops/${subdomain}.json`;
    const updatedShop = {
      sheetId,
      sheetUrl,
      active: true,
      status: "ready",
      updatedAt: Date.now(),
    };

    await fetch(shopUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedShop),
    });

    console.log("[REGISTER SHOP BG SUCCESS]", subdomain);
    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("[REGISTER SHOP BG ERROR]", err);

    // Optional: update status = failed di Firebase
    const subdomain = body?.subdomain;
    if (subdomain) {
      const shopUrl = `${FIREBASE_BASE}/shops/${subdomain}.json`;
      await fetch(shopUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "failed", error: err.message }),
      });
    }

    return NextResponse.json({ ok: false, error: err.message });
  }
}
