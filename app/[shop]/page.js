"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { ref, get } from "firebase/database";

export default function Shop({ params }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchShop() {
      const snap = await get(ref(db, "shops/" + params.shop));
      setData(snap.val());
    }
    fetchShop();
  }, [params.shop]);

  if (!data)
    return <div style={{ padding: 20 }}>Loading data toko...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{data.name}</h1>
      <p>{data.desc}</p>
      <p>WhatsApp: {data.wa}</p>

      {data.products && (
        <div style={{ marginTop: 20 }}>
          <h2>Produk</h2>
          <ul>
            {Object.entries(data.products).map(([id, item]) => (
              <li key={id}>
                <b>{item.name}</b> — Rp{item.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
