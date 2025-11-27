"use client";
import { useEffect, useState } from "react";

/******************************
 *  UTILS
 ******************************/
const Utils = {
  formatRp: (v) =>
    isNaN(v) ? "Rp0" : "Rp" + v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
  escapeHtml: (s) =>
    (s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;"),
};

/******************************
 *  CSV PARSER
 ******************************/
function parseCSV(text) {
  const rows = text.trim().split("\n");
  const headers = rows[0].split(",");

  return rows.slice(1).map((row) => {
    const cols = row.split(",");

    const obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = cols[i]?.trim() ?? "";
    });
    return obj;
  });
}

/******************************
 *  SHOP PAGE COMPONENT
 ******************************/
export default function ShopPage({ shop }) {
  const [data, setData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // 1. Fetch data shop dari Firebase
        const res = await fetch(`/api/get-shop?shop=${shop}`);
        const json = await res.json();
        setData(json);

        // 2. Jika ada sheetUrl → fetch CSV-nya
        if (json.sheetUrl) {
          const sheetRes = await fetch(json.sheetUrl);
          const csvText = await sheetRes.text();

          const parsed = parseCSV(csvText);

          // 3. Konversi CSV menjadi array produk standar
          const mapped = parsed.map((p) => ({
            name: p.Name || "",
            shop: p.Shop || "",
            price: Number(p.Price || 0),
            img: p.Img || "",
            fee: Number(p.Fee || 0),
            category: p.Category || "",
            promo: p.Promo || "",
          }));

          setProducts(mapped);
        }
      } catch (err) {
        console.error("❌ Error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [shop]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Toko tidak ditemukan...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{data.name}</h1>
      <p>{data.desc}</p>

      <h2>Produk</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 20,
        }}
      >
        {products.map((p, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #ddd",
              padding: 10,
              borderRadius: 8,
              background: "#fff",
            }}
          >
            {p.img ? (
              <img
                src={p.img}
                alt={p.name}
                style={{ width: "100%", height: 120, objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  height: 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#eee",
                  color: "#999",
                }}
              >
                {p.shop}
              </div>
            )}

            <h3>{Utils.escapeHtml(p.name)}</h3>
            <p>{Utils.formatRp(p.price)} + Fee {Utils.formatRp(p.fee)}</p>
            <p>Kategori: {p.category}</p>

            {p.promo && <p style={{ color: "green" }}>Promo: {p.promo}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
