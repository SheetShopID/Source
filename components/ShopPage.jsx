"use client";
import { useEffect, useState, useMemo } from "react";
import JastipTemplate from "./templates/JastipTemplate";
import FoodTemplate from "./templates/FoodTemplate";
import LaundryTemplate from "./templates/LaundryTemplate";

/******************************
 * UTILS
 ******************************/
export const Utils = {
  formatRp: (v) =>
    isNaN(v) ? "Rp0" : "Rp" + v.toLocaleString("id-ID"),
};

/******************************
 * CSV PARSER
 ******************************/
function parseCSV(text) {
  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n");

  if (lines.length === 0) return [];

  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().toLowerCase());

  const result = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const cols = lines[i].split(",");
    const product = {};

    headers.forEach((header, index) => {
      let val = cols[index] ? cols[index].trim() : "";

      if (header === "price" || header === "fee") {
        val = parseInt(val.replace(/\D/g, "")) || 0;
      }

      product[header] = val;
    });

    if (product.name) result.push(product);
  }

  return result;
}

/******************************
 * GOOGLE SHEET → CSV URL
 ******************************/
function convertSheetToCSVUrl(url) {
  try {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) return url;
    return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv&gid=0`;
  } catch {
    return url;
  }
}

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
        <Template products={products} utils={Utils} />
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
