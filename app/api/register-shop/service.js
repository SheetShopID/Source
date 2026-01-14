import { firebaseGet, firebasePut } from "@/lib/firebase";
import { log } from "@/lib/logger";
import { validateSubdomain } from "@/lib/validators";
import { fetchRetry } from "@/lib/fetch-retry";
import { AppError } from "@/lib/errors";

export async function registerShop(payload, ctx) {
  const { requestId } = ctx;
  const { name, wa, email, subdomain, theme } =
    payload;

  if (
    !name ||
    !wa ||
    !email ||
    !subdomain ||
    !theme
  ) {
    throw new AppError("Data tidak lengkap", 400);
  }

  if (!validateSubdomain(subdomain)) {
    throw new AppError("Subdomain tidak valid", 400);
  }

  const exists = await firebaseGet(
    `shops/${subdomain}`
  );
  if (exists) {
    throw new AppError(
      "Subdomain sudah digunakan",
      409
    );
  }

  await log(
    "CALL_APPS_SCRIPT",
    { subdomain },
    requestId
  );

  const res = await fetchRetry(
    process.env.APPS_SCRIPT_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "createSheet",
        email,
        shopName: name,
        theme,
        requestId,
      }),
    }
  );

  const json = await res.json();

  if (!json.ok) {
    throw new AppError(
      json.error || "Apps Script gagal",
      502
    );
  }

  const shopData = {
    name,
    wa,
    email,
    subdomain,
    theme,
    sheetId: json.sheetId,
    sheetUrl: json.sheetUrl,
    active: true,
    createdAt: Date.now(),
    requestId,
  };

  await firebasePut(`shops/${subdomain}`, shopData);

  await log(
    "REGISTER_SUCCESS",
    { subdomain },
    requestId
  );

  return {
    redirect: `https://${subdomain}.tokoinstan.online`,
    sheetUrl: json.sheetUrl,
    requestId,
  };
}
