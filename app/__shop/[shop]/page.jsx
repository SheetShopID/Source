import { headers } from "next/headers";

export default function ShopPage({ params }) {
  const shop = params.shop;

  return (
    <div style={{ padding: 30 }}>
      <h1>SHOP: {shop}</h1>
      <p>Ini halaman khusus untuk subdomain: {shop}.tokoinstan.online</p>

      {/* Di sini kamu ambil Firestore atau Google Sheet */}
    </div>
  );
}
