"use client";
import { useState } from "react";

/******************************
 * LIVE PREVIEW COMPONENT (MOBILE SIMULATION)
 ******************************/
function ThemePreview({ theme }) {
  // --- THEME CONFIG (Warna Header & Accent) ---
  const themeConfig = {
    jastip: { header: "#db2777", accent: "#fbcfe8", icon: "🛍️" }, // Pink
    makanan: { header: "#ea580c", accent: "#ffedd5", icon: "🍔" }, // Orange
    laundry: { header: "#0284c7", accent: "#e0f2fe", icon: "🧺" }, // Blue
  };

  const config = themeConfig[theme];

  // --- DUMMY PRODUCTS (Simulasi Data) ---
  const products = [
    { id: 1, name: "Kemeja Flanel Kotak", price: "85.000", fee: "5.000", img: "https://picsum.photos/seed/shirt/150/150", promo: "Promo" },
    { id: 2, name: "Dress Musim Panas", price: "150.000", fee: "10.000", img: "https://picsum.photos/seed/dress/150/150", promo: "" },
    { id: 3, name: "Celana Chino Panjang", price: "120.000", fee: "8.000", img: "https://picsum.photos/seed/pants/150/150", promo: "" },
    { id: 4, name: "Tas Selempang Kulit", price: "75.000", fee: "5.000", img: "https://picsum.photos/seed/bag/150/150", promo: "Sale" },
    { id: 5, name: "Topi Bucket", price: "35.000", fee: "2.000", img: "https://picsum.photos/seed/hat/150/150", promo: "" },
  ];

  return (
    <div className="phone-screen">
      {/* 1. APP HEADER (Sticky) */}
      <div className="app-header" style={{ backgroundColor: config.header }}>
        <div className="app-shop-name">Nama Toko Anda</div>
        <div className="app-shop-url">tokoku.tokoinstan.online</div>
      </div>

      {/* 2. APP CONTENT (Scrollable) */}
      <div className="app-content">
        
        {/* RENDER JASTIP (GRID) */}
        {theme === "jastip" && (
          <div className="product-grid">
            {products.map((p) => (
              <div key={p.id} className="product-card jastip-card">
                <div className="product-img-wrapper">
                  <img src={p.img} alt={p.name} className="product-img" />
                  {p.promo && <span className="badge-promo">{p.promo}</span>}
                </div>
                <div className="product-info">
                  <h4>{p.name}</h4>
                  <div className="price-row">
                    <span className="price">Rp{p.price}</span>
                    {p.fee && <span className="fee">+{p.fee}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RENDER MAKANAN (LIST HORIZONTAL) */}
        {theme === "makanan" && (
          <div className="food-list">
            {products.map((p) => (
              <div key={p.id} className="food-card">
                <img src={p.img} alt={p.name} className="food-img" />
                <div className="food-details">
                  <h4>{p.name}</h4>
                  <p className="food-cat">Menu Spesial</p>
                  <div className="food-price">Rp{p.price}</div>
                  {p.promo && <span className="food-promo">💥 {p.promo}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RENDER LAUNDRY (CLEAN LIST) */}
        {theme === "laundry" && (
          <div className="laundry-list">
            {products.map((p) => (
              <div key={p.id} className="laundry-item">
                <div className="laundry-icon">{config.icon}</div>
                <div className="laundry-text">
                  <h4>{p.name}</h4>
                  <span className="laundry-cat">Layanan Cuci</span>
                </div>
                <div className="laundry-price">Rp{p.price}</div>
              </div>
            ))}
          </div>
        )}

        {/* 3. SCROLL HINT */}
        <div className="scroll-hint">Scroll down for more...</div>
      </div>
    </div>
  );
}

/******************************
 * REGISTER PAGE
 ******************************/
export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    wa: "",
    sheetUrl: "",
    subdomain: "",
    theme: "jastip",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register-shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Gagal mendaftar");
        setLoading(false);
        return;
      }

      window.location.href = json.redirect;
    } catch {
      setError("Terjadi kesalahan koneksi");
      setLoading(false);
    }
  }

  return (
    <div className="wrapper">
      
      {/* KIRI: FORM REGISTER */}
      <div className="form-side">
        <div className="form-header">
          <h1 className="title">Tokoinstan.</h1>
          <p className="subtitle">Buat toko onlinemu sendiri dengan fitur katalog keren.</p>
        </div>

        <form onSubmit={submit} className="glass-form">
          <div className="input-group">
            <label>Nama Toko</label>
            <input name="name" placeholder="Contoh: Jastip Seoul Keren" onChange={onChange} value={form.name} required />
          </div>

          <div className="input-group">
            <label>Nomor WhatsApp</label>
            <input name="wa" placeholder="62812345678" onChange={onChange} value={form.wa} required />
          </div>

          <div className="input-group">
            <label>Link Google Sheet (CSV)</label>
            <input name="sheetUrl" placeholder="https://docs.google.com/spreadsheets/d/..." onChange={onChange} value={form.sheetUrl} required />
          </div>

          <div className="input-group">
            <label>Subdomain Toko</label>
            <div className="input-wrapper">
              <input name="subdomain" placeholder="namatoko" onChange={onChange} value={form.subdomain} required />
              <span className="suffix">.tokoinstan.online</span>
            </div>
          </div>

          <div className="input-group">
            <label>Pilih Tema</label>
            <select name="theme" onChange={onChange} value={form.theme} className="select-box">
              <option value="jastip">🛍️ Jastip (Pink & Grid)</option>
              <option value="makanan">🍔 Makanan (Orange & Menu)</option>
              <option value="laundry">🧺 Laundry (Blue & List)</option>
            </select>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? "Memproses..." : "Buat Toko Sekarang"}
          </button>
        </form>
      </div>

      {/* KANAN: PHONE MOCKUP (THE REAL PREVIEW) */}
      <div className="preview-side">
        <div className="device-mockup">
          {/* NOTCH / ISLAND */}
          <div className="notch"></div>
          
          {/* SCREEN CONTENT */}
          <ThemePreview theme={form.theme} />
        </div>
        <p className="preview-text">Simulasi tampilan asli di HP</p>
      </div>

      {/* STYLING SYSTEM */}
      <style jsx>{`
        /* LAYOUT UTAMA */
        .wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 80px;
          padding: 60px 20px;
          min-height: 100vh;
          background: #f3f4f6;
        }

        /* --- KIRI: FORM --- */
        .form-side {
          width: 100%;
          max-width: 480px;
        }

        .title {
          font-size: 36px;
          font-weight: 800;
          background: linear-gradient(to right, #2563eb, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .subtitle { font-size: 16px; color: #6b7280; margin-bottom: 32px; }

        .glass-form {
          background: white;
          padding: 32px;
          border-radius: 24px;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }

        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-weight: 600; font-size: 14px; margin-bottom: 8px; color: #374151; }
        
        .input-wrapper { position: relative; }
        .input-wrapper input { padding-right: 140px; }
        .suffix { 
          position: absolute; right: 16px; top: 50%; transform: translateY(-50%); 
          color: #9ca3af; font-size: 13px; pointer-events: none; font-weight: 600;
        }

        input, select {
          width: 100%;
          padding: 14px;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          font-size: 15px;
          background: #f9fafb;
          transition: all 0.2s;
        }
        input:focus, select:focus { outline: none; border-color: #2563eb; background: white; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }

        .select-box { cursor: pointer; background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.5em 1.5em; }

        .error-msg { background: #fee2e2; color: #991b1b; padding: 12px; border-radius: 8px; font-size: 14px; margin-bottom: 20px; }
        
        .btn-submit {
          width: 100%;
          padding: 16px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.1s;
        }
        .btn-submit:active { transform: scale(0.98); }
        .btn-submit:disabled { background: #9ca3af; cursor: not-allowed; }


        /* --- KANAN: PHONE MOCKUP --- */
        .preview-side { display: flex; flex-direction: column; align-items: center; }

        .device-mockup {
          width: 340px; /* Lebar layar HP */
          height: 680px; /* Tinggi layar HP */
          background: #000; /* Warna bezel */
          border-radius: 40px;
          padding: 12px; /* Ketebalan bezel */
          box-shadow: 0 30px 60px -10px rgba(0,0,0,0.4);
          position: relative;
          border: 4px solid #1f2937;
        }

        .notch {
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 24px;
          background: #000;
          border-bottom-left-radius: 16px;
          border-bottom-right-radius: 16px;
          z-index: 50;
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          background: #fff;
          border-radius: 28px; /* Sudut layar dalam */
          overflow: hidden;
          overflow-y: auto; /* Allow Scroll */
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Hide Scrollbar */
        .phone-screen::-webkit-scrollbar { display: none; }

        .preview-text { margin-top: 20px; color: #6b7280; font-size: 14px; font-weight: 500; }


        /* --- APP HEADER (DI DALAM PREVIEW) --- */
        .app-header {
          padding: 50px 16px 16px 16px; /* Top padding untuk notch */
          text-align: center;
          color: white;
        }
        .app-shop-name { font-size: 16px; font-weight: 700; }
        .app-shop-url { font-size: 11px; opacity: 0.8; margin-top: 2px; }


        /* --- APP CONTENT STYLES --- */
        .app-content { padding: 16px; }

        /* 1. GRID JASTIP */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .product-card {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .product-img-wrapper { position: relative; aspect-square; background: #eee; }
        .product-img { width: 100%; height: 100%; object-fit: cover; }
        .badge-promo { position: absolute; top: 4px; left: 4px; background: rgba(0,0,0,0.6); color: white; font-size: 9px; padding: 2px 4px; border-radius: 4px; }
        .product-info { padding: 8px; }
        .product-info h4 { font-size: 11px; margin: 0 0 4px 0; font-weight: 600; color: #333; line-height: 1.3; }
        .price-row { display: flex; justify-content: space-between; align-items: center; }
        .price { font-size: 12px; font-weight: 700; color: #db2777; }
        .fee { font-size: 9px; color: #666; background: #fce7f3; padding: 1px 3px; border-radius: 3px; }

        /* 2. LIST MAKANAN */
        .food-list { display: flex; flex-direction: column; gap: 12px; }
        .food-card { display: flex; gap: 12px; background: white; border-radius: 12px; padding: 8px; border: 1px solid #f3f4f6; }
        .food-img { width: 70px; height: 70px; border-radius: 10px; object-fit: cover; }
        .food-details { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .food-details h4 { margin: 0; font-size: 13px; font-weight: 600; color: #333; }
        .food-cat { font-size: 10px; color: #888; margin: 2px 0; }
        .food-price { font-size: 15px; font-weight: 700; color: #ea580c; }
        .food-promo { font-size: 10px; font-weight: bold; color: #b45309; margin-top: 4px; display: block; }

        /* 3. LIST LAUNDRY */
        .laundry-list { display: flex; flex-direction: column; gap: 8px; }
        .laundry-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
        .laundry-icon { width: 32px; height: 32px; background: #e0f2fe; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .laundry-text { flex: 1; }
        .laundry-text h4 { margin: 0; font-size: 13px; font-weight: 600; color: #334155; }
        .laundry-cat { font-size: 10px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; }
        .laundry-price { font-weight: 700; color: #0284c7; font-size: 14px; }

        .scroll-hint { text-align: center; padding: 20px; color: #bbb; font-size: 11px; animation: pulse 2s infinite; }

        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }

        @media (max-width: 900px) {
          .wrapper { flex-direction: column-reverse; gap: 40px; }
          .form-side, .preview-side { width: 100%; max-width: 100%; }
        }
      `}</style>
    </div>
  );
}
