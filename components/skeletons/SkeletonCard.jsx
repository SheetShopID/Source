import styles from "./SkeletonCard.module.css";

export default function SkeletonCard({ count = 6 }) {
  return (
    <section className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={`${styles.skel} ${styles.img}`} />
          <div className={styles.content}>
            <div className={`${styles.skel} ${styles.title}`} />
            <div className={`${styles.skel} ${styles.subtitle}`} />
            <div className={`${styles.skel} ${styles.price}`} />
          </div>
          <div className={styles.actions}>
            <div className={`${styles.skel} ${styles.btn}`} />
            <div className={`${styles.skel} ${styles.btn}`} />
          </div>
        </div>
      ))}
    </section>
  );
}
