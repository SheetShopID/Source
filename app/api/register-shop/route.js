import { NextResponse } from "next/server";

const BASE_FIREBASE_URL = "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";

export async function POST(req) {
  try {
    const { subdomain, name, wa, sheetUrl, theme } = await req.json();
 
    if (!subdomain || !name || !wa || !sheetUrl || !theme) {
      return NextResponse.json(
        { error: "Data tidak lengkap (nama, WA, sheetUrl, tema, subdomain wajib diisi)" },
        { status: 400 }
      );
    } 
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      return NextResponse.json({ error: "Subdomain tidak valid." }, { status: 400 });
    }
 
    const RESERVED = ["www", "admin", "api"];
    if (RESERVED.includes(subdomain)) {
      return NextResponse.json(
        { error: "Subdomain tersebut tidak diperbolehkan." },
        { status: 400 }
      );
    }

    const url = `${BASE_FIREBASE_URL}/shops/${encodeURIComponent(subdomain)}.json`;
 
    const checkRes = await fetch(url, { cache: "no-store" });
    let exists = null;
    try {
      exists = await checkRes.json();
    } catch {
      exists = null;
    }

    if (exists) {
      return NextResponse.json(
        { error: "Subdomain sudah digunakan." },
        { status: 409 }
      );
    }
 
    const data = {
      name,
      wa,
      sheetUrl,
      theme,
      createdAt: Date.now(),
      active: true,
    };
 
    const saveRes = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(data),
    });

    if (!saveRes.ok) {
      return NextResponse.json(
        { error: "Gagal menyimpan data ke Firebase." },
        { status: 500 }
      );
    }
 
    return NextResponse.json(
      {
        success: true,
        redirect: `https://${subdomain}.tokoinstan.online`,
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );

  } catch (err) {
    console.error("[API REGISTER-SHOP]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
