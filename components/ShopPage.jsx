"use client";
import { useEffect, useState, useMemo } from "react";
import JastipTemplate from "./templates/JastipTemplate";
import FoodTemplate from "./templates/FoodTemplate";
import LaundryTemplate from "./templates/LaundryTemplate";
import { formatRp } from "@/lib/utils";
import { parseCSV, convertSheetToCSVUrl } from "@/lib/csv";
 
/******************************
 * MAIN COMPONENT
 ******************************/
export default function ShopPage({ shop }) {
  const [shopData, setShopData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /******************************
   * LOAD DATA
   ******************************/
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`/api/get-shop?shop=${shop}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Toko tidak ditemukan");
        }

        const shopJson = await res.json();
        setShopData(shopJson);

        // Load products from Google Sheet
        if (shopJson.sheetUrl) {
          const csvUrl = convertSheetToCSVUrl(shopJson.sheetUrl);
          const csvRes = await fetch(csvUrl);

          if (!csvRes.ok) {
            throw new Error("Gagal mengambil data produk");
          }

          const csvText = await csvRes.text();
          const parsed = parseCSV(csvText);

          setProducts(
            parsed.map((p) => ({
              name: p.name,
              price: p.price || 0,
              img: p.img || "",
              fee: p.fee || 0,
              category: p.category || "",
              promo: p.promo || "",
            }))
          );
        }
      } catch (e) {
        console.error("[SHOP PAGE]", e);
        setError(e.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [shop]);

  /******************************
   * TEMPLATE SELECTOR
   ******************************/
  const Template = useMemo(() => {
    if (!shopData) return null;

    switch (shopData.theme) {
      case "makanan":
        return FoodTemplate;
      case "laundry":
        return LaundryTemplate;
      default:
        return JastipTemplate;
    }
  }, [shopData]);

  /******************************
   * UI STATES
   ******************************/
  if (loading) {
    return <div className="p-10 text-center text-gray-500">Memuat toko...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-600">{error}</div>;
  }

  if (!shopData) {
    return <div className="p-10 text-center text-red-600">Toko tidak ditemukan</div>;
  }

  /******************************
   * RENDER
   ******************************/
  return (
    <main>
      <header className={`app-header theme-${shopData.theme}`}>
        <div className="pt-[40px] pb-4 px-4 text-center">
          <h1 className="shop-name">{shopData.name}</h1>
          <div className="shop-tagline">
            {shopData.subdomain}.tokoinstan.online
          </div>
        </div>
      </header>

      <div className={`app-content theme-${shopData.theme}`}>
        <Template products={products} utils={{ formatRp }} />
      </div>

      <a
        href={`https://wa.me/${shopData.wa}`}
        target="_blank"
        rel="noopener noreferrer"
        className="float-wa"
      >
        💬
      </a>
    </main>
  );
}
