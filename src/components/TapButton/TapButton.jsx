import styles from './TapButton.module.css';

export default function TapButton({ isTapped, onClick }) {
  return (
    <div
      className={`${styles.tapButton} ${isTapped ? styles.tapped : ""}`}
      // ✅ Застосовуємо отриманий обробник тут
      onClick={onClick} 
    >
      <div className={styles.tapButtonInner}>
        <span className={styles.tapIcon}>👆</span>
        <span className={styles.tapText}>Tap</span>
      </div>
    </div>
  );
}