// Це твій React-компонент, наприклад /pages/ExchangePage.js

import { useState } from "react";
import api from "../../utils/api"; // Твій файл для API-запитів
import styles from "./ExchangeModal.module.css"; // Твої стилі

// Опції для обміну
const exchangeOptions = [
  { stars: 100, clicks: 100000 },
  { stars: 250, clicks: 250000 },
  { stars: 500, clicks: 500000 },
  { stars: 1000, clicks: 1000000 },
  { stars: 2500, clicks: 2500000 },
  { stars: 10000, clicks: 10000000 },
  { stars: 50000, clicks: 50000000 },
];

export default function ExchangePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // Для повідомлень про успіх або помилку

  // === 🟢 ГОЛОВНА ФУНКЦІЯ, ЯКУ ТРЕБА ВИПРАВИТИ ===
  const handleExchange = async (stars, clicks) => {
    setLoading(true);
    setMessage(""); // Очищуємо старі повідомлення

    try {
      // Робимо запит на той самий роут, що й у бекенді
      const res = await api.post("/api/withdraw/exchange", { stars, clicks });

      // Якщо бекенд повернув success: true
      if (res.data.success) {
        setMessage(res.data.message); // Покажемо "✅ Обмін успішний!"
        // Тут можна також оновити баланс юзера, якщо потрібно
      } else {
        // Це для "м'яких" помилок (якщо бекенд забув повернути .status(400))
        setMessage(`⚠️ ${res.data.message}`);
      }
    } catch (err) {
      
      // === 🟢 ОСЬ ТУТ БУЛА ПОМИЛКА ===
      // 'err' - це об'єкт помилки від Axios
      
      console.error("Exchange error:", err); // Лог для тебе

      // Перевіряємо, чи є у помилці відповідь від сервера (err.response)
      // і чи є в ній наше повідомлення (err.response.data.message)
      if (err.response && err.response.data && err.response.data.message) {
        // ✅ Встановлюємо КОНКРЕТНЕ повідомлення з бекенду
        // (напр, "❗ Для обміну потрібно мати мінімум 5 рефералів")
        setMessage(`⚠️ ${err.response.data.message}`);
      } else {
        // ❌ Це твій старий код, який показував загальну помилку
        setMessage("⚠️ Error creating application");
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Кнопка закриття */}
      <div className={styles.header}>
        <h2 className={styles.title}>Обмін кліків на зірки</h2>
        <button className={styles.closeButton}>×</button>
      </div>

      {/* Список опцій */}
      <div className={styles.optionsList}>
        {exchangeOptions.map((option) => (
          <div key={option.stars} className={styles.optionItem}>
            <div className={styles.starsValue}>
              ⭐ {option.stars.toLocaleString()} Stars
            </div>
            
            <button
              className={styles.exchangeButton}
              onClick={() => handleExchange(option.stars, option.clicks)}
              disabled={loading} // Блокуємо кнопку під час запиту
            >
              {option.clicks.toLocaleString()} кліків
            </button>
          </div>
        ))}
      </div>

      {/* Повідомлення про помилку/успіх */}
      {/* Цей блок буде показувати повідомлення, 
        яке ми встановили у 'handleExchange'
      */}
      {message && (
        <div 
          className={message.includes("✅") ? styles.messageSuccess : styles.messageError}
        >
          {message}
        </div>
      )}
    </div>
  );
}