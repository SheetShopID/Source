"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

/**
 * API selalu dipanggil ke DOMAIN UTAMA
 * karena subdomain toko TIDAK memiliki route /api
 */
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://tokoinstan.online";

export default function SetupClient() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Sedang menyiapkan toko…");
  const [status, setStatus] = useState("creating");

  /**
   * Ambil subdomain toko:
   * 1️⃣ dari query ?shop=xxx
   * 2️⃣ fallback dari hostname (tesjumat.tokoinstan.online → tesjumat)
   */
  const shop =
    searchParams.get("shop") ||
    (typeof window !== "undefined"
      ? window.location.hostname.split(".")[0]
      : null);

  useEffect(() => {
    if (!shop) return;

    let intervalId;

    const checkShopReady = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/get-shop?shop=${shop}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }

        /**
         * Jika toko SUDAH ADA → redirect
         * Jika belum → tetap loading (polling)
         */
        if (data.shop) {
          setStatus("ready");
          setMessage("Toko siap! Mengalihkan…");

          clearInterval(intervalId);

          setTimeout(() => {
            window.location.href = `https://${shop}.tokoinstan.online`;
          }, 1000);
        }
      } catch (err) {
        // toko belum siap → lanjut polling
        setStatus("creating");
        setMessage("Sedang menyiapkan toko…");
      }
    };

    // cek pertama
    checkShopReady();

    // polling tiap 2 detik
    intervalId = setInterval(checkShopReady, 2000);

    return () => clearInterval(intervalId);
  }, [shop]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>{message}</h1>

      {status === "creating" && <p>⏳ Mohon tunggu sebentar…</p>}
      {status === "failed" && (
        <p>⚠️ Terjadi kesalahan saat membuat toko</p>
      )}
    </div>
  );
}
