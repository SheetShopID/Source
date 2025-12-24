import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESERVED = ["www", "admin", "api", "register"];

export async function POST(req) {
  try {
    const { subdomain, name, wa, sheetUrl, theme } = await req.json();

    // VALIDASI
    if (!subdomain || !name || !wa || !sheetUrl || !theme) {
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

    if (RESERVED.includes(subdomain)) {
      return NextResponse.json(
        { error: "Subdomain tidak diperbolehkan" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.FIREBASE_DATABASE_URL;
    if (!baseUrl) {
      throw new Error("Missing FIREBASE_DATABASE_URL");
    }

    const shopUrl = `${baseUrl}/shops/${subdomain}.json`;

    // ⏱️ TIMEOUT PROTECTION
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    // CEK APAKAH SHOP SUDAH ADA
    const checkRes = await fetch(shopUrl, {
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    const existing = await checkRes.json();
    if (existing) {
      return NextResponse.json(
        { error: "Subdomain sudah digunakan" },
        { status: 409 }
      );
    }

    // SIMPAN DATA
    const saveRes = await fetch(shopUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        wa,
        sheetUrl,
        theme,
        active: true,
        createdAt: Date.now(),
      }),
    });

    if (!saveRes.ok) {
      throw new Error("Gagal menyimpan data");
    }

    return NextResponse.json({
      success: true,
      redirect: `https://${subdomain}.tokoinstan.online`,
    });
  } catch (err) {
    console.error("[REGISTER SHOP ERROR]", err);

    return NextResponse.json(
      { error: "Server error / timeout" },
      { status: 500 }
    );
  }
}
