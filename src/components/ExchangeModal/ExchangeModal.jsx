import { useState } from "react";
import styles from "./ExchangeModal.module.css";
import api from "../../utils/api";

export default function ExchangeModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

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

  const handleExchange = async (item) => {
  try {
    setLoading(true);
    setMessage(null);

    // ✅ правильний бекенд-роут
    const res = await api.post("/api/withdraw/request", {
      stars: item.stars,
      clicks: item.clicks,
    });

    // Цей блок тепер виконається ТІЛЬКИ при успіху (статус 200)
    // 'res' тут - це 'res.data' з axios
    if (res.success) {
      setMessage("✅ Заявка на вивід успішно створена!");
    } else {
      // Цей блок, ймовірно, ніколи не виконається, але ми його залишимо
      setMessage(`⚠️ ${res.message || "Помилка при створенні заявки"}`);
    }

  } catch (err) {
    
    // ❗️ БЛОК CATCH ТЕПЕР ПРАЦЮЄ ПРАВИЛЬНО ❗️
    // Сюди код потрапить при помилці 400 (немає рефералів) або 500
    
    console.error("Exchange error:", err);

    if (err.response && err.response.data && err.response.data.message) {
      // Дістаємо повідомлення з бекенду (напр: "❗ Для виводу потрібно 5 рефералів")
      setMessage(`⚠️ ${err.response.data.message}`);
    } else {
      // Запасний варіант, якщо щось пішло не так (напр. немає зв'язку)
      setMessage("❌ Сталася помилка. Спробуйте пізніше.");
    }

  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Обмін кліків на зірки</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        <div className={styles.list}>
          {offers.map((item, i) => (
            <div key={i} className={styles.row} onClick={() => handleExchange(item)}>
              <div className={styles.left}>
                <img src="/images/star.png" alt="star" className={styles.icon} />
                <span className={styles.text}>{item.stars.toLocaleString()} Stars</span>
              </div>
              <div className={styles.right}>
                <span className={styles.price}>{item.clicks.toLocaleString()} кліків</span>
                {/* <button
                  disabled={loading}
                  onClick={() => handleExchange(item)}
                  className={styles.exchangeBtn}
                >
                  {loading ? "⏳..." : "Вивести"}
                </button> */}
              </div>
               {loading}
            </div>
          ))}
        </div>

        {message && <div className={styles.message}>{message}</div>}
      </div>
    </div>
  );
}
