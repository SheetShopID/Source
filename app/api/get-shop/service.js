import { firebaseGet } from "@/lib/firebase";
import { parseCSV, convertSheetToCSVUrl } from "@/lib/csv";
import { getCache, setCache } from "@/lib/cache";

export async function getShopService(shop) {
	const requestId = crypto.randomUUID();
	
  if (!shop) {
    throw new Error("Parameter shop wajib diisi");
  }

  // =========================
  // CACHE (60s)
  // =========================
  const cached = getCache(`shop:${shop}`);
  if (cached) return cached;

  // =========================
  // FIREBASE
  // =========================
  const shopData = await firebaseGet(`shops/${shop}`);

  if (!shopData || !shopData.active) {
    throw new Error("Toko tidak ditemukan atau tidak aktif");
  }

  // =========================
  // GOOGLE SHEET → PRODUCTS
  // =========================
  let products = [];

  if (shopData.sheetId || shopData.sheetUrl) {
    try {
      const csvUrl = shopData.sheetId
        ? `https://docs.google.com/spreadsheets/d/${shopData.sheetId}/export?format=csv`
        : convertSheetToCSVUrl(shopData.sheetUrl);

      const csvRes = await fetch(csvUrl, { cache: "no-store" });
      if (!csvRes.ok) throw new Error("CSV tidak bisa diakses");

      const csvText = await csvRes.text();
      const parsed = parseCSV(csvText);

      products = parsed
        .filter((p) => p.name && p.status !== "off")
        .map((p) => ({
          name: p.name,
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
		  "GET_SHOP_ERROR",
		  { message: err.message, shop },
		  requestId,
		  "error",
		  "get-shop"
		);
		
      console.warn("[GET-SHOP] Sheet error:", err.message);
      products = [];
	
    }
  }

  const response = {
    shop: {
      name: shopData.name,
      wa: shopData.wa,
      theme: shopData.theme,
      subdomain: shopData.subdomain,
    },
    products,
  };

  setCache(`shop:${shop}`, response);
  return response;
}
