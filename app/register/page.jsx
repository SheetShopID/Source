"use client";
import { useState, useRef } from "react";
import styles from "./RegisterPage.module.css";
import { formatRp } from "@/lib/utils";

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
  const [previewCart, setPreviewCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
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
    { img: "https://picsum.photos/seed/prod1/200/200", name: "Kopi Kenangan", fee: 5000, price: 25000, promo: "Diskon 10%", category: "Minuman" },
    { img: "https://picsum.photos/seed/prod2/200/200", name: "Scarlett Serum", fee: 8000, price: 150000, promo: "", category: "Skincare" },
  ];

  const themeColors = { jastip: "#2f8f4a", makanan: "#f97316", laundry: "#3b82f6",beauty: "#2f8f4a" };
  const themeColor = themeColors[form.theme] || "#2f8f4a";

  // Simulasi Cart Preview
  const addToCart = (item) => {
    setPreviewCart((prev) => {
      const existing = prev[item.name] || { qty: 0, price: item.price, fee: item.fee };
      const newQty = existing.qty + 1;
      return { ...prev, [item.name]: { ...existing, qty: newQty } };
    });
    setCartOpen(true);
  };

  const changeQty = (name, delta) => {
    setPreviewCart((prev) => {
      const copy = { ...prev };
      if (!copy[name]) return copy;
      copy[name].qty += delta;
      if (copy[name].qty <= 0) delete copy[name];
      return copy;
    });
  };

  const removeFromCart = (name) => {
    setPreviewCart((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const cartItems = Object.entries(previewCart);
  const totalQty = cartItems.reduce((a, [_, v]) => a + v.qty, 0);
  const totalPrice = cartItems.reduce((a, [_, v]) => a + (v.price + v.fee) * v.qty, 0);

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
                  <input type="text" className={styles.formInput} name="name" placeholder="Contoh: Jastip Seoul Keren" value={form.name} onChange={handleInputChange} required />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nomor WhatsApp</label>
                  <input type="tel" className={styles.formInput} name="wa" placeholder="81234567890" value={form.wa} onChange={handleInputChange} required />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Subdomain Toko</label>
                  <div className={styles.inputWrapper}>
                    <input type="text" className={styles.formInput} name="subdomain" placeholder="tokosaya" value={form.subdomain} onChange={handleSubdomainChange} required />
                    <span className={styles.inputSuffix}>.tokoinstan.online</span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Link Google Sheet (CSV)</label>
                  <input type="url" className={styles.formInput} name="sheetUrl" placeholder="https://docs.google.com/spreadsheets/d/..." value={form.sheetUrl} onChange={handleInputChange} required />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Pilih Tema</label>
                  <div className={styles.themeGrid}>
                    {[
                      { id: "jastip", label: "Jastip", icon: "🛍️" },
                      { id: "makanan", label: "Makanan", icon: "🍔" },
                      { id: "laundry", label: "Laundry", icon: "👕" },
                      { id: "beauty", label: "Kecantikan", icon: "💅" },
                    ].map((t) => (
                      <div
                        key={t.id}
                        className={`${styles.themeCard} ${
                          form.theme === t.id ? styles.active : ""
                        }`}
                        onClick={() => handleThemeSelect(t.id)}
                      >
                        <span className={styles.themeIcon}>{t.icon}</span>
                        <div className={styles.themeTitle}>{t.label}</div>
                      </div>
                    ))}
                  </div>
                </div>


                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
                  {loading ? "Memproses..." : "Buat Toko Sekarang"}
                </button>

                {/* ✅ Tombol Preview untuk mobile */}
                <button type="button" className={styles.btnPreview} onClick={() => setShowPreview(true)}>
                  📱 Lihat Preview
                </button>
              </form>
            </div>
          </section>

          {/* PREVIEW SIDE — tampil di desktop */}
          <section className={styles.previewColumn}>
            <div className={styles.previewWrapper}>
              <div className={styles.mobileFrame}>
                <div className={styles.appHeader} style={{ background: themeColor }}>
                  <div className={styles.shopName}>{form.name || "Nama Toko"}</div>
                  <div className={styles.shopTagline}>{form.subdomain ? `${form.subdomain}.tokoinstan.online` : "tokosaya.tokoinstan.online"}</div>
                </div>

                <div className={styles.heroSection}>
                  <div>
                    <h1>Tagline Produk . .</h1>
                    <p>🚆 Belanjain kamu langsung dari Setiabudi, Epicentrum, atau sekitarnya!</p>
                  </div>
                  <div className={styles.badge} style={{ background: themeColor }}>Open • Hari ini</div>
                </div>

                <div className={styles.grid}>
                  {previewData.map((item, i) => (
                    <div key={i} className={styles.cardProduct} onClick={() => addToCart(item)}>
                      <div className={styles.img}><img src={item.img} alt="" /></div>
                      {item.promo && <div className={styles.badgePromo}>{item.promo}</div>}
                      <div className={styles.pname}>{item.name}</div>
                      <div className={styles.shop}>Demo Shop</div>
                      <div className={styles.price}>{formatRp(item.price)} + Fee {formatRp(item.fee)}</div>
                    </div>
                  ))}
                </div>

                <div className={styles.cartIcon} onClick={() => setCartOpen(!cartOpen)}>
                  🛒{totalQty > 0 && <span className={styles.cartCount}>{totalQty}</span>}
                </div>

                <div className={`${styles.cartDrawer} ${cartOpen ? styles.active : ""}`}>
                  <div className={styles.cartHeader}>
                    <h3>🛍️ Pesanan Kamu</h3>
                    <button onClick={() => setCartOpen(false)} className={styles.btnMinimize}>−</button>
                  </div>

                  {cartItems.length === 0 && <div className={styles.emptyCart}>Keranjang kosong</div>}

                  {cartItems.map(([name, item]) => (
                    <div key={name} className={styles.cartItem}>
                      <div className={styles.cartItemName}>{name}<br /><small>{formatRp(item.price)}</small></div>
                      <div className={styles.cartControls}>
                        <button onClick={() => changeQty(name, -1)}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => changeQty(name, 1)}>+</button>
                        <button onClick={() => removeFromCart(name)}>❌</button>
                      </div>
                    </div>
                  ))}

                  {cartItems.length > 0 && <div className={styles.cartTotal}>Total: {formatRp(totalPrice)}</div>}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ✅ Modal Preview untuk Mobile */}
      {showPreview && (
        <div className={styles.mobilePreviewOverlay}>
          <div className={styles.mobilePreviewBox}>
            <button className={styles.closePreview} onClick={() => setShowPreview(false)}>× Tutup</button>
            {/* isi preview pakai komponen yang sama */}
            <div className={styles.previewWrapper}>
              <div className={styles.mobileFrame}>
                <div className={styles.appHeader} style={{ background: themeColor }}>
                  <div className={styles.shopName}>{form.name || "Nama Toko"}</div>
                  <div className={styles.shopTagline}>{form.subdomain ? `${form.subdomain}.tokoinstan.online` : "tokosaya.tokoinstan.online"}</div>
                </div>
                <div className={styles.heroSection}>
                  <div><h1>Tagline Produk . .</h1><p>🚆 Belanjain kamu langsung dari Setiabudi, Epicentrum!</p></div>
                  <div className={styles.badge} style={{ background: themeColor }}>Open • Hari ini</div>
                </div>
                <div className={styles.grid}>
                  {previewData.map((p,i)=>(
                    <div key={i} className={styles.cardProduct}><div className={styles.img}><img src={p.img}/></div><div className={styles.pname}>{p.name}</div></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div className={`${styles.toast} ${toast.type === "success" ? styles.success : styles.error}`} onClick={() => setToast({ show: false })}>
          {toast.type === "success" ? "✅" : "⚠️"} {toast.message}
        </div>
      )}
    </>
  );
}

