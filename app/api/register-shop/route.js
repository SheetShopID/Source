import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { setupSheetAsync } from "@/lib/setup-sheet";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, wa, email, subdomain, theme } = body;

    /* =========================
       VALIDATION
    ========================= */
    if (!name || !wa || !email || !subdomain || !theme) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    if (!email.endsWith("@gmail.com")) {
      return NextResponse.json(
        { error: "Gunakan email Gmail" },
        { status: 400 }
      );
    }

    if (subdomain.length < 4) {
      return NextResponse.json(
        { error: "Subdomain minimal 4 karakter" },
        { status: 400 }
      );
    }

    const ref = db.collection("shops").doc(subdomain);
    const existing = await ref.get();

    if (existing.exists) {
      return NextResponse.json(
        { error: "Subdomain sudah digunakan" },
        { status: 409 }
      );
    }

    /* =========================
       SAVE INITIAL DATA
    ========================= */
    const payload = {
      name,
      wa,
      email,
      theme,
      subdomain,
      status: "processing",
      createdAt: Date.now(),
    };

    await ref.set(payload);

    /* =========================
       BACKGROUND SETUP (ASYNC)
       🔥 PENTING: JANGAN AWAIT
    ========================= */
    setupSheetAsync(subdomain).catch((err) => {
      console.error("SETUP FAILED:", subdomain, err);
    });

    /* =========================
       RESPONSE FAST ⚡
    ========================= */
    return NextResponse.json({
      success: true,
      subdomain,
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

