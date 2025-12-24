import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

const RESERVED = ["www", "admin", "api"];

export async function POST(req) {
  try {
    // 🔹 INIT FIREBASE DI SINI (BUKAN DI IMPORT)
    const { db } = getFirebaseAdmin();

    const { subdomain, name, wa, sheetUrl, theme } = await req.json();

    // --- VALIDASI DASAR ---
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

    const ref = db.ref(`shops/${subdomain}`);
    const snapshot = await ref.get();

    if (snapshot.exists()) {
      return NextResponse.json(
        { error: "Subdomain sudah digunakan" },
        { status: 409 }
      );
    }

    // --- DATA FINAL ---
    await ref.set({
      name,
      wa,
      sheetUrl,
      theme,
      active: true,
      createdAt: Date.now(),
    });

    return NextResponse.json({
      success: true,
      redirect: `https://${subdomain}.tokoinstan.online`,
    });
  } catch (err) {
    console.error("[REGISTER SHOP ERROR]", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
