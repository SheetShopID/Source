import styles from "./JastipTemplate.module.css";

export default function JastipTemplate({ products, utils, addToCart, setSelectedProduct }) {
  return (
    <section className={styles.grid}>
      {products.map((item, idx) => (
        <div
          key={idx}
          className={styles.card}
          onClick={() => setSelectedProduct(item)}
        >
          {/* PROMO RIBBON */}
          {item.promo === "Ya" && (
            <div className={styles.ribbonContainer}>
              <span className={styles.ribbon}>PROMO</span>
              <span className={styles.ribbonBottom}></span>
            </div>
          )}

          {/* IMAGE */}
          <div className={styles.img}>
            <img src={item.img || "https://via.placeholder.com/300"} alt={item.name} />
          </div>

          {/* CONTENT */}
          <div className={styles.content}>
            <div className={styles.name}>{item.name}</div>
            <div className={styles.shop}>{item.shopName}</div>

            <div className={styles.priceRow}>
              <span className={styles.price}>
                {utils.formatRp(item.price)}
              </span>
              <span className={styles.fee}>
                + Fee {utils.formatRp(item.fee)}
              </span>
            </div>

            {item.estimasi && (
              <div className={styles.estimate}>⏱️ {item.estimasi}</div>
            )}
          </div>

          {/* ACTION */}
          <div className={styles.actions}>
            <button
              className={`${styles.btn} ${styles.add}`}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(item);
              }}
            >
              + Titip
            </button>

            <button
              className={`${styles.btn} ${styles.quick}`}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(item, true);
              }}
            >
              Beli Cepat
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

