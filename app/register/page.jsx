"use client";
import { useState, useRef } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    wa: "",
    sheetUrl: "",
    subdomain: "",
    theme: "jastip",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const timeoutRef = useRef(null);

  /******************************
   * HANDLERS
   ******************************/
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubdomainChange = (e) => {
    const val = e.target.value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");
    setForm((f) => ({ ...f, subdomain: val }));
  };

  const handleThemeSelect = (theme) => setForm((f) => ({ ...f, theme }));

  /******************************
   * VALIDASI FORM
   ******************************/
  const validateForm = () => {
    if (!form.name.trim()) return "Nama toko wajib diisi.";
    if (!/^\d{8,15}$/.test(form.wa)) return "Nomor WhatsApp hanya angka (8-15 digit).";
    if (!form.sheetUrl.startsWith("https://docs.google.com/"))
      return "Link Google Sheet tidak valid.";
    if (!form.subdomain.trim()) return "Subdomain wajib diisi.";
    if (!/^[a-z0-9-]+$/.test(form.subdomain))
      return "Subdomain hanya boleh huruf, angka, dan tanda minus (-).";
    return null;
  };

  /******************************
   * SUBMIT FORM
   ******************************/
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      showToast(validationError, "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register-shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        showToast(json.error || "Gagal mendaftar toko.", "error");
        setLoading(false);
        return;
      }

      showToast("Selamat! Tokomu berhasil dibuat 🎉", "success");
      setTimeout(() => {
        window.location.href = json.redirect;
      }, 1500);
    } catch (err) {
      showToast("Terjadi kesalahan koneksi ke server.", "error");
      setLoading(false);
    }
  };

  /******************************
   * TOAST NOTIFICATION
   ******************************/
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  /******************************
   * DUMMY PREVIEW ITEMS
   ******************************/
  const getPreviewItems = (theme) => {
    const defaults = [
      { img: "https://picsum.photos/seed/prod1/100/100", name: "Kemeja Flanel Kotak", meta: "Fee: Rp 5.000", price: "Rp 85.000", promo: "Promo" },
      { img: "https://picsum.photos/seed/prod2/100/100", name: "Dress Musim Panas", meta: "Fee: Rp 10.000", price: "Rp 150.000", promo: "" },
      { img: "https://picsum.photos/seed/prod3/100/100", name: "Celana Chino Panjang", meta: "Fee: Rp 8.000", price: "Rp 120.000", promo: "" },
    ];

    const variants = {
      makanan: [
        { img: "https://picsum.photos/seed/food1/100/100", name: "Paket Ayam Bakar Madu", meta: "Menu Spesial", price: "Rp 35.000", promo: "" },
        { img: "https://picsum.photos/seed/food2/100/100", name: "Es Kopi Susu Gula Aren", meta: "Minuman", price: "Rp 18.000", promo: "Diskon" },
        { img: "https://picsum.photos/seed/food3/100/100", name: "Nasi Goreng Spesial", meta: "Makanan Berat", price: "Rp 22.000", promo: "" },
      ],
      laundry: [
        { img: "https://picsum.photos/seed/laun1/100/100", name: "Cuci Komplit (Kg)", meta: "Layanan Cuci", price: "Rp 7.000", promo: "" },
        { img: "https://picsum.photos/seed/laun2/100/100", name: "Cuci Bed Cover", meta: "Satuan", price: "Rp 25.000", promo: "" },
        { img: "https://picsum.photos/seed/laun3/100/100", name: "Setrika Saja", meta: "Layanan", price: "Rp 5.000", promo: "" },
      ],
    };

    return variants[theme] || defaults;
  };

  const previewData = getPreviewItems(form.theme);

  /******************************
   * RENDER
   ******************************/
  return (
    <>
      <div className="container">
        <header className="header">
          <h1>Tokoinstan</h1>
          <p>Buat toko onlinemu sendiri dalam hitungan detik.</p>
        </header>

        <div className="split-layout">
          {/* FORM SIDE */}
          <section className="form-column">
            <div className="card">
              <form onSubmit={handleSubmit}>
                {/* Nama Toko */}
                <div className="form-group">
                  <label className="form-label">Nama Toko</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Contoh: Jastip Seoul Keren"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Nomor WA */}
                <div className="form-group">
                  <label className="form-label">Nomor WhatsApp</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="81234567890"
                    name="wa"
                    value={form.wa}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Subdomain */}
                <div className="form-group">
                  <label className="form-label">Subdomain Toko</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="tokosaya"
                      name="subdomain"
                      value={form.subdomain}
                      onChange={handleSubdomainChange}
                      required
                    />
                    <span className="input-suffix">.tokoinstan.online</span>
                  </div>
                </div>

                {/* Google Sheet */}
                <div className="form-group">
                  <label className="form-label">Link Google Sheet (CSV)</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    name="sheetUrl"
                    value={form.sheetUrl}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Theme */}
                <div className="form-group">
                  <label className="form-label">Pilih Tema</label>
                  <div className="theme-grid">
                    {["jastip", "makanan", "laundry"].map((t) => (
                      <div
                        key={t}
                        className={`theme-card ${form.theme === t ? "active" : ""}`}
                        onClick={() => handleThemeSelect(t)}
                      >
                        <span className="theme-icon">
                          {t === "jastip" ? "🛍️" : t === "makanan" ? "🍔" : "👕"}
                        </span>
                        <div className="theme-title">
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Memproses..." : "Buat Toko Sekarang"}
                </button>
              </form>
            </div>
          </section>

          {/* PREVIEW SIDE */}
          <section className="preview-column">
            <div className="card" style={{ background: "transparent", border: "none", boxShadow: "none" }}>
              <div className="preview-wrapper">
                <div className={`mobile-frame theme-${form.theme}`}>
                  <div className="app-header">
                    <div className="shop-name">{form.name || "Nama Toko"}</div>
                    <div className="shop-tagline">
                      {form.subdomain ? `${form.subdomain}.tokoinstan.online` : "tokosaya.tokoinstan.online"}
                    </div>
                  </div>
                  <div className="app-content">
                    {previewData.map((item, i) => (
                      <div key={i} className="product-card">
                        <img src={item.img} alt="" className="product-img" />
                        <div className="product-info">
                          <div className="product-name">{item.name}</div>
                          <div className="product-meta">{item.meta}</div>
                          <div className="product-price">{item.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* TOAST */}
      <div className="toast-container">
        {toast.show && (
          <div className={`toast ${toast.type} show`} onClick={() => setToast({ show: false })}>
            <div>{toast.type === "success" ? "✅" : "⚠️"}</div>
            <div className="toast-content">
              <h4>{toast.type === "success" ? "Berhasil" : "Terjadi Kesalahan"}</h4>
              <p>{toast.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* --- CSS VARIABLES & STYLES --- */}
      <style jsx>{`
        /* --- CSS VARIABLES & RESET --- */
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        
        body { background-color: #f8fafc; color: #1e293b; line-height: 1.5; padding: 20px; }

        /* --- LAYOUT --- */
        .container { max-width: 1200px; margin: 0 auto; }
        .header { margin-bottom: 2rem; text-align: center; }
        .header h1 { font-size: 2rem; font-weight: 800; color: #2563eb; letter-spacing: -0.05em; }
        .header p { color: #64748b; margin-top: 0.5rem; }

        .split-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            align-items: start;
        }

        @media (max-width: 900px) {
            .split-layout { grid-template-columns: 1fr; }
            .preview-column { order: -1; position: sticky; top: 20px; z-index: 10; } /* Preview on top for mobile context */
        }

        /* --- CARD STYLES --- */
        .card { background: #FFFFFF; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); border: 1px solid #e2e8f0; }
        
        /* --- FORM ELEMENTS --- */
        .form-group { margin-bottom: 1.5rem; }
        .form-label { display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.9rem; }
        .form-hint { font-size: 0.8rem; color: #64748b; margin-top: 0.25rem; }
        
        .form-input, .form-select {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.2s;
        }
        
        .form-input:focus, .form-select:focus {
            outline: none;
            border-color: #1d4ed8;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .input-wrapper { position: relative; }
        .input-suffix {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: #64748b;
            font-weight: 500;
            pointer-events: none;
        }

        /* --- THEME SELECTION CARDS --- */
        .theme-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .theme-card {
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 1rem;
            cursor: pointer;
            text-align: center;
            transition: all 0.2s;
            position: relative;
        }
        
        .theme-card:hover { border-color: #1d4ed8; background: #f0f7ff; }
        .theme-card.active { border-color: #2563eb; background: #eff6ff; box-shadow: 0 0 0 2px #2563eb; }
        .theme-icon { font-size: 2rem; margin-bottom: 0.5rem; display: block; }
        .theme-title { font-weight: 600; font-size: 0.9rem; }

        /* --- BUTTONS --- */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 0.875rem;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .btn-primary { background: #2563eb; color: white; }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-primary:disabled { background: #64748b; cursor: not-allowed; }

        /* --- PREVIEW MOBILE SIMULATOR --- */
        .preview-wrapper {
            display: flex;
            justify-content: center;
            perspective: 1000px;
        }

        .mobile-frame {
            width: 375px;
            height: 667px; /* Approx iPhone SE/Mini height */
            background: #fff;
            border: 12px solid #1e293b;
            border-radius: 36px;
            overflow: hidden;
            position: relative;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
        }

        .mobile-frame::before {
            content: '';
            position: absolute;
            top: 0; left: 50%;
            transform: translateX(-50%);
            width: 120px;
            height: 24px;
            background: #1e293b;
            border-bottom-left-radius: 12px;
            border-bottom-right-radius: 12px;
            z-index: 20;
        }

        /* --- THEME PREVIEW INTERNAL STYLES --- */
        .app-header {
            background: #2563eb;
            color: white;
            padding: 40px 16px 16px; /* Top padding clears the notch */
            text-align: center;
        }
        .shop-name { font-size: 1.25rem; font-weight: 700; }
        .shop-tagline { font-size: 0.75rem; opacity: 0.9; margin-top: 4px; }

        .app-content {
            flex: 1;
            overflow-y: auto;
            background: #ffffff;
            padding: 16px;
        }

        /* Product Card Component inside Preview */
        .product-card {
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            margin-bottom: 16px;
            overflow: hidden;
            display: flex;
            border: 1px solid rgba(0,0,0,0.05);
            transition: transform 0.2s;
        }

        .product-img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            background: #eee;
        }

        .product-info {
            padding: 12px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .product-name {
            font-weight: 600;
            font-size: 0.95rem;
            color: #1e293b;
            margin-bottom: 4px;
            line-height: 1.2;
        }

        .product-meta {
            font-size: 0.8rem;
            color: #64748b;
            margin-bottom: 6px;
        }

        .product-price {
            color: #3b82f6;;
            font-weight: 700;
            font-size: 1rem;
        }

        .product-promo {
            background: #ffedd5;
            color: #c2410c;
            font-size: 0.7rem;
            padding: 2px 6px;
            border-radius: 4px;
            align-self: flex-start;
            margin-bottom: 4px;
            display: none; /* Toggled via JS */
        }

        .product-card.has-promo .product-promo { display: inline-block; }

        /* --- TOAST NOTIFICATION --- */
        .toast-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 100;
        }

        .toast {
            background: #fff;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 300px;
            transform: translateX(120%);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            border-left: 4px solid #2563eb;
        }
        
        .toast.show { transform: translateX(0); }
        .toast.success { border-left-color: #22c55e; }
        .toast.error { border-left-color: #ef4444; }
        .toast-content h4 { font-size: 0.95rem; margin-bottom: 2px; }
        .toast-content p { font-size: 0.85rem; color: #64748b; }

        /* --- THEME SPECIFIC OVERRIDES (PREVIEW) --- */
        /* Theme: Jastip */
        .mobile-frame.theme-jastip { --theme-header: #db2777; --theme-accent: #be185d; --theme-bg: #fdf2f8; --theme-text: #831843; }
        /* Theme: Makanan */
        .mobile-frame.theme-makanan { --theme-header: #ea580c; --theme-accent: #c2410c; --theme-bg: #fff7ed; --theme-text: #7c2d12; }
        /* Theme: Laundry */
        .mobile-frame.theme-laundry { --theme-header: #0284c7; --theme-accent: #0369a1; --theme-bg: #f0f9ff; --theme-text: #0c4a6e; }
      `}</style>
    </>
  );
}




