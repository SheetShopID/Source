"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const FIREBASE_BASE =
  "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";

export default function SetupClient() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Sedang menyiapkan toko…");
  const [status, setStatus] = useState("creating");

  // Ambil subdomain:
  // 1️⃣ dari ?shop=xxx
  // 2️⃣ fallback dari hostname
  const shop =
    searchParams.get("shop") ||
    (typeof window !== "undefined"
      ? window.location.hostname.split(".")[0]
      : null);

  useEffect(() => {
    if (!shop) return;

    let interval;

    const checkStatus = async () => {
      try {
        const res = await fetch(
          `${FIREBASE_BASE}/shops/${shop}.json`,
          { cache: "no-store" }
        );

        const data = await res.json();
        if (!data) return;

        if (data.status === "ready") {
          setStatus("ready");
          setMessage("Toko siap! Mengalihkan…");

          clearInterval(interval);
          setTimeout(() => {
            window.location.href = `https://${shop}.tokoinstan.online`;
          }, 1000);
        } else if (data.status === "failed") {
          setStatus("failed");
          setMessage(
            "Gagal menyiapkan toko. Silakan coba lagi atau hubungi admin."
          );
          clearInterval(interval);
        } else {
          setStatus("creating");
          setMessage("Sedang menyiapkan toko…");
        }
      } catch (err) {
        console.error("[SETUP PAGE ERROR]", err);
      }
    };

    checkStatus();
    interval = setInterval(checkStatus, 2000);

    return () => clearInterval(interval);
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
