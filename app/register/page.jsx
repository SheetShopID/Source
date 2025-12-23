"use client";
import { useState } from "react";

/******************************
 * PREVIEW COMPONENT
 ******************************/
function ThemePreview({ theme }) {
  if (theme === "makanan") {
    return (
      <div className="preview-card food">
        <h4>🍔 Contoh Menu</h4>
        <div className="row">
          <div className="img" />
          <div>
            <strong>Nasi Ayam</strong>
            <p>Rp25.000</p>
            <span className="promo">Promo!</span>
          </div>
        </div>
      </div>
    );
  }

  if (theme === "laundry") {
    return (
      <div className="preview-card laundry">
        <h4>🧺 Layanan Laundry</h4>
        <ul>
          <li>Cuci Kering — Rp7.000/kg</li>
          <li>Cuci Setrika — Rp9.000/kg</li>
          <li>Express — Rp12.000/kg</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="preview-card jastip">
      <h4>🛍️ Produk Jastip</h4>
      <div className="grid">
        <div className="item">
          <div className="img" />
          <strong>Barang Import</strong>
          <p>Rp150.000</p>
          <small>Fee: Rp10.000</small>
        </div>
        <div className="item">
          <div className="img" />
          <strong>Snack Jepang</strong>
          <p>Rp45.000</p>
          <small>Fee: Rp5.000</small>
        </div>
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
      <div className="container">
        <h1 className="title">Daftar Tokoinstan</h1>
        <p className="subtitle">Mulai jualan dalam hitungan detik</p>

        <form onSubmit={submit}>
          <input name="name" placeholder="Nama Toko" onChange={onChange} value={form.name} required className="input" />
          <input name="wa" placeholder="Nomor WhatsApp" onChange={onChange} value={form.wa} required className="input" />
          <input name="sheetUrl" placeholder="Link Google Sheet (CSV)" onChange={onChange} value={form.sheetUrl} required className="input" />
          <input name="subdomain" placeholder="Subdomain" onChange={onChange} value={form.subdomain} required className="input" />

          <label className="label">Pilih Tema Katalog</label>
          <select name="theme" onChange={onChange} value={form.theme} className="input">
            <option value="jastip">🛍️ Jastip</option>
            <option value="makanan">🍔 Makanan</option>
            <option value="laundry">🧺 Laundry</option>
          </select>

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={loading} className="button">
            {loading ? "Memproses..." : "Buat Toko Sekarang"}
          </button>
        </form>
      </div>

      <div className="preview">
        <ThemePreview theme={form.theme} />
      </div>

      <style jsx>{`
        .wrapper { display: flex; gap: 40px; max-width: 900px; margin: 40px auto; padding: 0 20px; flex-wrap: wrap; }
        .container { flex: 1; min-width: 300px; }
        .preview { flex: 1; min-width: 280px; }
        .title { text-align: center; font-size: 24px; font-weight: 800; }
        .subtitle { text-align: center; color: #64748b; margin-bottom: 20px; }
        .input { width: 100%; padding: 14px; margin-bottom: 12px; border: 1px solid #cbd5e1; border-radius: 8px; }
        .label { font-weight: 600; margin: 10px 0 6px; display: block; }
        .button { width: 100%; padding: 15px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: bold; }
        .error { background: #fee2e2; color: #991b1b; padding: 10px; border-radius: 6px; margin-bottom: 10px; }
        .preview-card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; background: #fff; }
        .preview-card h4 { margin-bottom: 10px; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .item { border: 1px solid #ddd; padding: 8px; border-radius: 6px; }
        .img { height: 60px; background: #e5e7eb; border-radius: 4px; margin-bottom: 6px; }
        .row { display: flex; gap: 10px; }
        .promo { color: green; font-size: 12px; }
        ul { padding-left: 16px; }
      `}</style>
    </div>
  );
}
