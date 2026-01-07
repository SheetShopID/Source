"use client";
import { useState, useRef } from "react";
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
  const [showPreview, setShowPreview] = useState(false);
  const timeoutRef = useRef(null);

  /* =========================
  HANDLER
  ========================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubdomainChange = (e) => {
    const val = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");
    setForm((p) => ({ ...p, subdomain: val }));
  };

  const handleWhatsappChange = (value) => {
    // Remove all non-digit characters
    let cleaned = value.replace(/\D/g, "");

    // Auto-add +62 prefix if not present
    if (!cleaned.startsWith("62")) {
      cleaned = "62" + cleaned;
    }

    setForm((p) => ({ ...p, wa: cleaned }));
  };

  // Format WhatsApp for display
  const formatWhatsappDisplay = (phone) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.startsWith("62")) {
      return `+62 ${cleaned.slice(2).replace(/(\d{4})(?=\d)/g, "$1 ")}`;
    }

    return phone;
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  /* =========================
  SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi email opsional (jika diisi harus valid)
    if (form.email && !form.email.includes("@")) {
      showToast("Format email tidak valid", "error");
      return;
    }

    // Validasi subdomain minimal 3 karakter
    if (form.subdomain.length < 3) {
      showToast("Subdomain minimal 3 karakter", "error");
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
      showToast("Toko berhasil dibuat!");
      setLoading(false);

      // Redirect langsung tanpa delay
      if (json.redirect) {
        window.location.href = json.redirect;
      }
    } catch (error) {
      console.error("[REGISTER PAGE] Error:", error);
      showToast("Terjadi kesalahan koneksi", "error");
      setLoading(false);
    }
  };

  /* =========================
  TEMPLATE CONFIGURATION
  ========================= */
  const templates = [
    {
      id: "jastip",
      name: "Jastip",
      icon: "🛒",
      description: "Titip belanja",
      color: "#2f8f4a",
    },
    {
      id: "makanan",
      name: "Makanan",
      icon: "🍽️",
      description: "Catering & delivery",
      color: "#f97316",
    },
    {
      id: "laundry",
      name: "Laundry",
      icon: "👔",
      description: "Cuci & setrika",
      color: "#3b82f6",
    },
    {
      id: "beauty",
      name: "Beauty",
      icon: "💇",
      description: "Salon & spa",
      color: "#ec4899",
    },
    {
      id: "ac-service",
      name: "AC Service",
      icon: "❄️",
      description: "Servis AC",
      color: "#06b6d4",
    },
    {
      id: "klinik",
      name: "Klinik",
      icon: "🏥",
      description: "Kesehatan",
      color: "#8b5cf6",
    },
    {
      id: "cleaning",
      name: "Cleaning",
      icon: "🧹",
      description: "Kebersihan",
      color: "#10b981",
    },
    {
      id: "tutor",
      name: "Tutor",
      icon: "📚",
      description: "Les privat",
      color: "#f59e0b",
    },
  ];

  /* =========================
  PREVIEW DATA BY THEME
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
    "ac-service": [
      { name: "Paket Servis AC", price: 150000, fee: 0 },
      { name: "Perawatan AC", price: 75000, fee: 0 },
    ],
    klinik: [
      { name: "Konsultasi Umum", price: 75000, fee: 0 },
      { name: "Vaksinasi", price: 150000, fee: 0 },
    ],
    cleaning: [
      { name: "Cleaning Rumah", price: 150000, fee: 0 },
      { name: "Deep Cleaning", price: 300000, fee: 0 },
    ],
    tutor: [
      { name: "Matematika SD", price: 75000, fee: 0 },
      { name: "Bahasa Inggris", price: 100000, fee: 0 },
    ],
  };

  const previewData = previewByTheme[form.theme] || previewByTheme.jastip;
  const themeColor = templates.find((t) => t.id === form.theme)?.color || "#2f8f4a";

  /* =========================
  CART PREVIEW
  ========================= */
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

  /* =========================
  RENDER
  ========================= */
  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1>🏪 Tokoinstan</h1>
        <p>Buat toko online gratis, tanpa registrasi rumit</p>
      </div>

      {/* FORM LAYOUT */}
      <div className={styles.splitLayout}>
        {/* FORM COLUMN */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Buat Toko Sekarang</h2>

          <form onSubmit={handleSubmit}>
            {/* Nama Toko */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nama Toko</label>
              <input
                type="text"
                name="name"
                className={styles.formInput}
                placeholder="Masukkan nama toko..."
                value={form.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Nomor WhatsApp */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nomor WhatsApp</label>
              <div className={styles.inputWrapper}>
                <input
                  type="tel"
                  name="wa"
                  className={styles.formInput}
                  placeholder="+62 xxx xxxx xxxx"
                  value={formatWhatsappDisplay(form.wa)}
                  onChange={(e) => handleWhatsappChange(e.target.value)}
                  required
                />
              </div>
              <p className={styles.helperText}>
                Nomor WhatsApp utama untuk chat dengan pelanggan
              </p>
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Email <span className={styles.optional}>(opsional)</span>
              </label>
              <input
                type="email"
                name="email"
                className={styles.formInput}
                placeholder="email@contoh.com"
                value={form.email}
                onChange={handleInputChange}
              />
              <p className={styles.helperText}>
                Email akan digunakan untuk mengirim link Google Sheet
              </p>
            </div>

            {/* Template Selection with Carousel */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Pilih Tema Toko Anda</label>

              {/* Carousel Container */}
              <div className={styles.carouselWrapper}>
                <div className={styles.carouselContainer}>
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`${styles.templateCard} ${form.theme === template.id ? styles.active : ""}`}
                      onClick={() => setForm((p) => ({ ...p, theme: template.id }))}
                      style={{
                        "--theme-color": template.color,
                      }}
                    >
                      <span className={styles.templateIcon}>{template.icon}</span>
                      <span className={styles.templateName}>{template.name}</span>
                      <span className={styles.templateDesc}>{template.description}</span>
                      {form.theme === template.id && (
                        <span className={styles.selectedBadge}>Pilih</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Fade indicators */}
                <div className={styles.fadeLeft}></div>
                <div className={styles.fadeRight}></div>
              </div>

              {/* Scroll hint */}
              <p className={styles.scrollHint}>
                ← Geser untuk melihat lebih banyak template →
              </p>
            </div>

            {/* Subdomain */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nama Toko di URL</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  name="subdomain"
                  className={styles.formInput}
                  placeholder="toko-saya"
                  value={form.subdomain}
                  onChange={handleSubdomainChange}
                  required
                />
                <span className={styles.inputSuffix}>.tokoinstan.online</span>
              </div>
            </div>

            {/* Buttons */}
            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={loading}
                style={{ "--theme-color": themeColor }}
              >
                {loading ? "Menyiapkan toko & Google Sheet..." : "🚀 Buat Toko"}
              </button>

              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setShowPreview(true)}
              >
                👁️ Lihat Preview
              </button>
            </div>
          </form>
        </section>

        {/* PREVIEW COLUMN - Desktop */}
        <div className={styles.previewColumn}>
          <div className={styles.previewWrapper}>
            <div className={styles.mobileFrame}>
              {/* APP HEADER */}
              <div
                className={styles.appHeader}
                style={{ background: `linear-gradient(90deg, ${themeColor}, ${themeColor}99)` }}
              >
                <div className={styles.logo}>{form.name ? form.name.charAt(0) : "T"}</div>
                <div>
                  <div className={styles.shopName}>{form.name || "Nama Toko"}</div>
                  <div className={styles.shopTagline}>
                    {form.subdomain || "tokosaya"}.tokoinstan.online
                  </div>
                </div>
              </div>

              {/* APP CONTENT */}
              <div className={styles.appContent}>
                {/* Hero Section */}
                <div className={styles.heroSection}>
                  <h1>🚀 Belanjain kamu langsung!</h1>
                  <p>Produk & jasa terbaik untuk kamu</p>
                </div>

                {/* Products Grid */}
                <div className={styles.grid}>
                  {previewData.map((p, idx) => (
                    <div
                      key={idx}
                      className={styles.cardProduct}
                      onClick={() => addToCart(p)}
                    >
                      <div className={styles.img}>📷</div>
                      <div className={styles.pname}>{p.name}</div>
                      <div className={styles.price}>{formatRp(p.price)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Icon */}
              <div className={styles.cartIcon} onClick={() => setCartOpen(!cartOpen)}>
                🛒
                {totalQty > 0 && <span className={styles.cartCount}>{totalQty}</span>}
              </div>

              {/* Cart Drawer */}
              <div className={`${styles.cartDrawer} ${cartOpen ? styles.active : ""}`}>
                <div className={styles.cartHeader}>
                  <span>🛍️ Pesanan Kamu</span>
                  <button
                    className={styles.btnMinimize}
                    onClick={() => setCartOpen(false)}
                  >
                    −
                  </button>
                </div>
                {cartItems.length === 0 && (
                  <div className={styles.emptyCart}>Keranjang masih kosong</div>
                )}
                {cartItems.map(([name, item]) => (
                  <div key={name} className={styles.cartItem}>
                    <div className={styles.cartItemName}>
                      <small>{name}</small>
                    </div>
                    <div className={styles.cartControls}>
                      <button onClick={() => {
                        setPreviewCart((prev) => {
                          const copy = { ...prev };
                          if (copy[name]) {
                            copy[name].qty -= 1;
                            if (copy[name].qty <= 0) delete copy[name];
                          }
                          return copy;
                        });
                      }}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => {
                        setPreviewCart((prev) => {
                          const copy = { ...prev };
                          if (copy[name]) {
                            copy[name].qty += 1;
                          }
                          return copy;
                        });
                      }}>+</button>
                    </div>
                  </div>
                ))}
                <div className={styles.cartTotal}>
                  Total: {formatRp(totalPrice)}
                </div>
              </div>

              {/* Footer */}
              <div className={styles.footer}>
                {form.name || "Jastip"} • Jadwal: Senin–Jumat • Order cutoff 16:00
                <br />
                Contact:{" "}
                <a href="#" style={{ color: themeColor }}>
                  Chat WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE PREVIEW MODAL */}
      {showPreview && (
        <div className={styles.mobilePreviewOverlay}>
          <button
            className={styles.closePreview}
            onClick={() => setShowPreview(false)}
          >
            ✕ Tutup
          </button>
          <div className={styles.mobilePreviewBox}>
            <div className={styles.mobileFrame}>
              {/* APP HEADER */}
              <div
                className={styles.appHeader}
                style={{ background: `linear-gradient(90deg, ${themeColor}, ${themeColor}99)` }}
              >
                <div className={styles.logo}>{form.name ? form.name.charAt(0) : "T"}</div>
                <div>
                  <div className={styles.shopName}>{form.name || "Nama Toko"}</div>
                  <div className={styles.shopTagline}>
                    {form.subdomain || "tokosaya"}.tokoinstan.online
                  </div>
                </div>
              </div>

              {/* APP CONTENT */}
              <div className={styles.appContent}>
                {/* Hero Section */}
                <div className={styles.heroSection}>
                  <h1>🚀 Belanjain kamu langsung!</h1>
                  <p>Produk & jasa terbaik untuk kamu</p>
                </div>

                {/* Products Grid */}
                <div className={styles.grid}>
                  {previewData.map((p, idx) => (
                    <div
                      key={idx}
                      className={styles.cardProduct}
                      onClick={() => addToCart(p)}
                    >
                      <div className={styles.img}>📷</div>
                      <div className={styles.pname}>{p.name}</div>
                      <div className={styles.price}>{formatRp(p.price)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Icon */}
              <div className={styles.cartIcon} onClick={() => setCartOpen(!cartOpen)}>
                🛒
                {totalQty > 0 && <span className={styles.cartCount}>{totalQty}</span>}
              </div>

              {/* Cart Drawer */}
              <div className={`${styles.cartDrawer} ${cartOpen ? styles.active : ""}`}>
                <div className={styles.cartHeader}>
                  <span>🛍️ Pesanan Kamu</span>
                  <button
                    className={styles.btnMinimize}
                    onClick={() => setCartOpen(false)}
                  >
                    −
                  </button>
                </div>
                {cartItems.length === 0 && (
                  <div className={styles.emptyCart}>Keranjang masih kosong</div>
                )}
                {cartItems.map(([name, item]) => (
                  <div key={name} className={styles.cartItem}>
                    <div className={styles.cartItemName}>
                      <small>{name}</small>
                    </div>
                    <div className={styles.cartControls}>
                      <button onClick={() => {
                        setPreviewCart((prev) => {
                          const copy = { ...prev };
                          if (copy[name]) {
                            copy[name].qty -= 1;
                            if (copy[name].qty <= 0) delete copy[name];
                          }
                          return copy;
                        });
                      }}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => {
                        setPreviewCart((prev) => {
                          const copy = { ...prev };
                          if (copy[name]) {
                            copy[name].qty += 1;
                          }
                          return copy;
                        });
                      }}>+</button>
                    </div>
                  </div>
                ))}
                <div className={styles.cartTotal}>
                  Total: {formatRp(totalPrice)}
                </div>
              </div>

              {/* Footer */}
              <div className={styles.footer}>
                {form.name || "Jastip"} • Jadwal: Senin–Jumat • Order cutoff 16:00
                <br />
                Contact:{" "}
                <a href="#" style={{ color: themeColor }}>
                  Chat WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.show && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          <div className={styles.toastContent}>
            <h4>{toast.type === "success" ? "✅" : "⚠️"}</h4>
            <p>{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
