"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { ref, get } from "firebase/database";

export default function Shop({ params }) {
  const [data, setData] = useState(undefined); // undefined = loading

  useEffect(() => {
    async function fetchShop() {
      try {
        const snap = await get(ref(db, "shops/" + params.shop));
        setData(snap.val());
      } catch (e) {
        console.error(e);
        setData(null);
      }
    }
    fetchShop();
  }, [params.shop]);

  if (data === undefined)
    return <div style={{ padding: 20 }}>Loading toko...</div>;

  if (data === null)
    return <div style={{ padding: 20 }}>Toko tidak ditemukan.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{data.name}</h1>
      <p>{data.desc}</p>
      <p>WA: {data.wa}</p>
    </div>
  );
}
