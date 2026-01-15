import { firebaseGet, firebasePut } from "@/lib/firebase";
import { log } from "@/lib/logger";
import { validateSubdomain } from "@/lib/validators";
import { fetchRetry } from "@/lib/fetch-retry";
import { AppError } from "@/lib/errors";

/**
 * REGISTER SHOP SERVICE (FINAL)
 * @param {Object} payload
 * @param {Object} ctx
 */
export async function registerShop(payload, ctx) {
  const { requestId } = ctx;

  const {
    name,
    wa,
    email,
    subdomain,
    theme = "food",
    sheetUrl,
  } = payload;

  /* ------------------------------------------------------------------
   * 1️⃣ VALIDASI INPUT (SINGLE SOURCE)
   * ------------------------------------------------------------------ */
  if (!name || !wa || !subdomain || !theme || !sheetUrl) {
    throw new AppError("Data register tidak lengkap", 400);
  }

  if (!validateSubdomain(subdomain)) {
    throw new AppError("Subdomain tidak valid", 400);
  }

  const sheetId = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
  if (!sheetId) {
    throw new AppError("Sheet URL tidak valid", 400);
  }

  /* ------------------------------------------------------------------
   * 2️⃣ CEK SUBDOMAIN SUDAH ADA
   * ------------------------------------------------------------------ */
  const exists = await firebaseGet(`shops/${subdomain}`);
  if (exists) {
    throw new AppError("Subdomain sudah digunakan", 409);
  }

  /* ------------------------------------------------------------------
   * 3️⃣ LOG + CALL APPS SCRIPT
   * ------------------------------------------------------------------ */
  await log("REGISTER_CALL_APPS_SCRIPT", { subdomain }, requestId);

  const res = await fetchRetry(process.env.APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      wa,
      email: email || "",
      subdomain,
      theme,
      sheetId,
      requestId,
    }),
  });

  let json;
  try {
    json = await res.json();
  } catch {
    throw new AppError("Response Apps Script tidak valid", 502);
  }

  if (!json?.success) {
    throw new AppError(json?.error || "Apps Script gagal", 502);
  }

  /* ------------------------------------------------------------------
   * 4️⃣ DATA FINAL TOKO (CANONICAL)
   * ------------------------------------------------------------------ */
  const shopData = {
    name,
    wa,
    email: email || "",
    subdomain,
    theme,
    sheetUrl,
    sheetId,
    active: true,
    createdAt: Date.now(),
    requestId,
  };

  /* ------------------------------------------------------------------
   * 5️⃣ SIMPAN KE FIREBASE
   * ------------------------------------------------------------------ */
  await firebasePut(`shops/${subdomain}`, shopData);

  /* ------------------------------------------------------------------
   * 6️⃣ LOG SUCCESS
   * ------------------------------------------------------------------ */
  await log("REGISTER_SUCCESS", { subdomain, sheetId }, requestId);

  /* ------------------------------------------------------------------
   * 7️⃣ RESPONSE
   * ------------------------------------------------------------------ */
  return {
    success: true,
    redirect: `https://${subdomain}.tokoinstan.online`,
    shop: {
      subdomain,
      theme,
      sheetUrl,
      sheetId,
    },
    requestId,
  };
}
