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

        // 1. Fetch shop info
        const res = await fetch(`/api/get-shop?shop=${shop}`);
        const json = await res.json();

        if (!json.success) {
          throw new Error(json.error || "Toko tidak ditemukan");
        }

        setShopData(json.data);

        // 2. Fetch CSV products
        if (json.data.sheetUrl) {
          const csvUrl = convertSheetToCSVUrl(json.data.sheetUrl);
          const csvRes = await fetch(csvUrl);

          if (!csvRes.ok) {
            throw new Error("Gagal mengambil data produk");
          }

          const csvText = await csvRes.text();
          const parsed = parseCSV(csvText);

          const mapped = parsed.map((p) => ({
            name: p.name,
            price: p.price || 0,
            img: p.img || "",
            fee: p.fee || 0,
            category: p.category || "",
            promo: p.promo || "",
          }));

          setProducts(mapped);
        }
      } catch (e) {
        console.error("[SHOP PAGE]", e);
        setError(e.message);
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

  const memoProducts = useMemo(() => products, [products]);

  /******************************
   * UI STATES
   ******************************/
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Memuat toko...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!shopData) {
    return (
      <div className="p-10 text-center text-red-600">
        Toko tidak ditemukan
      </div>
    );
  }

  const themeClass = `theme-${shopData.theme}`;

  /******************************
   * RENDER
   ******************************/
  return (
    <main>
      {/* HEADER */}
      <header className={`app-header ${themeClass}`}>
        <div className="pt-[40px] pb-4 px-4 text-center">
          <h1 className="shop-name">{shopData.name}</h1>
          <div className="shop-tagline">
            {shopData.subdomain}.tokoinstan.online
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className={`app-content ${themeClass}`}>
        <Template products={memoProducts} utils={Utils} />
      </div>

      {/* FLOATING WA */}
      <a
        href={`https://wa.me/${shopData.wa}`}
        target="_blank"
        rel="noopener noreferrer"
        className="float-wa"
      >
        💬
      </a>

      {/* GLOBAL THEME VARIABLES */}
      <style jsx global>{`
        :root {
          --text-main: #1e293b;
          --text-muted: #64748b;
          --white: #ffffff;
        }

        .theme-jastip {
          --theme-header: #db2777;
          --theme-bg: #fdf2f8;
          --theme-accent: #be185d;
        }

        .theme-makanan {
          --theme-header: #ea580c;
          --theme-bg: #fff7ed;
          --theme-accent: #c2410c;
        }

        .theme-laundry {
          --theme-header: #0284c7;
          --theme-bg: #f0f9ff;
          --theme-accent: #0369a1;
        }

        * {
          box-sizing: border-box;
        }

        body {
          font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      {/* PAGE STYLES */}
      <style jsx>{`
        main {
          min-height: 100vh;
          background: var(--theme-bg);
          padding-bottom: 80px;
        }

        .app-header {
          background: var(--theme-header);
          color: white;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .shop-name {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .shop-tagline {
          font-size: 0.75rem;
          opacity: 0.9;
          margin-top: 4px;
        }

        .app-content {
          padding: 16px;
          min-height: 100vh;
        }

        .float-wa {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #25d366;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
          text-decoration: none;
          z-index: 50;
        }
      `}</style>
    </main>
  );
}
