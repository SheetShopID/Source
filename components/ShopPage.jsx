"use client";
import { useEffect, useState, useMemo } from "react";
import JastipTemplate from "./templates/JastipTemplate";
import FoodTemplate from "./templates/FoodTemplate";
import LaundryTemplate from "./templates/LaundryTemplate";

export const Utils = {
  formatRp: (v) => (isNaN(v) ? "Rp0" : "Rp" + v.toLocaleString("id-ID")),
};

// --- CSV PARSER & UTILS ---
function parseCSV(text) {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  if (lines.length === 0) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const cols = lines[i].split(","); // Simple split, upgrade logic if needed

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

// --- MAIN COMPONENT ---
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

  if (loading) return <div className="h-screen flex items-center justify-center text-gray-400">Memuat toko...</div>;
  if (!shopData) return <div className="h-screen flex items-center justify-center text-red-500 font-bold">Toko tidak ditemukan</div>;

  // --- THEME CONFIG (MENJAGA TAMPILAN SAMA DENGAN PREVIEW) ---
  // Kita mapping warna dari CSS Preview ke Tailwind classes
  const themeConfig = {
    jastip: {
      bg: "bg-[#fdf2f8]",      // --theme-bg
      header: "bg-[#db2777]",   // --theme-header
      text: "text-[#831843]",  // --theme-text
      accent: "text-[#be185d]", // --theme-accent
      btn: "bg-[#be185d]"
    },
    makanan: {
      bg: "bg-[#fff7ed]",      // --theme-bg
      header: "bg-[#ea580c]",   // --theme-header
      text: "text-[#7c2d12]",  // --theme-text
      accent: "text-[#c2410c]", // --theme-accent
      btn: "bg-[#c2410c]"
    },
    laundry: {
      bg: "bg-[#f0f9ff]",      // --theme-bg
      header: "bg-[#0284c7]",   // --theme-header
      text: "text-[#0c4a6e]",  // --theme-text
      accent: "text-[#0369a1]", // --theme-accent
      btn: "bg-[#0369a1]"
    },
  };

  const currentTheme = themeConfig[shopData.theme] || themeConfig.jastip;

  return (
    <main className={`min-h-screen pb-24 font-sans ${currentTheme.bg} text-[#1e293b]`}>
      
      {/* HEADER STICKY (Sama persis dengan CSS Preview) */}
      <header className={`${currentTheme.header} sticky top-0 z-50 shadow-sm transition-colors duration-200`}>
        {/* pt-[40px] mensimulasikan notch di HP */}
        <div className="pt-[40px] pb-4 px-4 text-center">
          <h1 className={`text-[1.25rem] font-bold text-white leading-tight`}>
            {shopData.name}
          </h1>
          <div className="text-[0.75rem] text-white opacity-90 mt-1">
            {shop.name}.tokoinstan.online
          </div>
        </div>
      </header>

      {/* KONTEN PRODUK */}
      {/* Kita passing themeConfig ke Template agar text & warnanya match */}
      <Template 
        products={products} 
        utils={Utils} 
        theme={currentTheme}
      />

      {/* FLOATING WA BUTTON */}
      <a 
        href={`https://wa.me/${shopData.wa}`} 
        target="_blank"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] flex items-center justify-center text-3xl hover:scale-110 transition-transform z-50"
      >
        💬
      </a>
    </main>
  );
}
