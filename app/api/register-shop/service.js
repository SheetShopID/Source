// app/api/register-shop/service.js

import { firebaseGet, firebasePut } from "@/lib/firebase";
import { log } from "@/lib/logger";
import { validateSubdomain } from "@/lib/validators";
import { fetchRetry } from "@/lib/fetch-retry";
import { AppError } from "@/lib/errors";

/**
 * REGISTER SHOP SERVICE
 * @param {Object} payload - { name, wa, email, subdomain, theme }
 * @param {Object} ctx - { requestId }
 */
export async function registerShop(payload, ctx) {
  const { requestId } = ctx;
  const { name, wa, email, subdomain, theme } = payload;

  // 1️⃣ VALIDASI INPUT LENGKAP
  if (!name || !subdomain) {
    throw new AppError("Nama toko dan subdomain wajib diisi", 400);
  }

  if (!validateSubdomain(subdomain)) {
    throw new AppError("Subdomain tidak valid", 400);
  }

  // 2️⃣ CEK SUBDOMAIN SUDAH ADA DI FIREBASE
  const exists = await firebaseGet(`shops/${subdomain}`);
  if (exists) {
    throw new AppError("Subdomain sudah digunakan", 409);
  }

  // 3️⃣ LOG: PANGGIL APPS SCRIPT
  await log("CALL_APPS_SCRIPT", { subdomain }, requestId);

  // 4️⃣ KIRIM DATA KE APPS SCRIPT
  const res = await fetchRetry(process.env.APPS_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      wa: wa || "",
      email: email || "",
      subdomain,
      theme: theme || "food",
      requestId,
    }),
  });

  let json;
  try {
    json = await res.json();
  } catch (err) {
    throw new AppError("Response Apps Script tidak valid", 502);
  }

  if (!json.success) {
    throw new AppError(json.error || "Apps Script gagal", 502);
  }

  // 5️⃣ SIMPAN DATA TOKO KE FIREBASE
  const shopData = {
    name,
    wa: wa || "",
    email: email || "",
    subdomain,
    theme: theme || "food",
    sheetId: json.sheetId || null,
    sheetUrl: json.sheetUrl || null,
    active: true,
    createdAt: Date.now(),
    requestId,
  };

  await firebasePut(`shops/${subdomain}`, shopData);

  // 6️⃣ LOG SUCCESS
  await log("REGISTER_SUCCESS", { subdomain }, requestId);

  // 7️⃣ RETURN DATA
  return {
    redirect: `https://${subdomain}.tokoinstan.online`,
    sheetUrl: json.sheetUrl || null,
    requestId,
  };
}
