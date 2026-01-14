"use client";

import { useEffect, useState } from "react";

export default function LogDashboard() {
  const [logs, setLogs] = useState([]);
  const [level, setLevel] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/internal/logs")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch logs");
        return r.json();
      })
      .then(setLogs)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter((l) =>
    level === "all" ? true : l.level === level
  );

  return (
    <div style={{ padding: 24 }}>
      <h1>📊 Log Dashboard</h1>

      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      {loading && <p>Loading logs...</p>}

      {/* FILTER */}
      <div style={{ marginBottom: 16 }}>
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="all">All</option>
          <option value="info">Info</option>
          <option value="warn">Warn</option>
          <option value="error">Error</option>
        </select>
      </div>

      {/* TABLE */}
      <table
        width="100%"
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Time</th>
            <th>Level</th>
            <th>Label</th>
            <th>Source</th>
            <th>Request</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((l) => (
            <tr key={`${l.ts}-${l.requestId || Math.random()}`}>
              <td>{new Date(l.ts).toLocaleString()}</td>
              <td>{l.level}</td>
              <td>{l.label}</td>
              <td>{l.source}</td>
              <td>{l.requestId}</td>
              <td>
                <pre style={{ maxWidth: 300, overflow: "auto" }}>
                  {JSON.stringify(l.data, null, 2)}
                </pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
