import { NextResponse } from "next/server";

const FIREBASE_BASE =
  "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

export async function POST(req) {
  try {
    const { subdomain } = await req.json();
    if (!subdomain) {
      return NextResponse.json({ error: "No subdomain" }, { status: 400 });
    }

    const shopUrl = `${FIREBASE_BASE}/shops/${subdomain}.json`;

    // =========================
    // AMBIL DATA TOKO
    // =========================
    const shopRes = await fetch(shopUrl, { cache: "no-store" });
    const shop = await shopRes.json();

    if (!shop || shop.status === "active") {
      return NextResponse.json({ ok: true });
    }

    // =========================
    // CALL APPS SCRIPT (BERAT)
    // =========================
    const scriptRes = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "createSheet",
        email: shop.email,
        shopName: shop.name,
        theme: shop.theme,
      }),
    });

    const result = await scriptRes.json();
    if (!result.ok) throw new Error(result.error);

    // =========================
    // UPDATE FIREBASE
    // =========================
    await fetch(shopUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "active",
        sheetId: result.sheetId,
        sheetUrl: result.sheetUrl,
      }),
    });

    return NextResponse.json({ ok: true });

  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
