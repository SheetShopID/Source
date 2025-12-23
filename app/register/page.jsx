"use client";
import { useState } from "react";

export default function RegisterPage() {
  // 1. TAMBAHKAN 'theme' ke state default
  const [form, setForm] = useState({
    name: "",
    wa: "",
    sheetUrl: "",
    subdomain: "",
    theme: "jastip", // Default tema adalah jastip
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
      // Pastikan URL ini sesuai dengan nama file route.js Anda
      // Jika file route ada di: /app/api/register/route.js -> gunakan '/api/register'
      const res = await fetch("/api/register-shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // Form sudah termasuk 'theme'
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Gagal mendaftar");
        setLoading(false);
        return;
      }

      // Redirect ke subdomain toko yang baru dibuat
      window.location.href = json.redirect;

    } catch (err) {
      setError("Terjadi kesalahan koneksi");
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1 className="title">Daftar Tokoinstan</h1>
      <p className="subtitle">Mulai jualan dalam hitungan detik</p>

      <form onSubmit={submit}>
        <input
          name="name"
          placeholder="Nama Toko (contoh: Jastip Keren)"
          onChange={onChange}
          value={form.name}
          required
          className="input"
        />

        <input
          name="wa"
          placeholder="Nomor WhatsApp (628xxx)"
          onChange={onChange}
          value={form.wa}
          required
          className="input"
        />

        <input
          name="sheetUrl"
          placeholder="Link Google Sheet (CSV)"
          onChange={onChange}
          value={form.sheetUrl}
          required
          className="input"
        />

        <input
          name="subdomain"
          placeholder="Subdomain (contoh: tokoku)"
          onChange={onChange}
          value={form.subdomain}
          required
          className="input"
        />

        {/* 2. INPUT BARU: PILIH TEMA */}
        <div className="select-wrapper">
          <label>Pilih Tema Katalog:</label>
          <select
            name="theme"
            onChange={onChange}
            value={form.theme}
            className="input"
          >
            <option value="jastip">🛍️ Jastip (Grid & Fee)</option>
            <option value="makanan">🍔 Makanan (Visual & Menu)</option>
            <option value="laundry">🧺 Laundry (List & Simple)</option>
          </select>
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading} className="button">
          {loading ? "Memproses..." : "Buat Toko Sekarang"}
        </button>
      </form>

      {/* 3. CSS UPGRADE (Mobile Friendly) */}
      <style jsx>{`
        .container {
          max-width: 480px; /* Lebar maksimal di desktop */
          margin: 40px auto; /* Tengah di desktop */
          padding: 0 20px; /* Padding biar tidak nempel pinggir di HP */
        }

        .title {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 5px;
          text-align: center;
          color: #1e293b;
        }

        .subtitle {
          font-size: 14px;
          color: #64748b;
          text-align: center;
          margin-bottom: 25px;
        }

        .input {
          width: 100%;
          padding: 14px; /* Padding lebih besar untuk jari */
          margin: 10px 0;
          border: 1px solid #cbd5e1;
          border-radius: 8px; /* Sudut melengkung */
          font-size: 16px;
          box-sizing: border-box; /* Agar padding tidak memperbesar lebar */
          transition: border-color 0.2s;
        }

        .input:focus {
          border-color: #2563eb;
          outline: none;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .select-wrapper {
          margin: 15px 0;
        }

        .select-wrapper label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
        }

        .button {
          width: 100%;
          padding: 15px;
          margin-top: 20px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }

        .button:disabled {
          background-color: #94a3b8;
          cursor: not-allowed;
        }

        .error {
          color: #991b1b;
          background-color: #fee2e2;
          padding: 12px;
          border-radius: 6px;
          margin-top: 15px;
          font-size: 14px;
          border: 1px solid #fecaca;
        }
      `}</style>
    </div>
  );
}

