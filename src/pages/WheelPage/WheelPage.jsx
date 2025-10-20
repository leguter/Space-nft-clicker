import { useState } from "react";
import { motion } from "framer-motion";
import api from "../../utils/api";
import styles from "./WheelPage.module.css";

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
  const [tapPower, setTapPower] = useState(null);

  const [spinSound] = useState(() => new Audio("https://actions.google.com/sounds/v1/foley/spinning_coin.ogg"));
  const [winSound] = useState(() => new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"));

  // ✅ Функція для визначення правильного сегмента
  const getSegmentIndex = (type) => {
    const index = segments.findIndex((s) => s.type === type);
    return index !== -1 ? index : 0;
  };

  const spin = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    try {
      const invoiceRes = await api.post("/api/wheel/create_invoice");
      if (!invoiceRes.data.success) throw new Error(invoiceRes.data.message || "Invoice creation failed");
      const invoiceLink = invoiceRes.data.invoice_link;

      if (window.Telegram?.WebApp) {
        const onPayment = async (event) => {
          window.Telegram.WebApp.offEvent("invoiceClosed", onPayment);

          if (event.status === "paid") {
            spinSound.currentTime = 0;
            spinSound.play();

            try {
              const res = await api.post("/api/wheel/spin");
              const data = res.data;

              const degreesPerSegment = 360 / segments.length;
const prizeIndex = getSegmentIndex(data.result.type);

const baseSpins = 5 * 360; // 5 повних обертів
// 🧭 Кут центру потрібного сегмента (рахуємо проти обертання)
const prizeAngle = prizeIndex * degreesPerSegment + degreesPerSegment / 2;

// 🎯 Загальний кут (робимо обертання до потрібного сегмента)
const stopRotation = baseSpins - prizeAngle;

              setRotation(stopRotation);

              setTimeout(() => {
                spinSound.pause();
                winSound.currentTime = 0;
                winSound.play();
                setResult(data.result);
                setBalance(data.balance);
                setTickets(data.tickets);
                if (data.tap_power) setTapPower(data.tap_power);
                setSpinning(false);
              }, 4200);
            } catch (err) {
              console.error("Spin error after payment:", err);
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
            const segmentAngle = 360 / segments.length;
            const skewAngle = 90 - segmentAngle;
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

      <button onClick={spin} disabled={spinning} className={styles.spinButton}>
        {spinning ? "Крутиться..." : "Крутить (1⭐)"}
      </button>

      {result && (
        <p className={styles.resultBox}>
          Ви виграли:{" "}
          {result.type === "raffle_ticket"
            ? "🎟 1 Ticket"
            : result.type === "stars"
            ? "🌟 5 Stars"
            : result.type === "boost"
            ? "🚀 x2 Clicks Boost!"
            : "🎁 NFT Mystery Box"}
        </p>
      )}

      {tickets !== null && <div className={styles.ticketsBox}>🎟 Tickets: {tickets}</div>}
      {balance !== null && <div className={styles.balanceBox}>⭐ Balance: {balance}</div>}
      {tapPower !== null && <div className={styles.balanceBox}>⚡ Tap Power: {tapPower}</div>}
    </div>
  );
}
