import { useState, useEffect } from "react";
// 1. Імпортуємо useNavigate
import { useNavigate } from "react-router-dom"; 
import api from "../../utils/api";
import styles from "./DepositPage.module.css";

export default function DepositPage() {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState(0);

  // 2. Ініціалізуємо хук навігації
  const navigate = useNavigate();

  const depositOptions = [
    { amount: 1, bonus: 0 },
    { amount: 50, bonus: 0 },
    { amount: 100, bonus: 20 },
    { amount: 500, bonus: 100 },
    { amount: 1000, bonus: 300 },
  ];

  // === Завантаження поточного балансу ===
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await api.get("/api/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (res.data && res.data.internal_stars !== undefined) {
          setBalance(res.data.internal_stars);
        } else {
          console.warn("Не знайдено 'internal_stars' у відповіді", res.data);
          setBalance(0);
        }

      } catch (err) {
        console.error("❌ Failed to fetch balance:", err.response?.data || err.message);
      }
    };
    fetchBalance();
  }, []); 

  // === Створення інвойсу (цей код вже правильний) ===
  const handleDeposit = async (amount) => {
    setLoading(true);
    setSelected(amount);
    setMessage("");

    try {
      const res = await api.post("/api/deposit/create_invoice", { amount });
      if (!res.data?.success) return setMessage("Failed to create invoice");

      const { invoice_link, payload } = res.data;
      setMessage("💳 We open the payment...");

      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.openInvoice(invoice_link);

        const onInvoiceClosed = async (eventData) => {
          tg.offEvent("invoiceClosed", onInvoiceClosed);

          if (eventData.status === "paid") {
            setMessage("✅ Payment is completed. We are checking the server...");

            try {
              const completeRes = await api.post("/api/deposit/complete", { payload });
              if (completeRes.data?.success) {
                setBalance(completeRes.data.internal_stars);
                setMessage("💰 Balance updated!");
              } else {
                setMessage("❌ Payment is not confirmed on the server");
              }
            } catch (err) {
              console.error(err);
              setMessage("⚠️ It was not possible to restore the balance");
            }
          } else {
            setMessage("❌ Payment declined or not completed");
          }
        };

        tg.onEvent("invoiceClosed", onInvoiceClosed);
      } else {
        window.open(invoice_link, "_blank");
        setMessage("Відкрито у новому вікні. Баланс оновиться після підтвердження платежу на сервері.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Помилка при створенні інвойсу");
    } finally {
      setLoading(false);
    }
  };

  // === Рендер компонента ===
  return (
    <div className={styles.Container}>
      
      {/* 3. ДОДАНО КНОПКУ "НАЗАД" */}
      <button 
        className={styles.BackButton} // Вам потрібно буде додати стилі для .BackButton
        onClick={() => navigate(-1)} // Ця функція повертає на попередню сторінку
      >
        ← Back
      </button>

      <h2 className={styles.Title}>💰 Deposit Stars</h2>
      <p className={styles.Subtitle}>Your current balance: {balance} ⭐</p>

      <div className={styles.ButtonGrid}>
        {depositOptions.map(({ amount, bonus }) => (
          <button
            key={amount}
            className={`${styles.DepositButton} ${selected === amount ? styles.Active : ""}`}
            onClick={() => handleDeposit(amount)}
            disabled={loading}
          >
            <div className={styles.Amount}>{amount} ⭐</div>
            {bonus > 0 && <div className={styles.Bonus}>+{bonus} Bonus</div>}
          </button>
        ))}
      </div>

      {message && <p className={styles.Message}>{message}</p>}

      {/* 4. ДОДАНО КНОПКУ ДЛЯ РУЛЕТОК */}
      <button 
        className={styles.NavButton} // Вам потрібно буде додати стилі для .NavButton
        onClick={() => navigate("/wheel")} // Змініть "/roulettes" на ваш реальний шлях
      >
        🎰 Wheel Page
      </button>

    </div>
  );
}