import { NextResponse } from "next/server";
import { getShopService } from "./service";
import { AppError } from "@/lib/errors";

export async function GET(req) {
  const requestId = crypto.randomUUID();

  try {
    const { searchParams } = new URL(req.url);
    const subdomain = searchParams.get("shop");

    const result = await getShopService(subdomain, { requestId });

    return NextResponse.json(result);
  } catch (err) {
    const status = err instanceof AppError ? err.status : 500;

    return NextResponse.json(
      {
        success: false,
        error: err.message || "Internal Server Error",
        requestId,
      },
      { status }
    );
  }
}
