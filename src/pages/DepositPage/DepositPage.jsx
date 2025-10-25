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

  // === Початкове завантаження балансу ===
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await api.get("/api/user/me");
        if (res.data?.user) {
          setBalance(res.data.user.internal_stars || 0);
        }
      } catch (e) {
        console.error("Load balance error:", e);
      }
    };
    fetchBalance();
  }, []);

  // === Створення інвойсу та обробка оплати ===
  const handleDeposit = async (amount) => {
    try {
      setLoading(true);
      setSelected(amount);
      setMessage("");

      // 1️⃣ Створюємо інвойс через бекенд
      const res = await api.post("/api/deposit/create_invoice", { amount });
      if (!res.data?.success || !res.data.invoice_link || !res.data.payload) {
        setMessage("Не вдалося створити інвойс 😕");
        return;
      }

      const { invoice_link, payload } = res.data;
      setMessage("💳 Відкриваємо оплату у Telegram...");

      // 2️⃣ Відкриваємо Telegram WebApp оплату
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.openInvoice(invoice_link);

        // 3️⃣ Слухаємо подію закриття інвойсу
        const onInvoiceClosed = async (status) => {
          tg.offEvent("invoiceClosed", onInvoiceClosed);

          if (status === "paid") {
            setMessage("✅ Оплата успішна! Перевіряємо платіж на сервері...");

            try {
              // 4️⃣ Надсилаємо payload на сервер для підтвердження оплати
              const completeRes = await api.post("/api/deposit/complete", { payload });
              if (completeRes.data?.success) {
                setBalance(completeRes.data.internal_stars);
                setMessage("💰 Баланс оновлено!");
              } else {
                setMessage("❌ Оплата не підтверджена на сервері");
              }
            } catch (err) {
              console.error("Deposit complete error:", err);
              setMessage("⚠️ Не вдалося оновити баланс");
            }
          } else {
            setMessage("❌ Оплата скасована або не завершена");
          }
        };

        tg.onEvent("invoiceClosed", onInvoiceClosed);
      } else {
        // fallback для браузера
        window.open(invoice_link, "_blank");
        setMessage("Відкрито у новому вікні. Оплату підтверджено сервером після завершення.");
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
