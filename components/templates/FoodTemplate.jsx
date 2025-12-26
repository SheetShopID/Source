import styles from "./FoodTemplate.module.css";
/*tes*/
export default function FoodTemplate({
  products = [],
  utils,
  addToCart,
}) {
  return (
    <section className={styles.list}>
      {products.map((item, idx) => (
        <article key={idx} className={styles.row}>
          {/* INFO */}
          <div className={styles.info}>
            <h3 className={styles.name}>{item.name}</h3>
            <div className={styles.shop}>{item.shopName}</div>
             
              <div className={styles.rating}>
                ⭐ 4.9
                {item.reviewCount && (
                  <span className={styles.review}> (500+)</span>
                )}
              </div>
            

            {item.desc && (
              <div className={styles.desc}>{item.desc}</div>
            )}

            <div className={styles.price}>
              {utils.formatRp(item.price)}
            </div>
          </div>

          {/* IMAGE + BUTTON */}
          <div className={styles.right}>
            <img
              src={item.img || "https://via.placeholder.com/120"}
              alt={item.name}
              loading="lazy"
            />

            <button
              className={styles.addBtn}
              onClick={() => addToCart(item)}
            >
              Tambah
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}


