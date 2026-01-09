"use client";
import { useState } from "react";
import styles from "./RegisterPage.module.css";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState({
    purpose: "service",
    category: "",
    theme: "jastip",
    name: "",
    wa: "",
    email: "",
    subdomain: "",
  });
  const [loadingText, setLoadingText] = useState("");
  const [urlStatus, setUrlStatus] = useState("");

  // ---------------------------
  // HANDLERS
  // ---------------------------
  const selectPurpose = (type) => setState({ ...state, purpose: type });
  const selectCategory = (cat) => setState({ ...state, category: cat });
  const selectTheme = (theme) => setState({ ...state, theme: theme });

  const updateSlug = (name) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    setState({ ...state, name, subdomain: slug });
    checkUrl(slug);
  };

  const checkUrl = (slug) => {
    setUrlStatus("Mengecek...");
    setTimeout(() => {
      if (["admin", "test", "root", "main"].includes(slug))
        setUrlStatus("⚠️ Alamat tidak tersedia");
      else setUrlStatus("✓ Alamat tersedia");
    }, 600);
  };

  // ---------------------------
  // API Submit (sinkron loading)
  // ---------------------------
  const submitStep5 = async () => {
    if (!state.name || !state.wa || !state.email)
      return alert("Mohon lengkapi semua data");
    if (!state.email.endsWith("@gmail.com"))
      return alert("Gunakan email Gmail");
    if (state.subdomain.length < 4)
      return alert("Subdomain minimal 4 karakter");

    setStep(6);
    setLoadingText("Menyiapkan data...");

    try {
      setLoadingText(`Membuat Google Sheet... (${state.category || "default"})`);
      await new Promise((r) => setTimeout(r, 1500));

      setLoadingText("Membuat Website...");
      await new Promise((r) => setTimeout(r, 2000));

      const res = await fetch("/api/register-shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name,
          wa: state.wa,
          email: state.email,
          subdomain: state.subdomain,
          theme: state.theme,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal membuat toko");

      setLoadingText("Hampir selesai...");
      await new Promise((r) => setTimeout(r, 1500));

      setStep(7);
      setTimeout(() => {
        window.location.href = json.redirect;
      }, 1500);
    } catch {
      alert("Terjadi kesalahan. Coba lagi.");
      setStep(5);
    }
  };

  const nextStep = (s) => setStep(s);
  const prevStep = (s) => setStep(s);

  // ---------------------------
  // VIEW
  // ---------------------------
  return (
    <div className={styles.app}>
      {/* Progress bar */}
      {step >= 2 && step <= 5 && (
        <div className={styles.progressWrap}>
          <div className={styles.progressBarBg}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div className={`${styles.stepContainer} ${styles.active}`}>
          <h1>Website ini akan dipakai untuk apa?</h1>
          <p>Kami siapkan supaya jualan dan order jadi lebih rapi.</p>

          <div
            className={`${styles.card} ${
              state.purpose === "service" ? styles.cardSelected : ""
            }`}
            onClick={() => selectPurpose("service")}
          >
            <span className={styles.cardBadge}>Paling banyak dipilih 🔥</span>
            <div className={styles.cardTitle}>
              Terima Order Jasa via WhatsApp
            </div>
            <div className={styles.cardDesc}>
              Untuk jasa AC, tukang, sedot WC, dan jasa lapangan lainnya
            </div>
          </div>

          <div
            className={`${styles.card} ${
              state.purpose === "product" ? styles.cardSelected : ""
            }`}
            onClick={() => selectPurpose("product")}
          >
            <div className={styles.cardTitle}>Jual Produk / Katalog Online</div>
            <div className={styles.cardDesc}>
              Untuk jual barang, menu, atau katalog produk
            </div>
          </div>

          <div
            className={styles.card}
            onClick={() =>
              alert("Ini akan membuka halaman contoh website (Demo).")
            }
          >
            <div className={styles.cardTitle}>Saya mau lihat contoh dulu</div>
            <div className={styles.cardDesc}>
              Lihat bagaimana website jadi nantinya
            </div>
          </div>

          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => nextStep(2)}
          >
            Lanjut
          </button>
        </div>
      )}

      {/* STEP 2 - PILIH KATEGORI */}
      {step === 2 && (
        <div className={`${styles.stepContainer} ${styles.active}`}>
          <h2>Pilih kategori bisnis kamu</h2>
          <div className={styles.grid2}>
            {["jastip", "makanan", "laundry", "fashion"].map((cat) => (
              <div
                key={cat}
                className={`${styles.gridItem} ${
                  state.category === cat ? styles.gridItemSelected : ""
                }`}
                onClick={() => selectCategory(cat)}
              >
                <div className={styles.gridIcon}>📦</div>
                <div className={styles.gridLabel}>{cat.toUpperCase()}</div>
              </div>
            ))}
          </div>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => nextStep(3)}
          >
            Lanjut
          </button>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => prevStep(1)}
          >
            Kembali
          </button>
        </div>
      )}

      {/* STEP 3 - PILIH TEMA */}
      {step === 3 && (
        <div className={`${styles.stepContainer} ${styles.active}`}>
          <h2>Pilih tampilan tema</h2>
          <div className={styles.grid2}>
            {["jastip", "makanan", "laundry", "gelap"].map((theme) => (
              <div
                key={theme}
                className={`${styles.gridItem} ${
                  state.theme === theme ? styles.gridItemSelected : ""
                }`}
                onClick={() => selectTheme(theme)}
              >
                <div className={styles.gridIcon}>🎨</div>
                <div className={styles.gridLabel}>{theme}</div>
              </div>
            ))}
          </div>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => nextStep(4)}
          >
            Lanjut
          </button>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => prevStep(2)}
          >
            Kembali
          </button>
        </div>
      )}

      {/* STEP 4 - PREVIEW THEME */}
      {step === 4 && (
        <div className={`${styles.stepContainer} ${styles.active}`}>
          <h2>Pratinjau Tampilan Tema</h2>
          <div className={styles.previewFrame}>
            <div className={styles.previewHeader}>
              <h3 style={{ margin: 0, fontSize: 18 }}>{state.theme}</h3>
              <span style={{ fontSize: 12, opacity: 0.9 }}>
                Contoh tampilan {state.theme}
              </span>
            </div>
            <div className={styles.previewBody}>
              <div className={styles.previewItem}>
                <div>
                  <div style={{ fontWeight: 600 }}>Produk A</div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    Deskripsi singkat
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: "#008069" }}>Rp 25rb</div>
              </div>
              <div className={styles.previewItem}>
                <div>
                  <div style={{ fontWeight: 600 }}>Produk B</div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    Contoh produk lain
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: "#008069" }}>Rp 30rb</div>
              </div>
            </div>
          </div>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => nextStep(5)}
          >
            Lanjut Isi Data
          </button>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => prevStep(3)}
          >
            Kembali
          </button>
        </div>
      )}

      {/* STEP 5 - FORM */}
      {step === 5 && (
        <div className={`${styles.stepContainer} ${styles.active}`}>
          <h2>Isi identitas toko kamu</h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Email Google <span className={styles.badgeGmail}>Wajib Gmail</span>
            </label>
            <input
              className={styles.input}
              type="email"
              value={state.email}
              onChange={(e) => setState({ ...state, email: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Nama Toko / Usaha</label>
            <input
              className={styles.input}
              type="text"
              value={state.name}
              onChange={(e) => updateSlug(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Nomor WhatsApp</label>
            <input
              className={styles.input}
              type="tel"
              value={state.wa}
              onChange={(e) => setState({ ...state, wa: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Alamat Website</label>
            <input className={styles.input} value={state.subdomain} readOnly />
            <div className={styles.validationStatus}>{urlStatus}</div>
          </div>

          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={submitStep5}
          >
            Buat Website Saya
          </button>
        </div>
      )}

      {/* STEP 6 - LOADING */}
      {step === 6 && (
        <div className={`${styles.overlayFull} ${styles.overlayShow}`}>
          <div className={styles.spinner}></div>
          <h2>{loadingText}</h2>
        </div>
      )}

      {/* STEP 7 - SUCCESS */}
      {step === 7 && (
        <div className={`${styles.stepContainer} ${styles.active}`} style={{ textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "10px" }}>🎉</div>
          <h1 style={{ color: "#008069" }}>Website kamu sudah siap!</h1>
          <p>Website sudah aktif dan terhubung dengan Google Sheet.</p>

          <div
            className={styles.card}
            onClick={() => nextStep(8)}
          >
            <div className={styles.cardTitle}>📱 Lihat Preview Website</div>
            <div className={styles.cardDesc}>
              Lihat tampilan website kamu secara langsung
            </div>
          </div>
        </div>
      )}

      {/* STEP 8 - PREVIEW */}
      {step === 8 && (
        <div className={`${styles.stepContainer} ${styles.active}`} style={{ padding: 0, background: "#333", color: "white" }}>
          <div style={{ padding: 16, textAlign: "center" }}>
            <h2 style={{ margin: 0, fontSize: 16 }}>Live Preview</h2>
            <span style={{ fontSize: 12, opacity: 0.7 }}>
              {state.subdomain}.tokoinstan.online
            </span>
          </div>

          <div className={styles.previewFrame}>
            <div className={styles.previewHeader}>
              <h3 style={{ margin: 0, fontSize: 18 }}>{state.name}</h3>
              <span style={{ fontSize: 12, opacity: 0.9 }}>
                Solusi Cepat & Terpercaya
              </span>
            </div>

            <div className={styles.previewBody}>
              <div className={styles.previewItem}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Cuci AC Split 0.5 - 1 PK</div>
                  <div style={{ fontSize: 12, color: "#666" }}>Pembersihan menyeluruh</div>
                </div>
                <div style={{ fontWeight: 700, color: "#008069" }}>Rp 50rb</div>
              </div>

              <div className={styles.previewItem}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Bongkar Pasang AC</div>
                  <div style={{ fontSize: 12, color: "#666" }}>Gratis pipa 3 meter</div>
                </div>
                <div style={{ fontWeight: 700, color: "#008069" }}>Rp 150rb</div>
              </div>
            </div>

            <div className={styles.fabWhatsapp}>💬</div>
          </div>
        </div>
      )}
    </div>
  );
}
