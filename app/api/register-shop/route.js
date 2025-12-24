import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { subdomain, name, wa, sheetUrl, theme } = await req.json();

    if (!subdomain || !name || !wa || !sheetUrl || !theme) {
      return NextResponse.json({ error: "Data tidak lengkap (termasuk tema)" }, { status: 400 });
    }

    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      return NextResponse.json({ error: "Subdomain tidak valid" }, { status: 400 });
    }

    const reserved = ["www", "admin", "api"];
    if (reserved.includes(subdomain)) {
      return NextResponse.json({ error: "Subdomain tidak diperbolehkan" }, { status: 400 });
    }

    const url = `https://tokoinstan-3e6d5-default-rtdb.firebaseio.com/shops/${subdomain}.json`;

    const check = await fetch(url);
    const exists = await check.json();

    if (exists) {
      return NextResponse.json({ error: "Subdomain sudah digunakan" }, { status: 409 });
    }

    const data = { name, wa, sheetUrl, theme, createdAt: Date.now(), active: true };

    const save = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!save.ok) {
      return NextResponse.json({ error: "Gagal menyimpan data toko" }, { status: 500 });
    }

    return NextResponse.json({ success: true, redirect: `https://${subdomain}.tokoinstan.online` });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
