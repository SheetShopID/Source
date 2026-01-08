import { NextResponse } from "next/server";

const FIREBASE_BASE =
  "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";

export async function POST(req) {
  try {
    const { name, wa, email, subdomain, theme } = await req.json();

    // =========================
    // VALIDASI
    // =========================
    if (!name || !wa || !email || !subdomain || !theme) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
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

    // =========================
    // CEK SUBDOMAIN
    // =========================
    const check = await fetch(shopUrl, { cache: "no-store" });
    if (await check.json()) {
      return NextResponse.json(
        { error: "Subdomain sudah digunakan" },
        { status: 409 }
      );
    }

    // =========================
    // SIMPAN (CEPAT)
    // =========================
    const shopData = {
      name,
      wa,
      email,
      subdomain,
      theme,
      status: "processing",
      createdAt: Date.now(),
    };

    await fetch(shopUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(shopData),
    });

    // =========================
    // RESPONSE CEPAT
    // =========================
    return NextResponse.json({
      success: true,
      subdomain,
    });

  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
