import { useState } from "react";
import api from "../../utils/api"; // твій axios wrapper
import styles from "./DepositPage.module.css";

export default function DepositPage() {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  const depositOptions = [
    { amount: 10, bonus: 0 },
    { amount: 50, bonus: 0 },
    { amount: 100, bonus: 20 },
    { amount: 500, bonus: 100 },
    { amount: 1000, bonus: 300 },
  ];

  const handleDeposit = async (amount) => {
    try {
      setLoading(true);
      setSelected(amount);
      setMessage("");

      const res = await api.post("/api/deposit/create_invoice", { amount });

      if (res.data?.success && res.data.invoice_link) {
        // Відкриваємо Telegram invoice link
        window.open(res.data.invoice_link, "_blank");
        setMessage("Оплату відкрито у Telegram ✅");
      } else {
        setMessage("Не вдалося створити інвойс 😕");
      }
    } catch (err) {
      console.error("Deposit error:", err);
      setMessage("Помилка під час створення інвойсу");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.Container}>
      <h2 className={styles.Title}>💰 Deposit Stars</h2>
      <p className={styles.Subtitle}>Поповни свій внутрішній баланс ⭐</p>

      <div className={styles.ButtonGrid}>
        {depositOptions.map(({ amount, bonus }) => (
          <button
            key={amount}
            className={`${styles.DepositButton} ${
              selected === amount ? styles.Active : ""
            }`}
            onClick={() => handleDeposit(amount)}
            disabled={loading}
          >
            <div className={styles.Amount}>{amount} ⭐</div>
            {bonus > 0 && (
              <div className={styles.Bonus}>+{bonus} бонус</div>
            )}
          </button>
        ))}
      </div>

      {message && <p className={styles.Message}>{message}</p>}
    </div>
  );
}
