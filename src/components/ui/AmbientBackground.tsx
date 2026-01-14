import styles from "./AmbientBackground.module.css";

export default function AmbientBackground() {
  return (
    <div className={styles.backgroundContainer}>
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={`${styles.orb} ${styles.orb3}`} />
    </div>
  );
}
