import styles from "./ExchangeModal.module.css";

export default function ExchangeModal({ onClose }) {
  const offers = [
    { stars: 100, clicks: 100000 },
    { stars: 250, clicks: 250000 },
    { stars: 500, clicks: 500000 },
    { stars: 1000, clicks: 1000000 },
    { stars: 2500, clicks: 2500000 },
    { stars: 10000, clicks: 10000000 },
    { stars: 50000, clicks: 50000000 },
    { stars: 150000, clicks: 150000000 },
  ];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Обмін кліків на зірки</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        <div className={styles.list}>
          {offers.map((item, i) => (
            <div key={i} className={styles.row}>
              <div className={styles.left}>
                <img src="/images/star.png" alt="star" className={styles.icon} />
                <span className={styles.text}>{item.stars.toLocaleString()} Stars</span>
              </div>
              <div className={styles.right}>
                <span className={styles.price}>{item.clicks.toLocaleString()} кліків</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
