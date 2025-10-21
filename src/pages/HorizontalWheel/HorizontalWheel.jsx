import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import api from "../../utils/api";
import styles from "./HorizontalWheel.module.css";

const segments = [
  { label: "🎁 NFT Box", type: "nft", color: "linear-gradient(135deg, #ff0077, #ff55cc)" },
  { label: "🎟 Ticket", type: "raffle_ticket", color: "linear-gradient(135deg, #0066ff, #00ccff)" },
  { label: "🌟 5 Stars", type: "stars", color: "linear-gradient(135deg, #ffee55, #ffaa00)" },
  { label: "🚀 Boost", type: "boost", color: "linear-gradient(135deg, #00ff99, #00ffaa)" },
  { label: "🎟 Ticket", type: "raffle_ticket", color: "linear-gradient(135deg, #2266ff, #22ccff)" },
];

export default function HorizontalWheel() {
  const [spinning, setSpinning] = useState(false);
  const [offset, setOffset] = useState(0);
  const [result, setResult] = useState(null);

  const segmentWidth = 160;
  const totalSegments = segments.length;

  // 🚀 Запускає обертання після оплати
  const startSpin = async () => {
    setSpinning(true);
    setResult(null);

    try {
      const { data } = await api.post("/api/wheel/spin");
      if (!data.success) throw new Error("Spin failed");

      const rewardType = data.result.type;

      // Випадковий сегмент відповідного типу
      const matchingIndexes = segments
        .map((s, i) => (s.type === rewardType ? i : -1))
        .filter(i => i !== -1);

      const winningIndex =
        matchingIndexes[Math.floor(Math.random() * matchingIndexes.length)];

      const randomTurns = 4 + Math.random() * 2;
      const finalOffset =
        offset - (winningIndex + totalSegments * randomTurns) * segmentWidth;

      setOffset(finalOffset);

      setTimeout(() => {
        setSpinning(false);
        setResult(data.result);
      }, 4500);
    } catch (err) {
      console.error("Spin error:", err);
      setSpinning(false);
    }
  };

  // 💳 Обробка натискання кнопки (спочатку інвойс)
  const handleSpin = async () => {
    if (spinning) return;
    setResult(null);

    try {
      const invoice = await api.post("/api/wheel/create_invoice");
      if (!invoice.data.success) throw new Error("Invoice creation failed");

      const link = invoice.data.invoice_link;

      // Telegram WebApp оплата
      if (window.Telegram?.WebApp?.openInvoice) {
        window.Telegram.WebApp.openInvoice(link, async (status) => {
          if (status === "paid") await startSpin();
        });
      } else {
        // Для локального тесту без Telegram WebApp
        console.log("⚠️ Telegram WebApp не знайдено — спін без оплати");
        await startSpin();
      }
    } catch (err) {
      console.error("Invoice error:", err);
    }
  };

  return (
    <div className={styles.container}>
      <h2>🎡 Wheel of Fortune</h2>

      <div className={styles.wheelWrapper}>
        <motion.div
          className={styles.wheel}
          animate={{ x: offset }}
          transition={{ duration: 4, ease: "easeOut" }}
        >
          {[...Array(8)].flatMap((_, i) =>
            segments.map((seg, idx) => (
              <div
                key={`${i}-${idx}`}
                className={styles.segment}
                style={{ background: seg.color }}
              >
                {seg.label}
              </div>
            ))
          )}
        </motion.div>

        <div className={styles.marker}>▼</div>
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning}
        className={styles.spinButton}
      >
        {spinning ? "Spinning..." : "Spin for 1 XTR"}
      </button>

      {result && (
        <div className={styles.result}>
          🎉 You won:{" "}
          <strong>
            {result.value} ({result.type})
          </strong>
        </div>
      )}
    </div>
  );
}
