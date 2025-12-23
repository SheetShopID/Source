"use client";
import { useState } from "react";
//import sudah ganti
export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    wa: "",
    sheetUrl: "",
    subdomain: "",
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

      // REDIRECT KE SUBDOMAIN TOKO
      window.location.href = json.redirect;

    } catch (err) {
      setError("Terjadi kesalahan server");
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1>Daftar Toko</h1>

      <form onSubmit={submit}>
        <input
          name="name"
          placeholder="Nama Toko"
          onChange={onChange}
          required
        />

        <input
          name="wa"
          placeholder="Nomor WhatsApp (628xxx)"
          onChange={onChange}
          required
        />

        <input
          name="sheetUrl"
          placeholder="Link Google Sheet (CSV)"
          onChange={onChange}
          required
        />

        <input
          name="subdomain"
          placeholder="Nama Subdomain (contoh: tokoku)"
          onChange={onChange}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button disabled={loading}>
          {loading ? "Memproses..." : "Buat Toko"}
        </button>
      </form>

      <style jsx>{`
        input {
          width: 100%;
          padding: 10px;
          margin: 8px 0;
        }
        button {
          width: 100%;
          padding: 12px;
          margin-top: 12px;
        }
      `}</style>
    </div>
  );
}

