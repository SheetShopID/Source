"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { ref, onValue } from "firebase/database";

export default function ShopPage({ shop }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const shopRef = ref(db, `shops/${shop}`);
    const unsub = onValue(shopRef, (snap) => {
      setData(snap.val());
    });

    return () => unsub();
  }, [shop]);

  if (!data) return <p>Memuat data toko...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{data.nama || shop}</h1>
      <p>{data.deskripsi || "Tidak ada deskripsi."}</p>
    </div>
  );
}
