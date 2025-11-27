// app/api/get-shop/route.js
export async function GET(req) {
  const shop = req.headers.get("x-shop");
  return Response.json({ shop });
}
