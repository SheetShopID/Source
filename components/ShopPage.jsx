"use client";
import { useEffect, useState, useMemo } from "react";
import JastipTemplate from "./templates/JastipTemplate";
import FoodTemplate from "./templates/FoodTemplate";
import LaundryTemplate from "./templates/LaundryTemplate";

/******************************
 *  UTILS  *
 ******************************/
export const Utils = {
  formatRp: (v) => (isNaN(v) ? "Rp0" : "Rp" + v.toLocaleString("id-ID")),
};

/******************************
 *  CSV PARSER (ROBUST)      *
 ******************************/
function parseCSV(text) {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  if (lines.length === 0) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    // Logic robust untuk handle koma di dalam kutip "..."
    const rowValues = [];
    let currentValue = "";
    let inQuotes = false;

    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        rowValues.push(currentValue.trim());
        currentValue = "";
      } else {
        currentValue += char;
      }
    }
    rowValues.push(currentValue.trim());

    const product = {};
    headers.forEach((header, index) => {
      let val = rowValues[index] || "";
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      
      // Konversi angka
      if (header === "price" || header === "fee") {
        val = parseInt(val.replace(/\D/g, "")) || 0;
      }
      product[header] = val;
    });

    if (product.name) result.push(product);
  }
  return result;
}

// Helper untuk convert URL Sheet biasa menjadi Link Download CSV
function convertSheetToCSVUrl(url) {
  try {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) return url;
    const sheetId = match[1];
    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
  } catch (error) {
    return url;
  }
}

/******************************
 *  SHOP PAGE COMPONENT      *
 ******************************/
export default function ShopPage({ shop }) {
  const [shopData, setShopData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // 1. Fetch Data Toko (Config)
        const res = await fetch(`/api/get-shop?shop=${shop}`);
        if (!res.ok) throw new Error("Toko tidak ditemukan");
        
        const data = await res.json();
        setShopData(data);

        if (data.sheetUrl) {
          // 2. Convert & Fetch CSV
          const csvUrl = convertSheetToCSVUrl(data.sheetUrl);
          const csvRes = await fetch(csvUrl);
          
          if (!csvRes.ok) throw new Error("Gagal ambil data CSV");
          
          const csvText = await csvRes.text();
          const parsed = parseCSV(csvText);

          // 3. Mapping Data (Case-insensitive aman)
          const mapped = parsed.map((p) => ({
            name: p.name || p.Name,
            price: Number(p.price || p.Price) || 0,
            img: p.img || p.Img,
            fee: Number(p.fee || p.Fee) || 0,
            category: p.category || p.Category,
            promo: p.promo || p.Promo,
          }));

          setProducts(mapped);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [shop]);

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

  if (loading) return <p style={{ padding: 20 }}>⏳ Memuat toko...</p>;
  if (!shopData) return <p>Toko tidak ditemukan</p>;

  return (
    <Template
      shop={shopData}
      products={products}
      utils={Utils}
    />
  );
}
