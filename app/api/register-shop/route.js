import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { subdomain, name, wa, sheetUrl } = await req.json();

    if (!subdomain || !name || !wa || !sheetUrl) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // VALIDASI SUBDOMAIN hanya huruf kecil
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      return NextResponse.json(
        { error: "Subdomain hanya huruf kecil & angka" },
        { status: 400 }
      );
    }

    const reserved = ["www", "admin", "api"];
    if (reserved.includes(subdomain)) {
      return NextResponse.json(
        { error: "Subdomain tidak diperbolehkan" },
        { status: 400 }
      );
    }

    const url = `https://tokoinstan-3e6d5-default-rtdb.firebaseio.com/shops/${subdomain}.json`;

    // CEK APAKAH SUDAH ADA
    const check = await fetch(url);
    const exists = await check.json();

    if (exists) {
      return NextResponse.json(
        { error: "Subdomain sudah digunakan" },
        { status: 409 }
      );
    }

    // SIMPAN DATA
    const data = {
      name,
      wa,
      sheetUrl,
      createdAt: Date.now(),
      active: true,
    };

    const save = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!save.ok) {
      return NextResponse.json(
        { error: "Gagal menyimpan data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      redirect: `https://${subdomain}.domainsaya.com`,
    });

  } catch (e) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    );
  }
}

