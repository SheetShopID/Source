import styles from "./LaundryTemplate.module.css";

export default function LaundryTemplate({ products, utils, addToCart, setSelectedProduct }) {
  return (
    <section className={styles.container}>
      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h2>🧺 Laundry Bersih, Wangi, Tepat Waktu</h2>
          <p>
            Cuci kiloan, setrika, hingga dry clean. Dikerjakan cepat & profesional!
          </p>
        </div>
        <div className={styles.heroImg}>
          <img
            src="/images/laundry-hero.jpg"
            alt="Laundry"
          />
        </div>
      </div>

      {/* LIST PRODUK */}
      <div className={styles.list}>
        {products.map((item, idx) => {
          const isMembership = item.promo?.toLowerCase().includes("ya");
          return (
            <div
              key={idx}
              className={`${styles.card} ${isMembership ? styles.membership : ""}`}
              onClick={() => setSelectedProduct?.(item)}
            >
              <div className={styles.imageBox}>
                <img
                  src={item.img || "https://via.placeholder.com/200x150"}
                  alt={item.name}
                />
                {item.promo && <div className={styles.badge}>{item.promo}</div>}
              </div>

              <div className={styles.info}>
                <h3>{item.name}</h3>

                <div className={styles.meta}>
                  {item.status && (
                    <span
                      className={`${styles.status} ${
                        item.status.toLowerCase().includes("selesai")
                          ? styles.done
                          : item.status.toLowerCase().includes("dicuci")
                          ? styles.progress
                          : styles.waiting
                      }`}
                    >
                      {item.status}
                    </span>
                  )}
                  {item.estimasi && (
                    <span className={styles.estimasi}>
                      ⏱ {item.estimasi} jam
                    </span>
                  )}
                </div>

                <div className={styles.price}>
                  {utils.formatRp(item.price)} / {item.fee || "kg"}
                </div>

                <div className={styles.actions}>
                  <button onClick={() => addToCart(item)}>+ Tambah</button>
                  <button onClick={() => addToCart(item, true)}>Pesan Cepat</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export const previewImage = "/preview/laundry.jpg";


