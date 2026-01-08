"use client";
import { useState, useRef } from "react";
import styles from "./RegisterPage.module.css";
import { formatRp } from "@/lib/utils";

const BASE_DOMAIN = "tokoinstan.online";

export default function RegisterPage() {
  /* =========================
     STATE
  ========================= */
  const [form, setForm] = useState({
    name: "",
    wa: "",
    email: "",
    subdomain: "",
    theme: "jastip",
  });

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [previewCart, setPreviewCart] = useState({});
  const toastTimer = useRef(null);
  const pollTimer = useRef(null);

  /* =========================
     UTIL
  ========================= */
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const redirectToShop = (subdomain) => {
    if (!subdomain) return;
    window.location.href = `https://${subdomain}.${BASE_DOMAIN}`;
  };

  /* =========================
     INPUT HANDLER
  ========================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubdomainChange = (e) => {
    const clean = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");
    setForm((p) => ({ ...p, subdomain: clean }));
  };

  /* =========================
     BACKGROUND PROCESS
  ========================= */
  const startSetup = (subdomain) => {
    const baseUrl = window.location.origin;

    // fire & forget
    fetch(`${baseUrl}/api/setup-sheet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subdomain }),
    }).catch(() => {
      // silent — status akan terlihat dari polling
    });
  };

  const pollStatus = (subdomain) => {
    setProgress("⏳ Menyiapkan Google Sheet & Website...");

    pollTimer.current = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/shop-status?subdomain=${subdomain}`,
          { cache: "no-store" }
        );
        const data = await res.json();

        if (data.status === "active") {
          clearInterval(pollTimer.current);
          redirectToShop(subdomain);
        }

        if (data.status === "error") {
          clearInterval(pollTimer.current);
          setLoading(false);
          showToast(
            "Gagal menyiapkan Google Sheet. Silakan refresh.",
            "error"
          );
        }
      } catch {
        // ignore — polling lanjut
      }
    }, 3000);

    // safety stop (1 menit)
    setTimeout(() => {
      clearInterval(pollTimer.current);
    }, 60000);
  };

  /* =========================
     SUBMIT
  ========================= */
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
    setProgress("🚀 Mendaftarkan toko...");

    try {
      const res = await fetch("/api/register-shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok || !json.subdomain) {
        throw new Error(json.error || "Registrasi gagal");
      }

      showToast("Toko berhasil dibuat!");
      startSetup(json.subdomain);
      pollStatus(json.subdomain);

    } catch (err) {
      setLoading(false);
      setProgress("");
      showToast(err.message || "Terjadi kesalahan", "error");
    }
  };

  /* =========================
     PREVIEW DATA
  ========================= */
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

  const themeColors = {
    jastip: "#2f8f4a",
    makanan: "#f97316",
    laundry: "#3b82f6",
    beauty: "#ec4899",
  };

  const previewData = previewByTheme[form.theme];
  const themeColor = themeColors[form.theme];

  /* =========================
     CART PREVIEW
  ========================= */
  const addToCart = (item) => {
    setPreviewCart((prev) => {
      const cur = prev[item.name] || {
        qty: 0,
        price: item.price,
        fee: item.fee,
      };
      return {
        ...prev,
        [item.name]: { ...cur, qty: cur.qty + 1 },
      };
    });
  };

  const cartItems = Object.entries(previewCart);
  const totalQty = cartItems.reduce((a, [, v]) => a + v.qty, 0);
  const totalPrice = cartItems.reduce(
    (a, [, v]) => a + (v.price + v.fee) * v.qty,
    0
  );

  /* =========================
     RENDER
  ========================= */
  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Tokoinstan</h1>
          <p>Terima order jasa & produk langsung dari HP pelanggan.</p>
        </header>

        <div className={styles.splitLayout}>
          {/* FORM */}
          <section className={styles.formColumn}>
            <div className={styles.card}>
              <form onSubmit={handleSubmit}>
                <input
                  className={styles.formInput}
                  name="name"
                  placeholder="Nama Toko"
                  onChange={handleInputChange}
                  required
                />

                <input
                  className={styles.formInput}
                  name="wa"
                  placeholder="Nomor WhatsApp"
                  onChange={handleInputChange}
                  required
                />

                <input
                  className={styles.formInput}
                  name="email"
                  placeholder="email@gmail.com"
                  onChange={handleInputChange}
                  required
                />
                <small>Google Sheet akan otomatis dibagikan ke email ini</small>

                <div className={styles.inputWrapper}>
                  <input
                    className={styles.formInput}
                    name="subdomain"
                    placeholder="tokosaya"
                    value={form.subdomain}
                    onChange={handleSubdomainChange}
                    required
                  />
                  <span>.{BASE_DOMAIN}</span>
                </div>

                <div className={styles.themeGrid}>
                  {Object.keys(previewByTheme).map((t) => (
                    <button
                      type="button"
                      key={t}
                      className={form.theme === t ? styles.active : ""}
                      onClick={() =>
                        setForm((p) => ({ ...p, theme: t }))
                      }
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <button disabled={loading}>
                  {loading ? "Memproses..." : "Buat Toko"}
                </button>

                {progress && (
                  <div className={styles.progress}>{progress}</div>
                )}
              </form>
            </div>
          </section>

          {/* PREVIEW */}
          <section className={styles.previewColumn}>
            <div className={styles.mobileFrame}>
              <div
                className={styles.appHeader}
                style={{ background: themeColor }}
              >
                <strong>{form.name || "Nama Toko"}</strong>
                <small>
                  {(form.subdomain || "tokosaya")}.{BASE_DOMAIN}
                </small>
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

      {toast.show && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.message}
        </div>
      )}
    </>
  );
}
