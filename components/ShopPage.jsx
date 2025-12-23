"use client";
import { useEffect, useState, useMemo } from "react";
import JastipTemplate from "./templates/JastipTemplate";
import FoodTemplate from "./templates/FoodTemplate";
import LaundryTemplate from "./templates/LaundryTemplate";

export const Utils = {
  formatRp: (v) => (isNaN(v) ? "Rp0" : "Rp" + v.toLocaleString("id-ID")),
};

// --- LOGIC UTAMA ---
function parseCSV(text) {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  if (lines.length === 0) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cols = lines[i].split(",");
    const product = {};
    headers.forEach((header, index) => {
      let val = cols[index] ? cols[index].trim() : "";
      if (header === "price" || header === "fee") val = parseInt(val.replace(/\D/g, "")) || 0;
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
    return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv&gid=0`;
  } catch (error) {
    return url;
  }
}

// --- COMPONENT ---
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
      case "makanan": return FoodTemplate;
      case "laundry": return LaundryTemplate;
      default: return JastipTemplate;
    }
  }, [shopData]);

  if (loading) return <div className="p-10 text-center">Memuat toko...</div>;
  if (!shopData) return <div className="p-10 text-center text-red-500">Toko tidak ditemukan</div>;

  // Tentukan Class Tema (Class ini mengacu ke CSS di bawah)
  const themeClass = `theme-${shopData.theme}`;

  return (
    <main>
      {/* Header Menggunakan Class dari CSS di bawah */}
      <header className={`app-header ${themeClass}`}>
        {/* pt-[40px] mensimulasikan Notch HP */}
        <div className="pt-[40px] pb-4 px-4 text-center">
          <h1 className="shop-name">{shopData.name}</h1>
          <div className="shop-tagline">{shop.name}.tokoinstan.online</div>
        </div>
      </header>

      {/* Content Wrapper */}
      <div className={`app-content ${themeClass}`}>
        <Template products={products} utils={Utils} />
      </div>

      {/* Floating WA */}
      <a href={`https://wa.me/${shopData.wa}`} target="_blank" className="float-wa">
        💬
      </a>

      {/* --- CSS VARIABLES & STYLES (Di sini Class mengarahnya) --- */}
      <style jsx global>{`
        /* VARIABLES */
        :root {
          --text-main: #1e293b;
          --text-muted: #64748b;
          --white: #ffffff;
        }

        /* THEME JASTIP */
        .theme-jastip {
          --theme-header: #db2777;
          --theme-bg: #fdf2f8;
          --theme-text: #831843;
          --theme-accent: #be185d;
        }

        /* THEME MAKANAN */
        .theme-makanan {
          --theme-header: #ea580c;
          --theme-bg: #fff7ed;
          --theme-text: #7c2d12;
          --theme-accent: #c2410c;
        }

        /* THEME LAUNDRY */
        .theme-laundry {
          --theme-header: #0284c7;
          --theme-bg: #f0f9ff;
          --theme-text: #0c4a6e;
          --theme-accent: #0369a1;
        }

        /* GLOBAL RESET */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
      `}</style>

      <style jsx>{`
        /* --- LAYOUT --- */
        main {
          min-height: 100vh;
          background-color: var(--theme-bg);
          color: var(--text-main);
          padding-bottom: 80px; /* Space untuk WA Button */
        }

        /* --- HEADER STICKY --- */
        .app-header {
          background: var(--theme-header);
          color: white;
          position: sticky;
          top: 0;
          z-index: 50;
          transition: background 0.3s;
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

        /* --- CONTENT WRAPPER --- */
        .app-content {
          padding: 16px;
          min-height: 100vh;
        }

        /* --- FLOATING BUTTON --- */
        .float-wa {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #25D366;
          color: white;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.2);
          text-decoration: none;
          z-index: 50;
        }
      `}</style>
    </main>
  );
}
