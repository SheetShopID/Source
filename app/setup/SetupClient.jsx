"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SetupClient() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Sedang menyiapkan toko…");
  const [status, setStatus] = useState("creating");

  // Ambil subdomain:
  // 1️⃣ dari ?shop=xxx
  // 2️⃣ fallback dari hostname (subdomain)
  const shop =
    searchParams.get("shop") ||
    (typeof window !== "undefined"
      ? window.location.hostname.split(".")[0]
      : null);

  useEffect(() => {
    if (!shop) return;

    let intervalId;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/get-shop?shop=${shop}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }

        /**
         * Karena get-shop FINAL kamu
         * tidak pakai status "creating / ready",
         * maka logikanya:
         * - kalau toko ADA → redirect
         * - kalau belum → tetap loading
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
        console.warn("[SETUP CHECK]", err.message);
        setStatus("creating");
        setMessage("Sedang menyiapkan toko…");
      }
    };

    // cek pertama kali
    checkStatus();

    // polling tiap 2 detik
    intervalId = setInterval(checkStatus, 2000);

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
