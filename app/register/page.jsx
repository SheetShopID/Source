"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./RegisterPage.module.css";
import { formatRp } from "@/lib/utils";

const INITIAL_FORM = {
  name: "",
  wa: "",
  email: "",
  subdomain: "",
  theme: "jastip",
};

export default function RegisterPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [previewCart, setPreviewCart] = useState({});
  const timeoutRef = useRef(null);

  useEffect(() => {
    setForm(INITIAL_FORM);
    setPreviewCart({});
    setToast({ show: false, message: "", type: "success" });
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubdomainChange = (e) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setForm((p) => ({ ...p, subdomain: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.endsWith("@gmail.com")) {
      showToast("Gunakan email Gmail", "error");
      return;
    }

    if (form.subdomain.length < 4) {
      showToast("Subdomain minimal 4 karakter", "error");
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
        showToast(json.error || "Gagal membuat toko", "error");
        setLoading(false);
        return;
      }

      showToast("Toko & Google Sheet berhasil dibuat");
      setForm(INITIAL_FORM);
      setPreviewCart({});

      setTimeout(() => {
        window.location.href = json.redirect;
      }, 1500);
    } catch {
      showToast("Koneksi bermasalah", "error");
      setLoading(false);
    }
  };

  const previewByTheme = {
    jastip: [
      { name: "Titip Makan", price: 25000 },
      { name: "Titip Skincare", price: 150000 },
    ],
    makanan: [
      { name: "Ayam Geprek", price: 22000 },
      { name: "Es Teh Jumbo", price: 8000 },
    ],
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Tokoinstan</h1>
        <p>Website siap pakai untuk UMKM</p>
      </header>

      <div className={styles.layout}>
        <form className={styles.card} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            name="name"
            placeholder="Nama Toko"
            value={form.name}
            onChange={handleInputChange}
            required
          />

          <input
            className={styles.input}
            name="wa"
            placeholder="Nomor WhatsApp"
            value={form.wa}
            onChange={handleInputChange}
            required
          />

          <input
            className={styles.input}
            name="email"
            placeholder="email@gmail.com"
            value={form.email}
            onChange={handleInputChange}
            required
          />

          <span className={styles.helper}>
            Google Sheet akan dibagikan ke email ini
          </span>

          <div className={styles.subdomainWrap}>
            <input
              className={styles.input}
              name="subdomain"
              placeholder="tokosaya"
              value={form.subdomain}
              onChange={handleSubdomainChange}
              required
            />
            <span className={styles.domain}>.tokoinstan.online</span>
          </div>

          <div className={styles.themeGrid}>
            {Object.keys(previewByTheme).map((t) => (
              <button
                key={t}
                type="button"
                className={`${styles.themeBtn} ${
                  form.theme === t ? styles.active : ""
                }`}
                onClick={() => setForm((p) => ({ ...p, theme: t }))}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={loading}
          >
            {loading ? "Menyiapkan toko..." : "Buat Toko"}
          </button>
        </form>

        <div className={styles.preview}>
          <div className={styles.previewHeader}>
            {form.name || "Nama Toko"}
          </div>

          {previewByTheme[form.theme].map((p) => (
            <div key={p.name} className={styles.previewItem}>
              {p.name} — {formatRp(p.price)}
            </div>
          ))}
        </div>
      </div>

      {toast.show && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
/*tes*/
