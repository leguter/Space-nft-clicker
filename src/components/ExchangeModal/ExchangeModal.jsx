import { useState } from "react";
import styles from "./ExchangeModal.module.css";
import api from "../../utils/api";
 import { toast } from 'react-toastify'; // ❗️ Додайте цей імпорт
export default function ExchangeModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  // const [message, setMessage] = useState(null);

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


// ... (ваш код)

const handleExchange = async (item) => {
  try {
    setLoading(true);
    // setMessage(null); // ❗️ Більше не потрібно

    const res = await api.post("/api/withdraw/request", {
      stars: item.stars,
      clicks: item.clicks,
    });

    if (res.success) {
      // setMessage("✅ Заявка на вивід успішно створена!"); ❗️ Замініть це
      toast.success("✅ Withdrawal request successfully created!"); // ✅ На це
    } else {
      // setMessage(`⚠️ ${res.message || "Помилка при створенні заявки"}`); ❗️ Замініть це
      toast.warn(`⚠️ ${res.message || "Error creating application"}`); // ✅ На це
    }

  } catch (err) {
    console.error("Exchange error:", err);
    if (err.response && err.response.data && err.response.data.message) {
      // setMessage(`⚠️ ${err.response.data.message}`); ❗️ Замініть це
      toast.error(`⚠️ ${err.response.data.message}`); // ✅ На це (напр: "❗ Потрібно 5 рефералів")
    } else {
      // setMessage("❌ Сталася помилка. Спробуйте пізніше."); ❗️ Замініть це
      toast.error("❌ An error occurred. Please try again later."); // ✅ На це
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

        {/* {message && <div className={styles.message}>{message}</div>} */}
      </div>
    </div>
  );
}
