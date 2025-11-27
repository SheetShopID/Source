import { useState, useEffect } from "react";

export default function ShopPage({ shop }) {
  const [shopData, setShopData] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchShop();
  }, []);

  async function fetchShop() {
    try {
      const response = await fetch(`/api/get-shop?shop=${shop}`);
      const data = await response.json();

      setShopData(data);
      fetchCSV(data.sheetUrl);
    } catch (err) {
      console.error("❌ Error fetching shop:", err);
    }
  }

  async function fetchCSV(url) {
    try {
      const res = await fetch(url);
      const csvText = await res.text();

      const rows = csvText.split("\n").map((r) => r.trim());
      const headers = rows[0].split(",");

      const items = rows.slice(1).map((row) => {
        const cols = row.split(",");
        let obj = {};
        headers.forEach((h, i) => {
          obj[h] = cols[i] || "";
        });
        return obj;
      });

      setProducts(items);
    } catch (err) {
      console.error("❌ Error parsing CSV:", err);
    }
  }

  // Format harga
  function formatPrice(price) {
    if (!price) return "-";
    return Number(price).toLocaleString("id-ID");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Produk {shopData?.name}</h1>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        {products.map((p, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              overflow: "hidden",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            {/* IMAGE */}
            <div
              style={{
                width: "100%",
                height: 140,
                background: "#f2f2f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {p.Img ? (
                <img
                  src={p.Img}
                  alt={p.Name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <span style={{ color: "#777" }}>No Image</span>
              )}
            </div>

            {/* CONTENT */}
            <div style={{ padding: 12 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  marginBottom: 6,
                  minHeight: 38,
                }}
              >
                {p.Name}
              </div>

              {/* PRICE */}
              <div
                style={{
                  color: "#e53935",
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                Rp {formatPrice(p.Price)}
              </div>

              {/* CATEGORY */}
              {p.Category && (
                <div
                  style={{
                    display: "inline-block",
                    padding: "4px 8px",
                    borderRadius: 6,
                    background: "#e3f2fd",
                    color: "#1e88e5",
                    fontSize: 12,
                    marginBottom: 6,
                  }}
                >
                  {p.Category}
                </div>
              )}

              {/* PROMO */}
              {p.Promo && p.Promo !== "-" && (
                <div
                  style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    background: "#ffebee",
                    color: "#d32f2f",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  🎁 Promo: {p.Promo}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
