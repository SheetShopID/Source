"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./RegisterPage.module.css";
import { formatRp } from "@/lib/utils";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    wa: "",
    email: "",
    subdomain: "",
    theme: "jastip",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [previewCart, setPreviewCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  const timeoutRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubdomainChange = (e) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setForm((p) => ({ ...p, subdomain: val }));
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.endsWith("@gmail.com")) {
      showToast("Gunakan email Gmail untuk Google Sheet", "error");
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

      showToast("Toko sedang dibuat…");

      // redirect ke halaman setup (polling status)
      setTimeout(() => {
        window.location.href = json.redirect;
      }, 1000);
    } catch {
      showToast("Terjadi kesalahan koneksi", "error");
      setLoading(false);
    }
  };

  const previewByTheme = {
    jastip: [
      { name: "Titip Makan", price: 25000, fee: 5000 },
      { name: "Titip Skincare", price: 150000, fee: 8000 },
    ],
    makanan: [
      { name: "Ayam Geprek", price: 22000, fee: 3000 },
      { name: "Es Teh Jumbo", price: 8000, fee: 2000 },
    ],
    laundry: [
      { name: "Cuci Kiloan", price: 7000, fee: 0 },
      { name: "Setrika Express", price: 12000, fee: 0 },
    ],
    beauty: [
      { name: "Facial", price: 120000, fee: 0 },
      { name: "Serum Wajah", price: 98000, fee: 5000 },
    ],
  };

  const previewData = previewByTheme[form.theme] || [];

  const themeColors = {
    jastip: "#2f8f4a",
    makanan: "#f97316",
    laundry: "#3b82f6",
    beauty: "#ec4899",
  };
  const themeColor = themeColors[form.theme];

  const addToCart = (item) => {
    setPreviewCart((prev) => {
      const cur = prev[item.name] || { qty: 0, price: item.price, fee: item.fee };
      return { ...prev, [item.name]: { ...cur, qty: cur.qty + 1 } };
    });
    setCartOpen(true);
  };

  const cartItems = Object.entries(previewCart);
  const totalQty = cartItems.reduce((a, [, v]) => a + v.qty, 0);
  const totalPrice = cartItems.reduce(
    (a, [, v]) => a + (v.price + v.fee) * v.qty,
    0
  );

  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Tokoinstan</h1>
          <p>Terima order jasa & produk langsung dari HP pelanggan.</p>
        </header>

        <div className={styles.splitLayout}>
          <section className={styles.formColumn}>
            <div className={styles.card}>
              <form onSubmit={handleSubmit}>
                <input className={styles.formInput} name="name" placeholder="Nama Toko" onChange={handleInputChange} required />
                <input className={styles.formInput} name="wa" placeholder="Nomor WhatsApp" onChange={handleInputChange} required />
                <input className={styles.formInput} name="email" placeholder="email@gmail.com" onChange={handleInputChange} required />
                <small>Google Sheet akan otomatis dibagikan ke email ini</small>

                <div className={styles.inputWrapper}>
                  <input className={styles.formInput} name="subdomain" placeholder="tokosaya" value={form.subdomain} onChange={handleSubdomainChange} required />
                  <span>.tokoinstan.online</span>
                </div>

                <div className={styles.themeGrid}>
                  {Object.keys(previewByTheme).map((t) => (
                    <button type="button" key={t} className={form.theme === t ? styles.active : ""} onClick={() => setForm((p) => ({ ...p, theme: t }))}>
                      {t}
                    </button>
                  ))}
                </div>

                <button disabled={loading}>
                  {loading ? "Menyiapkan toko & Google Sheet..." : "Buat Toko"}
                </button>
              </form>
            </div>
          </section>

          <section className={styles.previewColumn}>
            <div className={styles.mobileFrame}>
              <div className={styles.appHeader} style={{ background: themeColor }}>
                <strong>{form.name || "Nama Toko"}</strong>
                <small>{form.subdomain || "tokosaya"}.tokoinstan.online</small>
              </div>

              {previewData.map((p) => (
                <div key={p.name} onClick={() => addToCart(p)}>
                  {p.name} — {formatRp(p.price)}
                </div>
              ))}

              {totalQty > 0 && (
                <div className={styles.cartBar}>
                  🛒 {totalQty} item • {formatRp(totalPrice)}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {toast.show && <div className={styles.toast}>{toast.message}</div>}
    </>
  );
}
