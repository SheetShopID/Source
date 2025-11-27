"use client";

import { headers } from "next/headers";
import ShopPage from "@/components/ShopPage";

export default function Home() {
  const shop = headers().get("x-shop-id");

  if (!shop) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Selamat datang di TokoInstan</h1>
        <p>Gunakan subdomain seperti:</p>
        <b>jastip.tokoinstan.online</b>
      </div>
    );
  }

  return <ShopPage shop={shop} />;
}
