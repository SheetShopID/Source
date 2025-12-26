import styles from "./JastipTemplate.module.css";

export default function JastipTemplate({ products, utils, addToCart, setSelectedProduct }) {
  return (
    <section className={styles.grid}>
      {products.map((item, idx) => (
        <div key={idx} onClick={() => setSelectedProduct(item)} className={styles.card}>
        {/* RIBBON PROMO */}
          {item.promo === "Ya" && (
            <div className={styles.ribbonContainer}>
              <span className={styles.ribbon}>PROMO</span>
              <span className={styles.ribbonBottom}></span>
            </div>
          )}
          
          <div className={styles.img}>
            <img
              src={item.img || "https://via.placeholder.com/100"}
              alt={item.name}
            />
          </div>
          <div className={styles.name}>{item.name}</div>
          <div className={styles.shop}>{item.shopName}</div>
          <div className={styles.price}>
            {utils.formatRp(item.price)} + Fee {utils.formatRp(item.fee)}
          </div>

          <button
            className={`${styles.btn} ${styles.add}`}
            onClick={(e) => {
              e.stopPropagation(); // supaya tidak buka modal
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
      ))}
    </section>
  );
}

