// app/_internal/api/login/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  const { id, password } = await req.json();

  if (
    id === process.env.ADMIN_ID &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_session", process.env.ADMIN_SESSION_SECRET, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
    return res;
  }

  return NextResponse.json({ error: "Login gagal" }, { status: 401 });
}