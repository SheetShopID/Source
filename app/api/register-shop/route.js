import { NextResponse } from "next/server";
import { registerShop } from "./service";
import { log } from "@/lib/logger";
import { AppError } from "@/lib/errors";

export async function POST(req) {
  const requestId = crypto.randomUUID();

  try {
    const body = await req.json();

    const shopData = await registerShop(body, { requestId });

    await log("REGISTER_SUCCESS", { shop: shopData.name }, requestId, "info","register-shop");

    return NextResponse.json({ success: true, shop: shopData });
  } catch (err) {
    const errorMsg = err instanceof AppError ? err.message : "Server error";

     
    await log(
      "REGISTER_ERROR",
      { message: err.message },
      requestId,
      "error",
      "register-shop"
    );

    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: err.status || 500 }
    );
  }
}
