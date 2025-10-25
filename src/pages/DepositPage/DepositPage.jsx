import { useState, useEffect } from "react";
import api from "../../utils/api";
import styles from "./DepositPage.module.css";

export default function DepositPage() {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState(0);

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
        const res = await api.get("/api/user/me");
        if (res.data?.user) setBalance(res.data.user.internal_stars || 0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBalance();
  }, []);

  // === Створення інвойсу та підтвердження платежу ===
  const handleDeposit = async (amount) => {
    setLoading(true);
    setSelected(amount);
    setMessage("");

    try {
      const res = await api.post("/api/deposit/create_invoice", { amount });
      if (!res.data?.success) return setMessage("Не вдалося створити інвойс");

      const { invoice_link, payload } = res.data;
      setMessage("💳 Відкриваємо оплату...");

      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.openInvoice(invoice_link);

        // === 🟢 ГОЛОВНЕ ВИПРАВЛЕННЯ ТУТ 🟢 ===
        // 1. Аргумент 'status' перейменовано на 'eventData', бо Telegram надсилає об'єкт
        const onInvoiceClosed = async (eventData) => {
          tg.offEvent("invoiceClosed", onInvoiceClosed);

          // 2. Перевіряємо поле 'status' всередині об'єкта 'eventData'
          if (eventData.status === "paid") {
            setMessage("✅ Оплата завершена. Перевіряємо сервер...");

            try {
              // Викликаємо наш бекенд, який ми виправили раніше
              const completeRes = await api.post("/api/deposit/complete", { payload });
              
              if (completeRes.data?.success) {
                // Встановлюємо новий загальний баланс,
                // який повернув бекенд (internal_stars)
                setBalance(completeRes.data.internal_stars);
                setMessage("💰 Баланс оновлено!");
              } else {
                setMessage("❌ Оплата не підтверджена на сервері");
              }
            } catch (err) {
              console.error(err);
              setMessage("⚠️ Не вдалося оновити баланс");
            }
          } else {
            // Сюди потраплять статуси 'cancelled', 'failed' тощо.
            setMessage("❌ Оплата скасована або не завершена");
          }
        };
        // === / Кінець виправлення ===

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

  return (
    <div className={styles.Container}>
      <h2 className={styles.Title}>💰 Deposit Stars</h2>
      <p className={styles.Subtitle}>Твій поточний баланс: {balance} ⭐</p>

      <div className={styles.ButtonGrid}>
        {depositOptions.map(({ amount, bonus }) => (
          <button
            key={amount}
            className={`${styles.DepositButton} ${selected === amount ? styles.Active : ""}`}
            onClick={() => handleDeposit(amount)}
            disabled={loading}
          >
            <div className={styles.Amount}>{amount} ⭐</div>
            {bonus > 0 && <div className={styles.Bonus}>+{bonus} бонус</div>}
          </button>
        ))}
      </div>

      {message && <p className={styles.Message}>{message}</p>}
    </div>
  );
}