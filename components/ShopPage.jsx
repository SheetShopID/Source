"use client";

import { useEffect, useState, useMemo } from "react";
import JastipTemplate from "./templates/JastipTemplate";
import FoodTemplate from "./templates/FoodTemplate";
import LaundryTemplate from "./templates/LaundryTemplate";
import { formatRp } from "@/lib/utils";
import { parseCSV, convertSheetToCSVUrl } from "@/lib/csv";

export default function ShopPage({ shop }) {
  const [shopData, setShopData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  /******************************
   * LOAD DATA
   ******************************/
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`/api/get-shop?shop=${shop}`, { cache: "no-store" });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Toko tidak ditemukan");
        }

        const shopJson = await res.json();
        setShopData(shopJson);

        if (shopJson.sheetUrl) {
          const csvUrl = convertSheetToCSVUrl(shopJson.sheetUrl);
          const csvRes = await fetch(csvUrl);
          if (!csvRes.ok) throw new Error("Gagal mengambil data produk");

          const csvText = await csvRes.text();
          const parsed = parseCSV(csvText);

          setProducts(
            parsed.map((p) => ({
              name: p.name,
              price: Number(p.price) || 0,
              img: p.img || "",
              fee: Number(p.fee) || 0,
              category: p.category || "",
              promo: p.promo || "",
              shopName: p.shopName || shopJson.name,
            }))
          );
        }
      } catch (e) {
        console.error("[SHOP PAGE]", e);
        setError(e.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [shop]);

  /******************************
   * TEMPLATE SELECTOR
   ******************************/
  const Template = useMemo(() => {
    if (!shopData) return null;
    switch (shopData.theme) {
      case "makanan":
        return FoodTemplate;
      case "laundry":
        return LaundryTemplate;
      default:
        return JastipTemplate;
    }
  }, [shopData]);

  /******************************
   * CART HANDLERS
   ******************************/
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
        .map(
          ([name, data]) =>
            `${name} x${data.qty} - Rp${formatRp(
              (data.price + data.fee) * data.qty
            )}`
        )
        .join("\n");
    
      const waLink = `https://wa.me/${shopData?.wa}?text=${encodeURIComponent(
        items || "Saya ingin order"
      )}`;
    
      // Buka WhatsApp
      window.open(waLink, "_blank");
    
      // ✅ Reset keranjang setelah 1 detik (memberi waktu browser buka WA)
      setTimeout(() => {
        setCart({});
        setCartOpen(false);
      }, 1000);
    };


  /******************************
   * RENDER STATES
   ******************************/
  if (loading)
    return <div className="p-10 text-center text-gray-500">Memuat toko...</div>;
  if (error)
    return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!shopData)
    return (
      <div className="p-10 text-center text-red-600">Toko tidak ditemukan</div>
    );

  /******************************
   * CATEGORY + CART SUMMARY
   ******************************/
  const categories = ["Semua", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];
  const filteredProducts =
    selectedCategory && selectedCategory !== "Semua"
      ? products.filter((p) => p.category === selectedCategory)
      : products;

  const cartItems = Object.entries(cart);
  const totalQty = cartItems.reduce((a, [_, v]) => a + v.qty, 0);
  const totalPrice = cartItems.reduce(
    (a, [_, v]) => a + (v.price + v.fee) * v.qty,
    0
  );

  /******************************
   * UI
   ******************************/
  return (
    <main>
      {/* HEADER */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "14px 16px",
          borderBottom: "1px solid #e6efe6",
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "#2f8f4a",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
          }}
        >
          JA
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{shopData.name}</div>
          <div style={{ fontSize: 12, color: "#6b6b6b" }}>
            {shopData.subdomain}.tokoinstan.online
          </div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            background: "#2f8f4a",
            color: "#fff",
            padding: "8px 10px",
            borderRadius: 12,
            fontSize: 13,
            position: "fixed",
            right: 23,
            top: 16,
            zIndex: 11,
          }}
        >
          Open • Hari ini
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          background: "#fff",
          padding: 14,
          borderRadius: 16,
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          display: "flex",
          gap: 14,
          alignItems: "center",
          position: "relative",
          margin: "14px",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
            Tagline Produk . .
          </h1>
          <p style={{ marginTop: 6, fontSize: 13, color: "#6b6b6b" }}>
            🚆 Belanjain kamu langsung dari Setiabudi, Epicentrum, atau
            sekitarnya!
          </p>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          margin: "16px 14px 12px",
        }}
      >
        {categories.map((cat) => (
          <div
            key={cat}
            style={{
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 500,
              borderRadius: 999,
              cursor: "pointer",
              border: "1px solid #dfe7df",
              background:
                selectedCategory === cat ||
                (cat === "Semua" && selectedCategory === "")
                  ? "#2f8f4a"
                  : "#fff",
              color:
                selectedCategory === cat ||
                (cat === "Semua" && selectedCategory === "")
                  ? "#fff"
                  : "#000",
            }}
            onClick={() => setSelectedCategory(cat === "Semua" ? "" : cat)}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* TEMPLATE GRID */}
      <Template products={filteredProducts} utils={{ formatRp }} addToCart={addToCart} />

      {/* FLOATING CART ICON */}
      <button
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#2f8f4a",
          color: "#fff",
          fontSize: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          cursor: "pointer",
          transition: "0.2s",
        }}
        onClick={() => setCartOpen(!cartOpen)}
      >
        🛒
        {totalQty > 0 && (
          <span
            style={{
              position: "absolute",
              top: 4,
              right: 6,
              background: "#ff5757",
              color: "#fff",
              fontSize: 12,
              padding: "2px 6px",
              borderRadius: 10,
              display: "inline-block",
            }}
          >
            {totalQty}
          </span>
        )}
      </button>

      {/* CART DRAWER */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          boxShadow: "-2px -2px 24px rgba(0,0,0,0.15)",
          padding: 20,
          transform: cartOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.22s cubic-bezier(.25,.1,.25,1)",
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <h3>🛍️ Pesanan Kamu</h3>
          <button
            onClick={() => setCartOpen(false)}
            style={{
              background: "rgba(0,0,0,0.05)",
              border: "none",
              borderRadius: 8,
              fontSize: 18,
              width: 32,
              height: 32,
              cursor: "pointer",
            }}
          >
            −
          </button>
        </div>

        {cartItems.length === 0 && (
          <div style={{ color: "#666", fontSize: 13 }}>Keranjang masih kosong</div>
        )}

        {cartItems.map(([name, item]) => (
          <div
            key={name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "8px 0",
              borderBottom: "1px solid #eee",
              paddingBottom: 6,
            }}
          >
            <div style={{ fontSize: 13 }}>
              {name}
              <br />
              <small>Rp{formatRp(item.price)}</small>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                onClick={() => changeQty(name, -1)}
                style={{
                  background: "#eef6ee",
                  border: "none",
                  borderRadius: 6,
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
              >
                -
              </button>
              <span style={{ minWidth: 20, textAlign: "center" }}>{item.qty}</span>
              <button
                onClick={() => changeQty(name, 1)}
                style={{
                  background: "#eef6ee",
                  border: "none",
                  borderRadius: 6,
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
              >
                +
              </button>
              <button
                onClick={() => removeFromCart(name)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#e15555",
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                ❌
              </button>
            </div>
          </div>
        ))}

        <div style={{ marginTop: 8, fontWeight: 700 }}>
          Total: Rp{formatRp(totalPrice)}
        </div>
        <button
          onClick={checkout}
          style={{
            background: "#2f8f4a",
            color: "#fff",
            border: 0,
            padding: 10,
            width: "100%",
            borderRadius: 10,
            fontWeight: 600,
            marginTop: 12,
            cursor: "pointer",
          }}
        >
          Kirim via WhatsApp
        </button>
      </div>
    </main>
  );
}
