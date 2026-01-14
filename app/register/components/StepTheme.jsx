"use client";

import { THEMES } from "@/lib/themes";

export default function StepTheme({ value, onChange }) {
  return (
    <div>
      <h2>Pilih Tema Toko</h2>
      <p>Tema dapat diubah kapan saja</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginTop: 20,
        }}
      >
        {THEMES.map((t) => (
          <div
            key={t.key}
            onClick={() => onChange(t.key)}
            style={{
              border:
                value === t.key
                  ? "2px solid #000"
                  : "1px solid #ddd",
              borderRadius: 10,
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            <img
              src={t.preview}
              alt={t.name}
              style={{
                width: "100%",
                height: 140,
                objectFit: "cover",
              }}
            />

            <div style={{ padding: 12 }}>
              <strong>{t.name}</strong>
              <p style={{ fontSize: 13, color: "#555" }}>
                {t.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
