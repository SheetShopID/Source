"use client";

import { useEffect, useState, useMemo } from "react";
import JastipTemplate from "./templates/JastipTemplate";
import FoodTemplate from "./templates/FoodTemplate";
import LaundryTemplate from "./templates/LaundryTemplate";
import BeautyTemplate from "./templates/BeautyTemplate";

import { formatRp } from "@/lib/utils";
import styles from "./ShopPage.module.css";

export default function ShopPage({ shop }) {
  const [shopData, setShopData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 🚀 Fetch data (JSON langsung dari server)
  useEffect(() => {
    const cacheKey = `shop-cache-${shop}`;

    async function load() {
      try {
        setLoading(true);
        setError("");

        // 💾 Coba ambil cache lokal
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const json = JSON.parse(cached);
          setShopData(json.shop);
          setProducts(json.products);
        }

        // 🌐 Fetch versi terbaru
        const res = await fetch(`/api/get-shop?shop=${shop}`, { cache: "no-store" });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Toko tidak ditemukan");
        }

        const json = await res.json();
        setShopData(json.shop);
        setProducts(json.products);
        localStorage.setItem(cacheKey, JSON.stringify(json));
      } catch (e) {
        console.error("[SHOP PAGE]", e);
        setError(e.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [shop]);

  const Template = useMemo(() => {
    if (!shopData) return null;
    switch (shopData.theme) {
      case "makanan": return FoodTemplate;
      case "laundry": return LaundryTemplate;
      case "beauty": return BeautyTemplate;
      default: return JastipTemplate;
    }
  }, [shopData]);

  // CART HANDLER
  const addToCart = (item, quickBuy = false) => {
    setCart((prev) => {
      const existing = prev[item.name] || { qty: 0, price: item.price, fee: item.fee };
      const newQty = existing.qty + 1;
      return { ...prev, [item.name]: { ...existing, qty: newQty } };
    });
    if (quickBuy) checkout();
  };

  const removeFromCart = (name) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const changeQty = (name, delta) => {
    setCart((prev) => {
      const copy = { ...prev };
      if (!copy[name]) return copy;
      copy[name].qty += delta;
      if (copy[name].qty <= 0) delete copy[name];
      return copy;
    });
  };

  const checkout = () => {
    const items = Object.entries(cart)
      .map(([name, data]) => `${name} x${data.qty} - Rp${formatRp((data.price + data.fee) * data.qty)}`)
      .join("\n");

    const waLink = `https://wa.me/${shopData?.wa}?text=${encodeURIComponent(items || "Saya ingin order")}`;
    window.open(waLink, "_blank");

    setTimeout(() => {
      setCart({});
      setCartOpen(false);
    }, 1000);
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Memuat toko...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!shopData) return <div className="p-10 text-center text-red-600">Toko tidak ditemukan</div>;

  const categories = ["Semua", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];
  const filteredProducts =
    selectedCategory && selectedCategory !== "Semua"
      ? products.filter((p) => p.category === selectedCategory)
      : products;

  const cartItems = Object.entries(cart);
  const totalQty = cartItems.reduce((a, [_, v]) => a + v.qty, 0);
  const totalPrice = cartItems.reduce((a, [_, v]) => a + (v.price + v.fee) * v.qty, 0);

  return (
    <main>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.logo}>JA</div>
        <div>
          <div className={styles.title}>{shopData.name}</div>
          <div className={styles.subtitle}>{shopData.subdomain}.tokoinstan.online</div>
        </div>
        <div className={styles.badge}>Open • Hari ini</div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div>
          <h1>Tagline Produk . .</h1>
          <p>🚆 Belanjain kamu langsung dari Setiabudi, Epicentrum, atau sekitarnya!</p>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <div className={styles.filters}>
        {categories.map((cat) => (
          <div
            key={cat}
            className={`${styles.chip} ${
              selectedCategory === cat || (cat === "Semua" && selectedCategory === "") ? styles.active : ""
            }`}
            onClick={() => setSelectedCategory(cat === "Semua" ? "" : cat)}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* TEMPLATE GRID */}
      <Template
        products={filteredProducts}
        utils={{ formatRp }}
        addToCart={addToCart}
        setSelectedProduct={setSelectedProduct}
      />

      {/* FLOATING CART ICON */}
     <button
        className={styles.cartIcon}
        onClick={() => setCartOpen(!cartOpen)}
        aria-label="Cart"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
        </svg>
      
        {totalQty > 0 && (
          <span className={styles.cartCount}>{totalQty}</span>
        )}
      </button>


      {/* CART DRAWER */}
      <div className={`${styles.cartDrawer} ${cartOpen ? styles.active : ""}`}>
        <div className={styles.cartHeader}>
          <h3>🛍️ Pesanan Kamu</h3>
          <button onClick={() => setCartOpen(false)} className={styles.btnMinimize}>−</button>
        </div>

        {cartItems.length === 0 && <div className={styles.emptyCart}>Keranjang masih kosong</div>}

        {cartItems.map(([name, item]) => (
          <div key={name} className={styles.cartItem}>
            <div className={styles.cartItemName}>
              {name}
              <br />
              <small>{formatRp(item.price)}</small>
            </div>
            <div className={styles.cartControls}>
              <button onClick={() => changeQty(name, -1)}>-</button>
              <span>{item.qty}</span>
              <button onClick={() => changeQty(name, 1)}>+</button>
              <button onClick={() => removeFromCart(name)}>❌</button>
            </div>
          </div>
        ))}

        <div className={styles.cartTotal}>Total: {formatRp(totalPrice)}</div>
        <button onClick={checkout} className={styles.checkout}>Kirim via WhatsApp</button>
      </div>

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
          <div className={styles.modalBackdrop} onClick={() => setSelectedProduct(null)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button className={styles.modalClose} onClick={() => setSelectedProduct(null)}>×</button>
              <img
                src={selectedProduct.img || "https://via.placeholder.com/200"}
                alt={selectedProduct.name}
                className={styles.modalImg}
              />
              <h2 className={styles.modalName}>{selectedProduct.name}</h2>
              {selectedProduct.promo && <div className={styles.modalPromo}>{selectedProduct.promo}</div>}
              <div className={styles.modalShop}>{selectedProduct.shopName}</div>
              <div className={styles.modalPrice}>
                {formatRp(selectedProduct.price)} + Fee {formatRp(selectedProduct.fee)}
              </div>
              <div className={styles.modalActions}>
                <button className={styles.btnAdd} onClick={() => addToCart(selectedProduct)}>+ Titip</button>
                <button className={styles.btnQuick} onClick={() => addToCart(selectedProduct, true)}>Beli Cepat</button>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className={styles.footer}>
          <div>
            {shopData?.name || "Jastip"} • Jadwal: Senin–Jumat • Order cutoff 16:00
          </div>
          <div style={{ marginTop: 6 }}>
            Contact:{" "}
            <a
              href={`https://wa.me/${shopData?.wa || "6289668081647"}`}
              id="waLink"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat WhatsApp
            </a>
          </div>
          <div style={{ marginTop: 8 }}>
             &copy; tokoinstan.shop
          </div>
        </footer>


    </main>
  );
}
