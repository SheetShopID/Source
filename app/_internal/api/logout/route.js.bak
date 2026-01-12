"use client";
import { useState } from "react";
import { decide } from "./decision";

const FIREBASE_BASE = "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";

export default function LogInspector() {
  const [query, setQuery] = useState("");
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    setLogs([]);
    setResult(null);

    const res = await fetch(`${FIREBASE_BASE}/logs.json`);
    const data = await res.json();

    const list = Object.values(data || {}).filter(l =>
      l.requestId === query || l.data?.email === query || l.data?.subdomain === query
    ).sort((a,b) => new Date(a.ts) - new Date(b.ts));

    setLogs(list);
    setResult(decide(list));
    setLoading(false);
  };

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>🔍 Log Inspector</h1>

      <input
        placeholder="RequestId / Email / Subdomain"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ padding: 8, width: 320 }}
      />
      <button onClick={search} style={{ marginLeft: 8 }}>Cari</button>

      {loading && <p>Mencari log...</p>}

      {result && (
        <div style={{ marginTop: 24, padding: 16, border: "1px solid #ccc" }}>
          <h2>Status: {result.status}</h2>
          <p><b>Root Cause:</b> {result.cause}</p>
          <p>{result.message}</p>
        </div>
      )}

      {logs.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3>Timeline Log</h3>
          <ul>
            {logs.map((l,i) => (
              <li key={i}>
                [{l.ts}] <b>{l.label}</b>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}