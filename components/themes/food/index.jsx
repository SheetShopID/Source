"use client";

import { useMemo, useState } from "react";
import CartBar from "./CartBar";

export default function FoodTheme({ shop, products }) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [cart, setCart] = useState([]);

  // =========================
  // KATEGORI
  // =========================
  const categories = useMemo(() => {
    const cats = products
      .map((p) => p.category?.trim())
      .filter(Boolean);
    return ["ALL", ...new Set(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "ALL") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  // =========================
  // CART HANDLER
  // =========================
  const addToCart = (p) => {
    setCart((prev) => {
      const found = prev.find((i) => i.name === p.name);
      if (found) {
        return prev.map((i) =>
          i.name === p.name ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          name: p.name,
          price: p.price,
          fee: p.fee || 0,
          qty: 1,
        },
      ];
    });
  };

  const removeFromCart = (p) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.name === p.name ? { ...i, qty: i.qty - 1 } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  // =========================
  // WHATSAPP CHECKOUT
  // =========================
  const checkoutWA = () => {
    let text = `Halo *${shop.name}* 👋%0A%0ASaya mau pesan:%0A`;

    cart.forEach((i, idx) => {
      text += `${idx + 1}. ${i.name} x${i.qty} = Rp ${(i.price * i.qty).toLocaleString()}%0A`;
    });

    const total = cart.reduce(
      (a, b) => a + (b.price + (b.fee || 0)) * b.qty,
      0
    );

    text += `%0A*Total:* Rp ${total.toLocaleString()}`;
    text += `%0A%0ATerima kasih 🙏`;

    window.open(
      `https://wa.me/${shop.wa}?text=${text}`,
      "_blank"
    );
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={{ padding: 24, paddingBottom: 120 }}>
      <h1>{shop.name}</h1>

      {/* FILTER */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "1px solid #ddd",
              background: activeCategory === c ? "#000" : "#fff",
              color: activeCategory === c ? "#fff" : "#000",
              cursor: "pointer",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* PRODUK */}
      {filteredProducts.map((p, i) => {
        const item = cart.find((c) => c.name === p.name);
        return (
          <div
            key={i}
            style={{
              border: "1px solid #eee",
              padding: 14,
              marginBottom: 12,
              borderRadius: 8,
            }}
          >
            <strong>{p.name}</strong>
            <div>Rp {p.price.toLocaleString()}</div>

            <div style={{ marginTop: 8 }}>
              {!item ? (
                <button onClick={() => addToCart(p)}>Tambah</button>
              ) : (
                <>
                  <button onClick={() => removeFromCart(p)}>-</button>
                  <span style={{ margin: "0 8px" }}>{item.qty}</span>
                  <button onClick={() => addToCart(p)}>+</button>
                </>
              )}
            </div>
          </div>
        );
      })}

      <CartBar cart={cart} onCheckout={checkoutWA} />
    </div>
  );
}
