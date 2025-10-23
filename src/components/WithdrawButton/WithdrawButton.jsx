import { useState } from "react";
import api from "../../utils/api";
import styles from "./WithdrawButton.module.css";

export default function WithdrawButton({ balance, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleWithdraw = async () => {
    if (loading) return;
    setLoading(true);
    setMessage(null);

    try {
      // 1️⃣ Перевіряємо кількість рефералів
      const { data: refData } = await api.get("/api/user/referrals");
      const referralCount = refData.count || 0;

      if (referralCount < 5) {
        setMessage("❗ Потрібно мінімум 5 рефералів для виводу.");
        setLoading(false);
        return;
      }

      // 2️⃣ Перевіряємо баланс
      const withdrawCost = 100; // наприклад, 100 зірок за вивід
      if (balance < withdrawCost) {
        setMessage(`Недостатньо зірок. Потрібно ${withdrawCost}, а у вас ${balance}.`);
        setLoading(false);
        return;
      }

      // 3️⃣ Створюємо заявку
      const { data: withdrawRes } = await api.post("/api/withdraw/create_request", {
        amount: withdrawCost,
      });

      if (withdrawRes.success) {
        setMessage("✅ Заявку створено! Модератори її скоро опрацюють.");
        onSuccess?.();
      } else {
        setMessage("❌ Не вдалося створити заявку. Спробуйте пізніше.");
      }
    } catch (err) {
      console.error("Помилка виводу:", err);
      setMessage("⚠️ Помилка запиту. Спробуйте пізніше.");
    }

    setLoading(false);
  };

  return (
    <div className={styles.wrapper}>
      <button 
        className={styles.withdrawButton} 
        onClick={handleWithdraw} 
        disabled={loading}
      >
        {loading ? "⏳ Обробка..." : "Вивести зірки"}
      </button>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
