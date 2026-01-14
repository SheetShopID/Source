"use client";
/*tes*/
import { useState } from "react";
import ThemePreview from "@/components/ThemePreview";

const THEMES = [
  { value: "food", label: "Food / Kuliner" },
  { value: "jasa", label: "Jasa" },
  { value: "katalog", label: "Katalog" },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    wa: "",
    email: "",
    subdomain: "",
    theme: "food",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Registrasi gagal");
      }

      window.location.href = json.redirect;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 24 }}>
      <h1>Daftar Toko</h1>

      {error && (
        <div style={{ color: "red", marginBottom: 12 }}>
          {error}
        </div>
      )}

      <input
        name="name"
        placeholder="Nama Toko"
        value={form.name}
        onChange={onChange}
      />

      <input
        name="wa"
        placeholder="WhatsApp (628xxxx)"
        value={form.wa}
        onChange={onChange}
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={onChange}
      />

      <input
        name="subdomain"
        placeholder="Subdomain"
        value={form.subdomain}
        onChange={onChange}
      />

      <select
        name="theme"
        value={form.theme}
        onChange={onChange}
      >
        {THEMES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <button
        onClick={submit}
        disabled={loading}
        style={{ marginTop: 16 }}
      >
        {loading ? "Membuat toko..." : "Daftar"}
      </button>

      {/* PREVIEW */}
      <div style={{ marginTop: 32 }}>
        <h3>Preview Tema</h3>
        <ThemePreview theme={form.theme} />
      </div>
    </div>
  );
}

