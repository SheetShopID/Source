"use client";

import { useMemo } from "react";

export default function JasaTheme({ shop, products }) {
  // Filter hanya jasa aktif
  const services = useMemo(
    () => products.filter((p) => p.status !== "off"),
    [products]
  );

  const orderWA = (service) => {
    const text = `Halo *${shop.name}* 👋%0A
Saya mau pesan jasa:%0A
*${service.name}*%0A
Harga: Rp ${service.price.toLocaleString()}%0A
${service.promo || ""}`;

    window.open(
      `https://wa.me/${shop.wa}?text=${text}`,
      "_blank"
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>{shop.name}</h1>
      <p>Jasa Profesional & Terpercaya</p>

      {services.map((s, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #eee",
            padding: 16,
            marginBottom: 12,
            borderRadius: 8,
          }}
        >
          <strong>{s.name}</strong>
          <div>Rp {s.price.toLocaleString()}</div>

          {s.promo && (
            <div style={{ color: "red" }}>🔥 {s.promo}</div>
          )}

          <button
            onClick={() => orderWA(s)}
            style={{ marginTop: 8 }}
          >
            Pesan via WhatsApp
          </button>
        </div>
      ))}
    </div>
  );
}
