import { useState } from "react";
import styles from "./ExchangeModal.module.css";
import api from "../../utils/api";
import { toast } from 'react-toastify'; 

export default function ExchangeModal({ onClose }) {
  const [loading, setLoading] = useState(false);

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
  // ❗️ 1. Додано, щоб не можна було натиснути 100 разів
  if (loading) return; 

  try {
    setLoading(true);

    const res = await api.post("/api/exchange", {
      stars: item.stars,
      clicks: item.clicks,
    });

    // ❗️ 2. ВИПРАВЛЕНО: 'res.success' -> 'res.data.success'
    if (res.data.success) { 
      toast.success(res.data.message || "✅ Обмін успішний!"); // ❗️ 3. ВИПРАВЛЕНО: 'res.data.message'
    } else {
      // (Це спрацює, якщо сервер повернув 200 ОК, але success: false)
      toast.warn(`⚠️ ${res.data.message || "Error creating application"}`); // ❗️ 4. ВИПРАВЛЕНО: 'res.data.message'
    }

  } catch (err) {
    // (Цей блок спрацює, якщо сервер повернув помилку 400/500)
    console.error("Exchange error:", err);
    if (err.response && err.response.data && err.response.data.message) {
      // Цей код у тебе вже був правильний!
      toast.error(`⚠️ ${err.response.data.message}`); // (напр: "❗ Потрібно 5 рефералів")
    } else {
      toast.error("❌ An error occurred. Please try again later.");
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
              </div>
              
              {/* ❗️ 5. Цей рядок `{loading}` просто виводить 'true'/'false'. 
                   Можливо, ти хотів тут бачити спіннер? 
                   Якщо ні, його краще видалити. 
                   Я залишив його, як ти просив (не міняти структуру).
              */}
              {loading} 
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}