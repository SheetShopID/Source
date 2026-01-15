import { firebaseGet } from "@/lib/firebase";
import { log } from "@/lib/logger";
import { fetchRetry } from "@/lib/fetch-retry";
import { AppError } from "@/lib/errors";
import { convertSheetToCSVUrl } from "@/lib/sheet-utils";
import { parseCSV } from "@/lib/csv-parser";

export async function getShopService(subdomain, ctx) {
  const { requestId } = ctx;

  /* ------------------------------------------------------------------
   * 1️⃣ VALIDASI INPUTS
   * ------------------------------------------------------------------ */
  if (!subdomain) {
    throw new AppError("Parameter shop wajib diisi", 400);
  }

  /* ------------------------------------------------------------------
   * 2️⃣ AMBIL DATA SHOP
   * ------------------------------------------------------------------ */
  const shop = await firebaseGet(`shops/${subdomain}`);

  if (!shop) {
    throw new AppError("Toko tidak ditemukan", 404);
  }

  if (!shop.active) {
    throw new AppError("Toko tidak aktif", 403);
  }

  if (!shop.sheetUrl || !shop.sheetId) {
    await log(
      "SHOP_MISSING_SHEET",
      { subdomain, shop },
      requestId
    );
    throw new AppError("Toko belum memiliki data produk", 500);
  }

  /* ------------------------------------------------------------------
   * 3️⃣ LOAD PRODUCT (CSV)
   * ------------------------------------------------------------------ */
  let csvText;
  try {
    const csvUrl = convertSheetToCSVUrl(shop.sheetUrl);
    csvText = await fetchRetry(csvUrl);
  } catch (err) {
    await log(
      "SHEET_FETCH_FAILED",
      { subdomain, error: err.message },
      requestId
    );
    throw new AppError("Gagal memuat data produk", 502);
  }

  /* ------------------------------------------------------------------
   * 4️⃣ PARSE CSV
   * ------------------------------------------------------------------ */
  let products;
  try {
    products = parseCSV(csvText);
  } catch (err) {
    await log(
      "CSV_PARSE_FAILED",
      { subdomain, error: err.message },
      requestId
    );
    throw new AppError("Format produk tidak valid", 500);
  }

  if (!Array.isArray(products)) {
    throw new AppError("Data produk rusak", 500);
  }

  /* ------------------------------------------------------------------
   * 5️⃣ SUCCESS LOG
   * ------------------------------------------------------------------ */
  await log(
    "GET_SHOP_SUCCESS",
    { subdomain, totalProducts: products.length },
    requestId
  );

  /* ------------------------------------------------------------------
   * 6️⃣ RETURN CANONICAL RESPONSE
   * ------------------------------------------------------------------ */
  return {
    success: true,
    shop: {
      name: shop.name,
      wa: shop.wa,
      email: shop.email,
      subdomain: shop.subdomain,
      theme: shop.theme,
    },
    products,
    requestId,
  };
}

