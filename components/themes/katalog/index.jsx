"use client";

import { useMemo } from "react";

export default function KatalogTheme({ shop, products }) {
  const items = useMemo(
    () => products.filter((p) => p.status !== "off"),
    [products]
  );

  return (
    <div style={{ padding: 24 }}>
      <h1>{shop.name}</h1>
      <p>Katalog Produk</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 12,
        }}
      >
        {items.map((p, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #eee",
              padding: 12,
              borderRadius: 8,
            }}
          >
            {p.img && (
              <img
                src={p.img}
                alt={p.name}
                style={{
                  width: "100%",
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
            )}

            <strong>{p.name}</strong>
            <div>Rp {p.price.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
