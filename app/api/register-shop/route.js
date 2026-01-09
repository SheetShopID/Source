import { NextResponse } from "next/server";

const FIREBASE_BASE = "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, wa, email, subdomain, theme } = body;

    // ===========================
    // 0️⃣ VALIDASI tes
    // ===========================
    if (!name || !wa || !email || !subdomain || !theme) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      return NextResponse.json(
        { error: "Subdomain hanya boleh huruf kecil, angka, dan -" },
        { status: 400 }
      );
    }

    if (!email.endsWith("@gmail.com")) {
      return NextResponse.json(
        { error: "Gunakan email Gmail untuk Google Sheet" },
        { status: 400 }
      );
    }

    const RESERVED = ["www", "admin", "api"];
    if (RESERVED.includes(subdomain)) {
      return NextResponse.json({ error: "Subdomain tidak diperbolehkan" }, { status: 400 });
    }

    // ===========================
    // 1️⃣ CEK SUBDOMAIN DI FIREBASE
    // ===========================
    const shopUrl = `${FIREBASE_BASE}/shops/${subdomain}.json`;
    const checkRes = await fetch(shopUrl, { cache: "no-store" });
    const exists = await checkRes.json();
    if (exists) {
      return NextResponse.json({ error: "Subdomain sudah digunakan" }, { status: 409 });
    }

    // ===========================
    // 2️⃣ SIMPAN SHOP CEPAT → STATUS CREATING
    // ===========================
    const shopData = {
      name,
      wa,
      email,
      subdomain,
      theme,
      active: false,
      status: "creating",
      createdAt: Date.now(),
    };

    await fetch(shopUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(shopData),
    });

    // ===========================
    // 3️⃣ TRIGGER BACKGROUND SETUP
    // ===========================
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/register-shop-bg`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, theme, subdomain }),
    }).catch(console.error);

    // ===========================
    // 4️⃣ RESPONSE CEPAT
    // ===========================
    return NextResponse.json({
      success: true,
      redirect: `https://${subdomain}.tokoinstan.online/setup`,
    });

  } catch (err) {
    console.error("[REGISTER SHOP ERROR]", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

