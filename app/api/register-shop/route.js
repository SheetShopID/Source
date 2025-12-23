import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("REGISTER SHOP API HIT");

    const body = await req.json();
    console.log("BODY:", body);

    const { subdomain, name, wa, sheetUrl } = body || {};

    if (!subdomain || !name || !wa || !sheetUrl) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const url = `https://tokoinstan-3e6d5-default-rtdb.firebaseio.com/shops/${subdomain}.json`;

    console.log("CHECK URL:", url);

    const check = await fetch(url);
    const exists = await check.json();

    console.log("EXISTS:", exists);

    if (exists) {
      return NextResponse.json(
        { error: "Subdomain sudah digunakan" },
        { status: 409 }
      );
    }

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
      throw new Error("Gagal simpan Firebase");
    }

    return NextResponse.json({
      success: true,
      redirect: `https://${subdomain}.tokoinstan.online`,
    });

  } catch (e) {
    console.error("REGISTER ERROR:", e);

    return NextResponse.json(
      { error: e.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
