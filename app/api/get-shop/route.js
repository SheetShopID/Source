import { db } from "../firebase/client";
import { ref, get } from "firebase/database";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get("shop");

  if (!shop) {
    return new Response(JSON.stringify({ error: "Missing shop" }), { status: 400 });
  }

  const snap = await get(ref(db, `shops/${shop}`));
  return new Response(JSON.stringify(snap.val() || {}), { status: 200 });
}
