export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const shop = searchParams.get("shop");

  if (!shop) {
    return Response.json({ error: "Shop parameter missing" }, { status: 400 });
  }

  try {
    const url = `https://tokoinstan-3e6d5-default-rtdb.firebaseio.com/shops/${shop}.json`;
    const response = await fetch(url);

    if (!response.ok) {
      return Response.json({ error: "Firebase error" }, { status: 500 });
    }

    const data = await response.json();

    if (!data) {
      return Response.json({ error: "Shop not found" }, { status: 404 });
    }

    return Response.json(data);
  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
