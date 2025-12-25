"use client";
import { useState, useRef } from "react";
import styles from "./RegisterPage.module.css";

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubdomainChange = (e) => {
    let val = e.target.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    setForm({ ...form, subdomain: val });
  };

  const handleThemeSelect = (theme) => setForm({ ...form, theme });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/register-shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok) {
        showToast(json.error || "Gagal mendaftar", "error");
        setLoading(false);
        return;
      }

      showToast("Toko berhasil dibuat!", "success");
      setTimeout(() => (window.location.href = json.redirect), 1500);
    } catch {
      showToast("Terjadi kesalahan koneksi", "error");
      setLoading(false);
    }
  };

  const previewData = [
    { img: "https://picsum.photos/seed/prod1/100/100", name: "Produk A", meta: "Fee Rp5.000", price: "Rp 50.000" },
    { img: "https://picsum.photos/seed/prod2/100/100", name: "Produk B", meta: "Fee Rp10.000", price: "Rp 100.000" },
  ];

  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Tokoinstan</h1>
          <p>Buat toko onlinemu sendiri dalam hitungan detik.</p>
        </header>

        <div className={styles.splitLayout}>
          {/* FORM SIDE */}
          <section className={styles.formColumn}>
            <div className={styles.card}>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nama Toko</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="Contoh: Jastip Seoul Keren"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nomor WhatsApp</label>
                  <input
                    type="tel"
                    className={styles.formInput}
                    placeholder="81234567890"
                    name="wa"
                    value={form.wa}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Subdomain Toko</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="tokosaya"
                      name="subdomain"
                      value={form.subdomain}
                      onChange={handleSubdomainChange}
                      required
                    />
                    <span className={styles.inputSuffix}>.tokoinstan.online</span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Link Google Sheet (CSV)</label>
                  <input
                    type="url"
                    className={styles.formInput}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    name="sheetUrl"
                    value={form.sheetUrl}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Pilih Tema</label>
                  <div className={styles.themeGrid}>
                    {["jastip", "makanan", "laundry"].map((t) => (
                      <div
                        key={t}
                        className={`${styles.themeCard} ${form.theme === t ? styles.active : ""}`}
                        onClick={() => handleThemeSelect(t)}
                      >
                        <span className={styles.themeIcon}>
                          {t === "jastip" ? "🛍️" : t === "makanan" ? "🍔" : "👕"}
                        </span>
                        <div className={styles.themeTitle}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  disabled={loading}
                >
                  {loading ? "Memproses..." : "Buat Toko Sekarang"}
                </button>
              </form>
            </div>
          </section>

          {/* PREVIEW SIDE */}
          <section className={styles.previewColumn}>
            <div className={styles.card} style={{ background: "transparent", border: "none", boxShadow: "none" }}>
              <div className={styles.previewWrapper}>
                <div className={`${styles.mobileFrame} theme-${form.theme}`}>
                  <div className={styles.appHeader}>
                    <div className={styles.shopName}>{form.name || "Nama Toko"}</div>
                    <div className={styles.shopTagline}>
                      {form.subdomain ? `${form.subdomain}.tokoinstan.online` : "tokosaya.tokoinstan.online"}
                    </div>
                  </div>

                  <div className={styles.appContent}>
                    {previewData.map((item, i) => (
                      <div key={i} className={styles.productCard}>
                        <img src={item.img} alt="" className={styles.productImg} />
                        <div className={styles.productInfo}>
                          <div className={styles.productName}>{item.name}</div>
                          <div className={styles.productMeta}>{item.meta}</div>
                          <div className={styles.productPrice}>{item.price}</div>
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
      <div className={styles.toastContainer}>
        {toast.show && (
          <div
            className={`${styles.toast} ${styles.show} ${
              toast.type === "success" ? styles.success : styles.error
            }`}
            onClick={() => setToast({ show: false })}
          >
            <div>{toast.type === "success" ? "✅" : "⚠️"}</div>
            <div className={styles.toastContent}>
              <h4>{toast.type === "success" ? "Berhasil" : "Terjadi Kesalahan"}</h4>
              <p>{toast.message}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


