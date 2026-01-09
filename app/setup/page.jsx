import { Suspense } from "react";
import SetupClient from "./SetupClient";

export default function SetupPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SetupClient />
    </Suspense>
  );
}

function Loading() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Menyiapkan toko…</h1>
      <p>⏳ Mohon tunggu sebentar</p>
    </div>
  );
}
