"use client";
import { useEffect, useState, useMemo } from "react";
import JastipTemplate from "./templates/JastipTemplate";
import FoodTemplate from "./templates/FoodTemplate";
import LaundryTemplate from "./templates/LaundryTemplate";

export const Utils = {
  formatRp: (v) => (isNaN(v) ? "Rp0" : "Rp" + v.toLocaleString("id-ID")),
};

// CSV Parser (Robust)
function parseCSV(text) {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  if (lines.length === 0) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    // Simple split (sesuai desain preview sederhana) tes
    // Jika butuh robust parsing untuk koma dalam kutip, gunakan kode robust sebelumnya
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

export default function ShopPage({ shop }) {
  const [shopData, setShopData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/get-shop?shop=${shop}`);
        if (!res.ok) throw new Error("Toko tidak ditemukan");
        
        const data = await res.json();
        setShopData(data);

        if (data.sheetUrl) {
          const csvUrl = convertSheetToCSVUrl(data.sheetUrl);
          const csvRes = await fetch(csvUrl);
          if (!csvRes.ok) throw new Error("Gagal ambil data CSV");
          
          const csvText = await csvRes.text();
          const parsed = parseCSV(csvText);

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

  if (loading) return <div className="p-10 text-center text-gray-500">Memuat toko...</div>;
  if (!shopData) return <div className="p-10 text-center text-red-500">Toko tidak ditemukan</div>;

  // Mapping Warna Tema (Sesuai CSS Preview)
  const themeColors = {
    jastip: { header: "bg-[#db2777]", text: "text-[#831843]", bg: "bg-[#fdf2f8]" },
    makanan: { header: "bg-[#ea580c]", text: "text-[#7c2d12]", bg: "bg-[#fff7ed]" },
    laundry: { header: "bg-[#0284c7]", text: "text-[#0c4a6e]", bg: "bg-[#f0f9ff]" },
  };

  const currentTheme = themeColors[shopData.theme] || themeColors.jastip;

  return (
    <main className={`min-h-screen pb-24 font-sans ${currentTheme.bg}`}>
      {/* HEADER STICKY (Sesuai Preview) */}
      <header className={`${currentTheme.header} text-white sticky top-0 z-50 shadow-sm transition-colors`}>
        <div className="p-4 pb-5 pt-[40px]"> /* Padding Top untuk clear notich header */
          <h1 className="text-xl font-bold text-center">{shopData.name}</h1>
          <p className="text-center text-xs opacity-90 mt-1">{shop.name}.tokoinstan.online</p>
        </div>
      </header>

      {/* RENDER TEMPLATE YANG DIPILIH */}
      <Template products={products} utils={Utils} />

      {/* FLOATING WHATSAPP BUTTON */}
      <a 
        href={`https://wa.me/${shopData.wa}`} 
        target="_blank"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-3xl hover:scale-110 transition-transform z-50"
      >
        💬
      </a>
    </main>
  );
}
