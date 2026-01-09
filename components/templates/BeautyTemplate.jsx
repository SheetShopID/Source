import styles from "./BeautyTemplate.module.css";

export default function BeautyTemplate({ products, utils, addToCart, setSelectedProduct }) {
  return (
    <section className={styles.container}>
      {/* Header Section */}
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h2>✨ Perawatan Diri, Hasil Nyata</h2>
          <p>Temukan layanan kecantikan terbaik dari toko kami. Booking mudah, hasil memuaskan.</p>
        </div>
        <div className={styles.heroImg}>
          <img src="/images/beauty-hero.jpg" alt="Beauty" />
        </div>
      </div>

      {/* List Produk / Layanan */}
      <div className={styles.list}>
        {products.map((item, idx) => (
          <div key={idx} className={styles.card} onClick={() => setSelectedProduct?.(item)}>
            <div className={styles.imageBox}>
              <img
                src={item.img || "https://via.placeholder.com/200x150"}
                alt={item.name}
              />
              {item.promo && <div className={styles.badge}>{item.promo}</div>}
            </div>

            <div className={styles.info}>
              <h3>{item.name}</h3>
              <p className={styles.desc}>
                {item.category || "Perawatan Spesial"} <br />
                Fee: {utils.formatRp(item.fee || 0)}
              </p>
              <div className={styles.price}>{utils.formatRp(item.price)}</div>

              <div className={styles.actions}>
                <button onClick={() => addToCart(item)}>+ Pesan</button>
                <button onClick={() => addToCart(item, true)}>Reservasi Cepat</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export const previewImage = "/preview/beauty.jpg";
