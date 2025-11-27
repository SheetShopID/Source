// app/page.jsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Ambil "shop" dari header
    fetch("/api/get-shop")
      .then(res => res.json())
      .then(async (data) => {
        const shopName = data.shop;
        setShop(shopName);

        if (!shopName) return;

        // Ambil produk berdasarkan shop
        const colRef = collection(db, `shops/${shopName}/products`);
        const snap = await getDocs(colRef);

        const result = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(result);
      });
  }, []);

  return (
    <div style={{ padding: 24 }}>
      {shop ? (
        <>
          <h1>Selamat datang di toko: {shop}</h1>
          <h2>Daftar Produk</h2>

          {products.length === 0 && <p>Produk belum tersedia.</p>}

          <ul>
            {products.map((p) => (
              <li key={p.id}>
                <strong>{p.name}</strong> — Rp {p.price}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Mendeteksi subdomain...</p>
      )}
    </div>
  );
}
