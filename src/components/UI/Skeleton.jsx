import styles from './Skeleton.module.scss';

export function ProductSkeleton() {
  return (
    <div className={styles.skeleton}>
      {/* Gallery side */}
      <div className={styles.galleryCol}>
        <div className={`${styles.block} ${styles.mainImg}`} />
        <div className={styles.thumbRow}>
          {[0,1,2,3,4].map(i => (
            <div key={i} className={`${styles.block} ${styles.thumb}`} />
          ))}
        </div>
      </div>

      {/* Info side */}
      <div className={styles.infoCol}>
        <div className={`${styles.block} ${styles.brand}`} />
        <div className={`${styles.block} ${styles.title}`} />
        <div className={`${styles.block} ${styles.titleShort}`} />
        <div className={`${styles.block} ${styles.price}`} />
        <div className={`${styles.block} ${styles.swatches}`} />
        <div className={`${styles.block} ${styles.sizes}`} />
        <div className={`${styles.block} ${styles.btn}`} />
      </div>
    </div>
  );
}
