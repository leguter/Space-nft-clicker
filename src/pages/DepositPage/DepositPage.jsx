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

  // === 🟢 ГОЛОВНЕ ВИПРАВЛЕННЯ ТУТ (Версія 4) 🟢 ===
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        // Цей ендпоінт, судячи з вашого першого скріншоту,
        // повертає масив: [ { ... } ]
        const res = await api.get("/api/user/me");
 console.log(res.data.internal_stars)
        // 1. Перевіряємо, що res.data - це масив і він не пустий
        if (Array.isArray(res.data) && res.data.length > 0) {
         
          // 2. Беремо internal_stars з ПЕРШОГО об'єкта в масиві
          const stars = res.data[0].internal_stars;
          setBalance(stars || 0);

        } else {
          // Про всяк випадок, якщо структура раптом зміниться на ту,
          // що у вашому новому лозі (хоча це малоймовірно для /api/user/me)
          if (res.data?.user?.internal_stars) {
             setBalance(res.data.user.internal_stars);
          }
        }
      } catch (err) {
        console.error("Failed to fetch balance:", err);
      }
    };
    fetchBalance();
  }, []); // Пустий масив = виконати 1 раз при завантаженні
  // === / Кінець виправлення ===


  // === Створення інвойсу (цей код вже правильний) ===
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

        const onInvoiceClosed = async (eventData) => {
          tg.offEvent("invoiceClosed", onInvoiceClosed);

          if (eventData.status === "paid") {
            setMessage("✅ Оплата завершена. Перевіряємо сервер...");

            try {
              const completeRes = await api.post("/api/deposit/complete", { payload });
              if (completeRes.data?.success) {
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
            setMessage("❌ Оплата скасована або не завершена");
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

  // === Рендер компонента (без змін) ===
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