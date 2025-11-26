import { headers } from "next/headers";
import { db } from "@/firebase/client";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function Page() {
  const shop = headers().get("x-shop-id");

  // Jika tidak memakai subdomain → tampilkan landing
  if (!shop) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Selamat datang di TokoInstan</h1>
        <p>Platform pembuatan toko otomatis dengan Google Sheet.</p>
        <p>Gunakan subdomain: https://NAMA.tokoinstan.online</p>
      </div>
    );
  }

  // Ambil data produk sesuai subdomain
  let products = [];
  try {
    const q = query(
      collection(db, "products"),
      where("shop", "==", shop)
    );
    const snap = await getDocs(q);

    products = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    return <div>Error Firestore: {err.message}</div>;
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Toko: {shop}</h1>
      <h2>Produk:</h2>

      {products.length === 0 && <p>Belum ada produk.</p>}

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <b>{p.name}</b> — {p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
