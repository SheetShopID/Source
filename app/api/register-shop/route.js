import { NextResponse } from "next/server";
import { registerShop } from "./service";
import { rateLimit } from "@/lib/rate-limit";
import { AppError } from "@/lib/errors";
import { log } from "@/lib/logger";

export async function POST(req) {
  const requestId = crypto.randomUUID();
  const ip =
    req.headers.get("x-forwarded-for") ||
    "unknown";

  try {
    if (!rateLimit(ip)) {
      throw new AppError(
        "Terlalu banyak request",
        429
      );
    }

    const body = await req.json();

    const result = await registerShop(body, {
      requestId,
    });

    return NextResponse.json(result);
  } catch (err) {
    const status = err instanceof AppError ? err.status : 500;

    await log(
      "REGISTER_ERROR",
      { message: err.message },
      requestId,
      "error",
      "register-shop"
    );

    return NextResponse.json(
      { error: err.message },
      { status }
    );
  }
}
