"use client";
import { useEffect, useState } from "react";

export default function LogInspector() {
  const [logs, setLogs] = useState([]);
  const [shop, setShop] = useState("");

  const loadLogs = async () => {
    const res = await fetch(`/api/internal/logs?shop=${shop}`);
    const json = await res.json();
    if (json.ok) setLogs(json.logs);
  };

  const logout = async () => {
    await fetch("/_internal/api/logout", { method: "POST" });
    window.location.href = "/_internal/login";
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Log Inspector</h2>

      <input
        placeholder="subdomain (contoh: jastip)"
        value={shop}
        onChange={(e) => setShop(e.target.value)}
      />
      <button onClick={loadLogs}>Cari</button>
      <button onClick={logout} style={{ marginLeft: 10 }}>
        Logout
      </button>

      <pre style={{ marginTop: 20 }}>
        {JSON.stringify(logs, null, 2)}
      </pre>
    </div>
  );
}
