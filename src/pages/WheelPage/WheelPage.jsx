import { useState } from "react";
import styles from "./WheelPage.module.css";
import api from "../../utils/api";

export default function WheelPage() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [balance, setBalance] = useState(null); // Баланс внутрішніх зірок

  const segments = [
    "🎟 Ticket",
    "🎟 Ticket",
    "🎟 Ticket",
    "🎟 Ticket",
    "🎟 Ticket",
    "🎟 Ticket",
    "🌟 5 Stars", // Це 5 *внутрішніх* зірок
    "🎁 NFT Box",
  ];

  const spinWheel = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    try {
      // 1️⃣ Отримати інвойс від бекенду
      const invoiceRes = await api.post("/api/wheel/create_invoice");
      if (!invoiceRes.data.success) {
        throw new Error(invoiceRes.data.message || "Invoice creation failed");
      }

      const invoiceLink = invoiceRes.data.invoice_link;

      // 2️⃣ Відкрити Telegram оплату (XTR)
      if (window.Telegram?.WebApp) {
        const onPayment = async (event) => {
          // Важливо одразу зняти слухача, щоб він не спрацював двічі
          window.Telegram.WebApp.offEvent("invoiceClosed", onPayment);

          // Перевіряємо, чи оплата успішна
          if (event.status === "paid") {
            try {
              // 3️⃣ Оплата пройшла, викликаємо /spin для отримання призу
              const res = await api.post("/api/wheel/spin");
              const data = res.data;

              // 4️⃣ Анімуємо колесо
              const index = getSegmentIndex(data.result.type);

              const baseSpins = 360 * 5; // 5 повних обертів
              const segmentAngle = 360 / segments.length; // 45 градусів
              
              // Вказівник на 0. Обертаємо "назад"
              const targetAngle = -(segmentAngle * index);
              
              // Невеликий випадковий зсув в межах сегмента
              const randomJitter = (Math.random() - 0.5) * (segmentAngle * 0.8);
              
              const newRotation = baseSpins + targetAngle + randomJitter;
              setRotation(rotation + newRotation);

              // 5️⃣ Показуємо результат після анімації
              setTimeout(() => {
                setResult(data.result);
                setBalance(data.balance); // Оновлюємо баланс *внутрішніх* зірок
                setSpinning(false);
              }, 4000); // 4 секунди анімації

            } catch (spinErr) {
              console.error("Spin error after payment:", spinErr);
              alert("Spin failed after payment. Contact support.");
              setSpinning(false);
            }
          } else {
            // Оплата скасована, "pending" або "failed"
            console.log("Payment not completed:", event.status);
            setSpinning(false);
          }
        };

        // Слухаємо подію закриття інвойсу
        window.Telegram.WebApp.onEvent("invoiceClosed", onPayment);
        // Відкриваємо інвойс
        window.Telegram.WebApp.openInvoice(invoiceLink);

      } else {
        alert("Telegram WebApp not available");
        setSpinning(false);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Payment or spin error");
      setSpinning(false);
    }
  };

  const getSegmentIndex = (type) => {
    switch (type) {
      case "raffle_ticket":
        // Повертає випадковий індекс серед перших 6 сегментів
        return Math.floor(Math.random() * 6);
      case "stars":
        return 6; // 7-й сегмент (індекс 6)
      case "nft":
        return 7; // 8-й сегмент (індекс 7)
      default:
        return 0;
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Wheel of Fortune</h2>

      <div className={styles.wheelContainer}>
        <div
          className={`${styles.wheel} ${spinning ? styles.spinning : ""}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {segments.map((seg, i) => (
            <div
              key={i}
              className={styles.segment}
              style={{
                // 360 / 8 = 45
                transform: `rotate(${45 * i}deg) skewY(-45deg)`,
              }}
            >
              <span>{seg}</span>
            </div>
          ))}
        </div>
        <div className={styles.pointer}></div>
      </div>

      <button
        className={styles.spinButton}
        onClick={spinWheel}
        disabled={spinning}
      >
        {spinning ? "Spinning..." : "Spin (10⭐)"}
      </button>

      {result && (
        <div className={styles.resultBox}>
          🎉 You won:{" "}
          {result.type === "raffle_ticket"
            ? "🎟 1 Ticket"
            : result.type === "stars"
            ? "🌟 5 Stars" // 5 внутрішніх зірок
            : "🎁 NFT Mystery Box"}
        </div>
      )}

      {balance !== null && (
        <div className={styles.balance}>⭐ Internal Balance: {balance}</div>
      )}
    </div>
  );
}