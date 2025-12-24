"use client";
import { useState, useRef } from "react";

export default function RegisterPage() {
  /* =====================
   * STATE
   ===================== */
  const [form, setForm] = useState({
    name: "",
    wa: "",
    sheetUrl: "",
    subdomain: "",
    theme: "jastip",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const timeoutRef = useRef(null);

  /* =====================
   * HANDLERS
   ===================== */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubdomainChange = (e) => {
    const val = e.target.value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "");
    setForm((prev) => ({ ...prev, subdomain: val }));
  };

  const handleThemeSelect = (theme) => {
    setForm((prev) => ({ ...prev, theme }));
  };

  /* =====================
   * SUBMIT (FINAL SAFE)
   ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const payload = {
        name: form.name.trim(),
        subdomain: form.subdomain.trim(),
        sheetUrl: form.sheetUrl.trim(),
        theme: form.theme,
        wa: form.wa.startsWith("62") ? form.wa : "62" + form.wa,
      };

      const res = await fetch("/api/register-shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json.error || "Gagal mendaftarkan toko");
      }

      showToast("Selamat! Tokomu berhasil dibuat.", "success");

      setTimeout(() => {
        window.location.href = json.redirect;
      }, 1500);
    } catch (err) {
      if (err.name === "AbortError") {
        showToast("Koneksi terlalu lama, silakan coba lagi", "error");
      } else {
        showToast(err.message || "Terjadi kesalahan", "error");
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  /* =====================
   * TOAST
   ===================== */
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  /* =====================
   * PREVIEW DATA
   ===================== */
  const getPreviewItems = (theme) => {
    if (theme === "makanan") {
      return [
        { img: "https://picsum.photos/seed/food1/100/100", name: "Paket Ayam Bakar", meta: "Menu", price: "Rp 35.000", promo: "" },
        { img: "https://picsum.photos/seed/food2/100/100", name: "Es Kopi Susu", meta: "Minuman", price: "Rp 18.000", promo: "Diskon" },
      ];
    }

    if (theme === "laundry") {
      return [
        { img: "https://picsum.photos/seed/l1/100/100", name: "Cuci Kiloan", meta: "Laundry", price: "Rp 7.000", promo: "" },
        { img: "https://picsum.photos/seed/l2/100/100", name: "Setrika", meta: "Laundry", price: "Rp 5.000", promo: "" },
      ];
    }

    return [
      { img: "https://picsum.photos/seed/j1/100/100", name: "Sepatu Korea", meta: "Fee Rp5.000", price: "Rp 250.000", promo: "Promo" },
      { img: "https://picsum.photos/seed/j2/100/100", name: "Tas Import", meta: "Fee Rp10.000", price: "Rp 350.000", promo: "" },
    ];
  };

  const previewData = getPreviewItems(form.theme);

  /* =====================
   * RENDER
   ===================== */
  return (
    <> 
      {/* TOAST */}
      <div className="toast-container">
        {toast.show && (
          <div className={`toast ${toast.type} show`}>
            <div style={{ fontSize: "1.5rem" }}>
              {toast.type === "success" ? "✅" : "⚠️"}
            </div>
            <div className="toast-content">
              <h4>{toast.type === "success" ? "Berhasil" : "Terjadi Kesalahan"}</h4>
              <p>{toast.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* =====================
          CSS — FULL (ASLI)
         ===================== */}
      <style jsx>{`
        /* --- CSS VARIABLES & RESET --- */
        :root {
            --primary: #2563eb;
            --primary-hover: #1d4ed8;
            --bg-body: #f8fafc;
            --bg-card: #ffffff;
            --text-main: #1e293b;
            --text-muted: #64748b;
            --border: #e2e8f0;
            --danger: #ef4444;
            --success: #22c55e;
            --radius: 12px;
            --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            
            /* Theme Variables (Dynamic) */
            --theme-bg: #ffffff;
            --theme-header: #2563eb;
            --theme-text: #1e293b;
            --theme-accent: #3b82f6;
            --theme-radius: 8px;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        
        body { background-color: #f8fafc; color: var(--text-main); line-height: 1.5; padding: 20px; }

        /* --- LAYOUT --- */
        .container { max-width: 1200px; margin: 0 auto; }
        .header { margin-bottom: 2rem; text-align: center; }
        .header h1 { font-size: 2rem; font-weight: 800; color: var(--primary); letter-spacing: -0.05em; }
        .header p { color: var(--text-muted); margin-top: 0.5rem; }

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
        .form-hint { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; }
        
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
            color: var(--text-muted);
            font-weight: 500;
            pointer-events: none;
        }

        /* --- THEME SELECTION CARDS --- */
        .theme-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .theme-card {
            border: 2px solid var(--border);
            border-radius: 8px;
            padding: 1rem;
            cursor: pointer;
            text-align: center;
            transition: all 0.2s;
            position: relative;
        }
        
        .theme-card:hover { border-color: var(--primary-hover); background: #f0f7ff; }
        .theme-card.active { border-color: var(--primary); background: #eff6ff; box-shadow: 0 0 0 2px var(--primary); }
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
        
        .btn-primary { background: var(--primary); color: white; }
        .btn-primary:hover { background: var(--primary-hover); }
        .btn-primary:disabled { background: var(--text-muted); cursor: not-allowed; }

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
            background: var(--theme-header);
            color: white;
            padding: 40px 16px 16px; /* Top padding clears the notch */
            text-align: center;
        }
        .shop-name { font-size: 1.25rem; font-weight: 700; }
        .shop-tagline { font-size: 0.75rem; opacity: 0.9; margin-top: 4px; }

        .app-content {
            flex: 1;
            overflow-y: auto;
            background: var(--theme-bg);
            padding: 16px;
        }

        /* Product Card Component inside Preview */
        .product-card {
            background: #fff;
            border-radius: var(--theme-radius);
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
            color: var(--theme-text);
            margin-bottom: 4px;
            line-height: 1.2;
        }

        .product-meta {
            font-size: 0.8rem;
            color: var(--text-muted);
            margin-bottom: 6px;
        }

        .product-price {
            color: var(--theme-accent);
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
            border-left: 4px solid var(--primary);
        }
        
        .toast.show { transform: translateX(0); }
        .toast.success { border-left-color: var(--success); }
        .toast.error { border-left-color: var(--danger); }
        .toast-content h4 { font-size: 0.95rem; margin-bottom: 2px; }
        .toast-content p { font-size: 0.85rem; color: var(--text-muted); }

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
