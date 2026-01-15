import { NextResponse } from "next/server";
import { getShopService } from "./service";

/**
 * GET /api/get-shop?shop=subdomain
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get("shop");

    const result = await getShopService(shop);

    return NextResponse.json(result);
  } catch (err) {
    console.error("[GET-SHOP ROUTE ERROR]", err.message);

    return NextResponse.json(
      {
        success: false,
        error: err.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
