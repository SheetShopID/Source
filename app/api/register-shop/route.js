import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";        // ⬅️ WAJIB
export const dynamic = "force-dynamic"; // ⬅️ WAJIB

export async function POST(req) {
  try {
    const body = await req.json();
    const { subdomain, name, wa, sheetUrl, theme } = body || {};

    /* =====================
     * VALIDATION
     ===================== */
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

    const reserved = ["www", "admin", "api", "register"];
    if (reserved.includes(subdomain)) {
      return NextResponse.json(
        { error: "Subdomain tidak diperbolehkan" },
        { status: 400 }
      );
    }

    /* =====================
     * FIREBASE OPERATION
     ===================== */
    const ref = db.ref(`shops/${subdomain}`);

    const snapshot = await ref.get();
    if (snapshot.exists()) {
      return NextResponse.json(
        { error: "Subdomain sudah digunakan" },
        { status: 409 }
      );
    }

    await ref.set({
      name: name.trim(),
      wa: wa.startsWith("62") ? wa : `62${wa}`,
      sheetUrl: sheetUrl.trim(),
      theme,
      active: true,
      createdAt: Date.now(),
    });

    /* =====================
     * RESPONSE
     ===================== */
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
