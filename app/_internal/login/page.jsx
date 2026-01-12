"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    const res = await fetch("/_internal/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });

    if (res.ok) {
      window.location.href = "/_internal/logs";
    } else {
      setError("ID atau password salah");
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: "120px auto", textAlign: "center" }}>
      <h2>Admin Login</h2>

      <input
        placeholder="Admin ID"
        onChange={(e) => setId(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <button onClick={login} style={{ width: "100%" }}>
        Masuk
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
