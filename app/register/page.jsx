"use client";
import { useState, useRef } from "react";

export default function RegisterPage() {
  /******************************
   * STATE
   ******************************/
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

  /******************************
   * HANDLERS
   ******************************/
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

  /******************************
   * SUBMIT
   ******************************/
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (form.subdomain.length < 3) {
      showToast("Subdomain minimal 3 karakter", "error");
      return;
    }

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

      showToast("Tokomu berhasil dibuat 🎉", "success");

      setTimeout(() => {
        window.location.href = json.redirect;
      }, 1200);
    } catch (err) {
      if (err.name === "AbortError") {
        showToast("Koneksi terlalu lama, coba lagi", "error");
      } else {
        showToast(err.message || "Terjadi kesalahan", "error");
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  /******************************
   * TOAST
   ******************************/
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  /******************************
   * PREVIEW DATA
   ******************************/
  const getPreviewItems = (theme) => {
    if (theme === "makanan") {
      return [
        { img: "https://picsum.photos/seed/food1/100/100", name: "Ayam Bakar", meta: "Menu", price: "Rp 35.000" },
        { img: "https://picsum.photos/seed/food2/100/100", name: "Es Kopi", meta: "Minuman", price: "Rp 18.000" },
      ];
    }

    if (theme === "laundry") {
      return [
        { img: "https://picsum.photos/seed/l1/100/100", name: "Cuci Kiloan", meta: "Laundry", price: "Rp 7.000" },
        { img: "https://picsum.photos/seed/l2/100/100", name: "Setrika", meta: "Laundry", price: "Rp 5.000" },
      ];
    }

    return [
      { img: "https://picsum.photos/seed/j1/100/100", name: "Sepatu Korea", meta: "Fee Rp5.000", price: "Rp 250.000" },
      { img: "https://picsum.photos/seed/j2/100/100", name: "Tas Import", meta: "Fee Rp10.000", price: "Rp 350.000" },
    ];
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
          <p>Buat toko onlinemu dalam hitungan detik.</p>
        </header>

        <div className="split-layout">
          {/* FORM */}
          <section className="form-column">
            <div className="card">
              <form
                onSubmit={handleSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && loading) e.preventDefault();
                }}
              >
                <div className="form-group">
                  <label>Nama Toko</label>
                  <input name="name" value={form.name} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                  <label>WhatsApp</label>
                  <input name="wa" value={form.wa} onChange={handleInputChange} placeholder="812xxxx" required />
                </div>

                <div className="form-group">
                  <label>Subdomain</label>
                  <div className="input-wrapper">
                    <input name="subdomain" value={form.subdomain} onChange={handleSubdomainChange} required />
                    <span className="input-suffix">.tokoinstan.online</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Google Sheet URL</label>
                  <input name="sheetUrl" value={form.sheetUrl} onChange={handleInputChange} required />
                </div>

                <div className="theme-grid">
                  {["jastip", "makanan", "laundry"].map((t) => (
                    <div
                      key={t}
                      className={`theme-card ${form.theme === t ? "active" : ""}`}
                      onClick={() => handleThemeSelect(t)}
                    >
                      {t}
                    </div>
                  ))}
                </div>

                <button disabled={loading}>
                  {loading ? "Memproses..." : "Buat Toko"}
                </button>
              </form>
            </div>
          </section>

          {/* PREVIEW */}
          <section className="preview-column">
            <div className="card">
              <div className={`mobile-frame theme-${form.theme}`}>
                <div className="app-header">
                  <div className="shop-name">{form.name || "Nama Toko"}</div>
                  <div className="shop-tagline">
                    {form.subdomain || "tokosaya"}.tokoinstan.online
                  </div>
                </div>

                <div className="app-content">
                  {previewData.map((p, i) => (
                    <div key={i} className="product-card">
                      <img src={p.img} />
                      <div>
                        <div>{p.name}</div>
                        <small>{p.meta}</small>
                        <strong>{p.price}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* TOAST */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </>
  );
}
