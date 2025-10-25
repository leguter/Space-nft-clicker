import { useState, useEffect } from "react";
import api from "../../utils/api";
import styles from "./DepositPage.module.css";

export default function DepositPage() {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState(0); // ← збережений поточний баланс

  const depositOptions = [
    { amount: 10, bonus: 0 },
    { amount: 50, bonus: 0 },
    { amount: 100, bonus: 20 },
    { amount: 500, bonus: 100 },
    { amount: 1000, bonus: 300 },
  ];

  // === Ініціалізація Telegram WebApp ===
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      // Слухач завершення платежу
      tg.onEvent("invoiceClosed", async (status) => {
        console.log("Invoice closed:", status);

        if (status === "paid") {
          setMessage("✅ Оплата успішна! Оновлюємо баланс...");
          try {
            const res = await api.get("/api/user/me"); // <-- твій бек повертає оновленого юзера
            if (res.data?.user) {
              setBalance(res.data.user.internal_stars); // <-- оновлюємо баланс
              setMessage("💰 Баланс оновлено!");
            }
          } catch (e) {
            console.error("Balance update error:", e);
            setMessage("⚠️ Не вдалося оновити баланс");
          }
        } else if (status === "cancelled") {
          setMessage("❌ Оплату скасовано.");
        } else if (status === "failed") {
          setMessage("💀 Помилка під час оплати.");
        }
      });
    }

    // При виході — чистимо слухач
    return () => {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.offEvent("invoiceClosed");
      }
    };
  }, []);

  // === Створення інвойсу ===
  const handleDeposit = async (amount) => {
    try {
      setLoading(true);
      setSelected(amount);
      setMessage("");

      const res = await api.post("/api/deposit/create_invoice", { amount });

      if (res.data?.success && res.data.invoice_link) {
        if (window.Telegram?.WebApp) {
          // 🔥 Відкриваємо оплату саме у Telegram WebApp, не у браузері
          window.Telegram.WebApp.openInvoice(res.data.invoice_link);
          setMessage("💳 Відкриваємо оплату у Telegram...");
        } else {
          // fallback для вебверсії (якщо тестуєш у браузері)
          window.open(res.data.invoice_link, "_blank");
          setMessage("Відкрито у новому вікні ✅");
        }
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

  // === Початкове завантаження поточного балансу ===
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/user/me");
        if (res.data?.user) {
          setBalance(res.data.user.internal_stars || 0);
        }
      } catch (e) {
        console.error("Load balance error:", e);
      }
    })();
  }, []);

  return (
    <div className={styles.Container}>
      <h2 className={styles.Title}>💰 Deposit Stars</h2>
      <p className={styles.Subtitle}>Твій поточний баланс: {balance} ⭐</p>

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
            {bonus > 0 && <div className={styles.Bonus}>+{bonus} бонус</div>}
          </button>
        ))}
      </div>

      {message && <p className={styles.Message}>{message}</p>}
    </div>
  );
}
