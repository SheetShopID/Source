"use client";
import { useState } from "react";

/******************************
 * PREVIEW COMPONENT
 ******************************/
function ThemePreview({ theme }) {
  // Styles internal untuk isi preview (agar tetap rapi)
  const previewInnerStyle = {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  };

  const commonText = { fontSize: "14px", fontWeight: "bold", color: "#333", marginBottom: "4px" };
  const commonSubtext = { fontSize: "12px", color: "#888" };
  const commonImg = { width: "100%", height: "80px", objectFit: "cover", borderRadius: "8px", backgroundColor: "#f3f4f6", marginBottom: "8px" };

  if (theme === "makanan") {
    return (
      <div style={previewInnerStyle}>
        <div style={{ borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "10px" }}>
          <h4 style={{ margin: 0, fontSize: "16px", color: "#f97316" }}>🍔 Menu Makanan</h4>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ display: "flex", gap: "12px", paddingBottom: "10px", borderBottom: "1px dashed #eee" }}>
            <div style={{ width: "70px", height: "70px", background: "#fff7ed", borderRadius: "12px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🍔</div>
            <div style={{ flex: 1 }}>
              <div style={commonText}>Burger Spesial</div>
              <div style={{ ...commonSubtext, marginBottom: "8px" }}>Daging sapi, keju, sayur</div>
              <div style={{ color: "#ea580c", fontWeight: "bold", fontSize: "15px" }}>Rp 35.000</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (theme === "laundry") {
    return (
      <div style={previewInnerStyle}>
        <div style={{ borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "10px" }}>
          <h4 style={{ margin: 0, fontSize: "16px", color: "#0ea5e9" }}>🧺 Laundry</h4>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {["Cuci Kering", "Setrika Saja", "Komplit"].map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#f0f9ff", borderRadius: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>✨</div>
                <div style={{ fontWeight: "600", fontSize: "14px" }}>{item}</div>
              </div>
              <div style={{ fontWeight: "bold", color: "#0284c7", fontSize: "14px" }}>Rp 7.000</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: JASTIP
  return (
    <div style={previewInnerStyle}>
      <div style={{ borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "10px" }}>
        <h4 style={{ margin: 0, fontSize: "16px", color: "#db2777" }}>🛍️ Produk Jastip</h4>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {[
          { name: "Tas Import", price: "150.000" },
          { name: "Snack Jepang", price: "45.000" },
          { name: "Skincare", price: "200.000" },
          { name: "Sepatu", price: "350.000" },
        ].map((item, i) => (
          <div key={i} style={{ border: "1px solid #fce7f3", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ height: "80px", background: "#fdf2f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>👜</div>
            <div style={{ padding: "10px" }}>
              <div style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "4px", color: "#831843" }}>{item.name}</div>
              <div style={{ fontSize: "12px", color: "#be185d", fontWeight: "bold" }}>Rp {item.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/******************************
 * REGISTER PAGE
 ******************************/
export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    wa: "",
    sheetUrl: "",
    subdomain: "",
    theme: "jastip",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register-shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Gagal mendaftar");
        setLoading(false);
        return;
      }

      window.location.href = json.redirect;
    } catch {
      setError("Terjadi kesalahan koneksi");
      setLoading(false);
    }
  }

  return (
    <div className="wrapper">
      
      {/* KIRI: FORM REGISTER */}
      <div className="form-container">
        <div className="header-form">
          <h1 className="brand-title">Tokoinstan.</h1>
          <p className="brand-desc">Buat toko onlinemu sendiri dengan fitur katalog keren.</p>
        </div>

        <form onSubmit={submit} className="form-card">
          <div className="input-group">
            <label className="input-label">Nama Toko</label>
            <input 
              name="name" 
              placeholder="Contoh: Jastip Seoul Keren" 
              onChange={onChange} 
              value={form.name} 
              required 
              className="input-field" 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Nomor WhatsApp</label>
            <input 
              name="wa" 
              placeholder="62812345678" 
              onChange={onChange} 
              value={form.wa} 
              required 
              className="input-field" 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Link Google Sheet</label>
            <input 
              name="sheetUrl" 
              placeholder="https://docs.google.com/spreadsheets/d/..." 
              onChange={onChange} 
              value={form.sheetUrl} 
              required 
              className="input-field" 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Subdomain Toko</label>
            <div className="input-with-suffix">
              <input 
                name="subdomain" 
                placeholder="namatoko" 
                onChange={onChange} 
                value={form.subdomain} 
                required 
                className="input-field" 
              />
              <span className="suffix">.tokoinstan.online</span>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Pilih Tema Katalog</label>
            <select 
              name="theme" 
              onChange={onChange} 
              value={form.theme} 
              className="input-field select-field"
            >
              <option value="jastip">🛍️ Jastip (Pink & Grid)</option>
              <option value="makanan">🍔 Makanan (Orange & Menu)</option>
              <option value="laundry">🧺 Laundry (Blue & List)</option>
            </select>
          </div>

          {error && <div className="error-box">{error}</div>}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Memproses..." : "Buat Toko Sekarang"}
          </button>
        </form>
      </div>

      {/* KANAN: LIVE PREVIEW */}
      <div className="preview-container">
        <div className="preview-sticky-wrapper">
          <div className="preview-badge">Live Preview</div>
          <div className="preview-phone-mockup">
            <ThemePreview theme={form.theme} />
          </div>
          <p style={{ marginTop: "16px", textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>
            Desain berubah sesuai tema yang dipilih
          </p>
        </div>
      </div>

      {/* STYLE JSX */}
      <style jsx>{`
        .wrapper {
          display: flex;
          gap: 60px;
          align-items: flex-start;
          justify-content: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 20px;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        /* LEFT SIDE: FORM */
        .form-container {
          flex: 1;
          max-width: 550px;
        }

        .header-form {
          margin-bottom: 32px;
        }

        .brand-title {
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 8px 0;
          background: -webkit-linear-gradient(45deg, #2563eb, #9333ea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -1px;
        }

        .brand-desc {
          color: #64748b;
          font-size: 16px;
          margin: 0;
          line-height: 1.5;
        }

        .form-card {
          background: white;
          padding: 40px;
          border-radius: 24px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .input-group {
          margin-bottom: 20px;
        }

        .input-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .input-field {
          width: 100%;
          padding: 14px 16px;
          font-size: 15px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #f9fafb;
          transition: all 0.2s;
          outline: none;
          font-weight: 500;
        }

        .input-field:focus {
          background: white;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .input-with-suffix {
          position: relative;
        }

        .suffix {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 13px;
          font-weight: 600;
          pointer-events: none;
        }

        .select-field {
          cursor: pointer;
          appearance: none; /* Hilangkan arrow default browser */
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 1rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
        }

        .error-box {
          background: #fee2e2;
          color: #991b1b;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid #fecaca;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(to right, #2563eb, #1d4ed8);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.1s, box-shadow 0.2s;
          box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.4);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.5);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(1px);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* RIGHT SIDE: PREVIEW */
        .preview-container {
          flex: 1;
          max-width: 400px;
        }

        .preview-sticky-wrapper {
          position: sticky;
          top: 40px;
        }

        .preview-badge {
          display: inline-block;
          background: rgba(0,0,0,0.05);
          color: #64748b;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 16px;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .preview-phone-mockup {
          background: white;
          border-radius: 32px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 8px solid #1f2937; /* Dark bezel */
          overflow: hidden;
          position: relative;
          min-height: 500px; /* Tinggi minimal preview */
        }

        /* Mobile Responsive */
        @media (max-width: 900px) {
          .wrapper {
            flex-direction: column-reverse; /* Form di bawah preview di mobile agar preview terlihat dulu */
            gap: 40px;
            padding: 40px 16px;
          }

          .form-container, .preview-container {
            max-width: 100%;
          }

          .preview-phone-mockup {
            max-height: 400px;
            overflow-y: auto;
          }
        }
      `}</style>
    </div>
  );
}
