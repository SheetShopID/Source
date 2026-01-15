import { firebaseGet } from "@/lib/firebase";
import { parseCSV, convertSheetToCSVUrl } from "@/lib/csv";
import { getCache, setCache } from "@/lib/cache";
import { log } from "@/lib/logger";

/**
 * GET SHOP SERVICE (HARDENED)
 */
export async function getShopService(shop) {
  const requestId = crypto.randomUUID();

  /* ------------------------------------------------
   * 1️⃣ VALIDASI INPUT
   * ------------------------------------------------ */
  if (!shop) {
    throw new Error("Parameter shop wajib diisi");
  }

  /* ------------------------------------------------
   * 2️⃣ CACHE (60s)
   * ------------------------------------------------ */
  const cacheKey = `shop:${shop}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  /* ------------------------------------------------
   * 3️⃣ FIREBASE
   * ------------------------------------------------ */
  const shopData = await firebaseGet(`shops/${shop}`);

  if (!shopData) {
    throw new Error("Toko tidak ditemukan");
  }

  if (!shopData.active) {
    throw new Error("Toko tidak aktif");
  }

  /* ------------------------------------------------
   * 4️⃣ VALIDASI SHEET CONFIG
   * ------------------------------------------------ */
  if (!shopData.sheetId && !shopData.sheetUrl) {
    await log(
      "SHOP_MISSING_SHEET",
      { shop },
      requestId,
      "error",
      "get-shop"
    );

    throw new Error("Toko belum memiliki data produk");
  }

  /* ------------------------------------------------
   * 5️⃣ GOOGLE SHEET → PRODUCTS
   * ------------------------------------------------ */
  let products = [];

  try {
    const csvUrl = shopData.sheetId
      ? `https://docs.google.com/spreadsheets/d/${shopData.sheetId}/export?format=csv`
      : convertSheetToCSVUrl(shopData.sheetUrl);

    const csvRes = await fetch(csvUrl, { cache: "no-store" });

    if (!csvRes.ok) {
      throw new Error(`CSV tidak bisa diakses (${csvRes.status})`);
    }

    const csvText = await csvRes.text();
    const parsed = parseCSV(csvText);

    if (!Array.isArray(parsed)) {
      throw new Error("CSV parser mengembalikan data tidak valid");
    }

    products = parsed
      .filter((p) => p?.name && p?.status !== "off")
      .map((p) => ({
        name: String(p.name).trim(),
        price: Number(p.price) || 0,
        img: p.img || "",
        fee: Number(p.fee) || 0,
        category: p.category || "LAINNYA",
        promo: p.promo || "",
        estimasi: p.estimasi || "",
        status: p.status || "on",
      }));

  } catch (err) {
    await log(
      "GET_SHOP_SHEET_ERROR",
      {
        shop,
        message: err.message,
      },
      requestId,
      "error",
      "get-shop"
    );

    // ❗ Sengaja TIDAK throw → frontend tetap render toko
    products = [];
  }

  /* ------------------------------------------------
   * 6️⃣ RESPONSE (CANONICAL)
   * ------------------------------------------------ */
  const response = {
    success: true,
    shop: {
      name: shopData.name,
      wa: shopData.wa,
      theme: shopData.theme,
      subdomain: shopData.subdomain,
    },
    products,
    requestId,
  };

  /* ------------------------------------------------
   * 7️⃣ CACHE SET
   * ------------------------------------------------ */
  setCache(cacheKey, response, 60);

  return response;
}
