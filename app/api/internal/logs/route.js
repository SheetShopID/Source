import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Email required" },
      { status: 400 }
    );
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.MASTER_SHEET_ID,
      range: "Logs!A2:E",
    });

    const rows = res.data.values || [];
    const logs = rows
      .filter((r) => r[1] === email)
      .map((r) => ({
        time: r[0],
        email: r[1],
        action: r[2],
        status: r[3],
        detail: r[4],
      }));

    return NextResponse.json({ ok: true, logs });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
/*tes*/
