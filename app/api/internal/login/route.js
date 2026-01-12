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
      sameSite: "lax",
      path: "/",
    });
    return res;
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
