"use client";
import { useEffect, useState } from "react";

export default function ShopPage({ shop }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("📌 SHOP PARAMETER DITERIMA:", shop);

    async function load() {
      try {
        console.log("⏳ Memanggil API:", `/api/get-shop?shop=${shop}`);

        const res = await fetch(`/api/get-shop?shop=${shop}`);
        console.log("📥 Response object:", res);

        const json = await res.json();
        console.log("📦 JSON hasil fetch:", json);

        setData(json);
      } catch (err) {
        console.log("❌ ERROR saat fetch data:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [shop]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Tidak ada data toko ditemukan...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{data.name}</h1>
      <p>{data.desc}</p>

      <h3>Produk:</h3>
      <pre>{JSON.stringify(data.products, null, 2)}</pre>
    </div>
  );
}
