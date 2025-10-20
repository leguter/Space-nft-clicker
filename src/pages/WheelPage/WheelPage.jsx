import { useState } from "react";
import { motion } from "framer-motion";
import api from "../../utils/api";
import styles from "./WheelPage.module.css"; 

// Масив сегментів (5 штук)
const segments = [
  { label: "🎁 NFT Box", type: "nft", color: "linear-gradient(135deg, #ff0077, #ff55cc)" },
  { label: "🎟 Ticket", type: "raffle_ticket", color: "linear-gradient(135deg, #0066ff, #00ccff)" },
  { label: "🌟 5 Stars", type: "stars", color: "linear-gradient(135deg, #ffee55, #ffaa00)" },
  { label: "🚀 Boost", type: "boost", color: "linear-gradient(135deg, #00ff99, #00ffaa)" },
  { label: "🎟 Ticket", type: "raffle_ticket", color: "linear-gradient(135deg, #2266ff, #22ccff)" },
];

export default function SpaceRaffle() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [balance, setBalance] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [tapPower, setTapPower] = useState(null); // Стан для tap_power

  const [spinSound] = useState(() => new Audio("https://actions.google.com/sounds/v1/foley/spinning_coin.ogg"));
  const [winSound] = useState(() => new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"));

  /**
   * Динамічно знаходить індекс сегмента за його типом.
   * Якщо є кілька сегментів з однаковим типом (наприклад, "Ticket"),
   * ця функція обере один з них випадковим чином.
   */
  const getSegmentIndex = (type) => {
    // 1. Знаходимо ВСІ індекси, які відповідають типу призу
    const matchingIndices = [];
    segments.forEach((segment, index) => {
      if (segment.type === type) {
        matchingIndices.push(index);
      }
    });

    // 2. Якщо нічого не знайдено (помилка), повертаємо 0
    if (matchingIndices.length === 0) {
      console.warn(`No segment found for type: ${type}`);
      return 0;
    }

    // 3. Вибираємо випадковий індекс з усіх знайдених
    const randomIndex = Math.floor(Math.random() * matchingIndices.length);
    return matchingIndices[randomIndex];
  };

  const spin = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    try {
      // 1️⃣ Отримати інвойс
      const invoiceRes = await api.post("/api/wheel/create_invoice");
      if (!invoiceRes.data.success) {
        throw new Error(invoiceRes.data.message || "Invoice creation failed");
      }
      const invoiceLink = invoiceRes.data.invoice_link;

      // 2️⃣ Відкрити Telegram оплату
      if (window.Telegram?.WebApp) {
        const onPayment = async (event) => {
          window.Telegram.WebApp.offEvent("invoiceClosed", onPayment);

          if (event.status === "paid") {
            spinSound.currentTime = 0;
            spinSound.play();

            try {
              // 4️⃣ Викликаємо /spin
              const res = await api.post("/api/wheel/spin");
              const data = res.data; 

              // 5️⃣ Розрахунок анімації
              const prizeIndex = getSegmentIndex(data.result.type);
              const degreesPerSegment = 360 / segments.length; 
              
              const baseSpins = (Math.floor(rotation / 360) + 5) * 360;
              const prizeAngle = prizeIndex * degreesPerSegment;
              const jitter = (Math.random() - 0.5) * (degreesPerSegment * 0.5);

              setRotation(baseSpins - prizeAngle + jitter);

              // 6️⃣ Показуємо результат
              setTimeout(() => {
                spinSound.pause();
                winSound.currentTime = 0;
                winSound.play();
                setResult(data.result);
                setBalance(data.balance);
                setTickets(data.tickets);
                if (data.tap_power) {
                  setTapPower(data.tap_power);
                }
                setSpinning(false);
              }, 4200); // 4s анімація + 0.2s буфер

            } catch (spinErr) {
              console.error("Spin error after payment:", spinErr);
              alert("Spin failed after payment. Contact support.");
              spinSound.pause();
              setSpinning(false);
            }
          } else {
            console.log("Payment not completed:", event.status);
            setSpinning(false);
          }
        };

        window.Telegram.WebApp.onEvent("invoiceClosed", onPayment);
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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>SPACE RAFFLE</h1>

      <div className={styles.wheelWrapper}>
        <div className={styles.pointer}></div>

        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.33, 1, 0.68, 1] }}
          className={styles.wheel}
        >
          {segments.map((p, i) => {
            // Розрахунки тепер динамічні на основі 5 сегментів
            const segmentAngle = 360 / segments.length; // 72
            const skewAngle = 90 - segmentAngle; // 18

            return (
              <div
                key={i}
                className={styles.segment}
                style={{
                  transform: `rotate(${i * segmentAngle}deg) skewY(-${skewAngle}deg)`,
                  background: p.color,
                  color: p.type === "nft" ? "#000" : "#fff",
                }}
              >
                <span
                  className={styles.segmentSpan}
                  style={{
                    transform: `skewY(${skewAngle}deg) rotate(${segmentAngle / 2 + 180}deg)`,
                  }}
                >
                  {p.label}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className={styles.spinButton}
      >
        {spinning ? "Крутиться..." : "Крутить (1⭐)"} 
        {/* Переконайтеся, що ціна на кнопці (1⭐) відповідає ціні на бекенді */}
      </button>

      {/* Блок результатів */}
      {result && (
        <p className={styles.resultBox}>
          Вы выиграли:{" "}
          {result.type === "raffle_ticket"
            ? "🎟 1 Ticket"
            : result.type === "stars"
            ? "🌟 5 Stars"
            : result.type === "boost"
            ? "🚀 x2 Clicks Boost!"
            : "🎁 NFT Mystery Box"}
        </p>
      )}

      {/* Блоки балансу */}
      {tickets !== null && (
        <div className={styles.ticketsBox}>🎟 Tickets: {tickets}</div>
      )}
      {balance !== null && (
        <div className={styles.balanceBox}>⭐ Internal Balance: {balance}</div>
      )}
      {tapPower !== null && (
        <div className={styles.balanceBox}>⚡ Tap Power: {tapPower}</div>
      )}
    </div>
  );
}