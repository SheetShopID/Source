"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SetupPage() {
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("Sedang menyiapkan toko...");
  const params = useSearchParams();
  const subdomain = params.get("shop") || window.location.hostname.split(".")[0];

  useEffect(() => {
    let interval;
    const checkStatus = async () => {
      try {
        const res = await fetch(`https://tokoinstan-3e6d5-default-rtdb.firebaseio.com/shops/${subdomain}.json`);
        const shop = await res.json();
        if (!shop) return;

        if (shop.status === "ready") {
          setStatus("ready");
          setMessage("Toko siap! Mengalihkan…");
          setTimeout(() => {
            window.location.href = `https://${subdomain}.tokoinstan.online`;
          }, 1000);
          clearInterval(interval);
        } else if (shop.status === "failed") {
          setStatus("failed");
          setMessage("Gagal membuat toko: " + (shop.error || "Unknown error"));
          clearInterval(interval);
        } else {
          setStatus("creating");
          setMessage("Sedang menyiapkan toko…");
        }
      } catch (err) {
        console.error(err);
      }
    };

    interval = setInterval(checkStatus, 2000);
    checkStatus();

    return () => clearInterval(interval);
  }, [subdomain]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>{message}</h1>
      {status === "creating" && <p>⏳ Mohon tunggu sebentar…</p>}
      {status === "failed" && <p>⚠️ Silakan coba lagi atau hubungi support.</p>}
    </div>
  );
}
