import { useState } from "react";
import { motion } from "framer-motion";
import api from "../../utils/api";
import styles from "./HorizontalWheel.module.css";

const segments = [
  { label: "🎁 NFT Box", type: "nft", color: "linear-gradient(135deg, #ff0077, #ff55cc)" },
  { label: "🎟 Ticket", type: "raffle_ticket", color: "linear-gradient(135deg, #0066ff, #00ccff)" },
  { label: "🌟 5 Stars", type: "stars", color: "linear-gradient(135deg, #ffee55, #ffaa00)" },
  { label: "🚀 Boost", type: "boost", color: "linear-gradient(135deg, #00ff99, #00ffaa)" },
];


export default function HorizontalWheel() {
  const [spinning, setSpinning] = useState(false);
  const [offset, setOffset] = useState(0);
  const [result, setResult] = useState(null);

  const segmentWidth = 160;
  const totalSegments = segments.length;

  // 🎯 Обертання саме на потрібному секторі
  const spinToReward = (rewardType) => {
    const matchingIndexes = segments
      .map((s, i) => (s.type === rewardType ? i : -1))
      .filter((i) => i !== -1);

    const winningIndex =
      matchingIndexes[Math.floor(Math.random() * matchingIndexes.length)];

    // обертання на кілька повних оборотів + до потрібного сегмента
    const randomTurns = 4 + Math.random() * 2;
    const finalOffset =
      -((winningIndex + totalSegments * randomTurns) * segmentWidth);

    // ⚡️ Скидаємо позицію колеса перед новим спіном
    setOffset(0);
    setResult(null);

    // Трошки чекаємо, щоб Framer Motion встиг оновити DOM перед анімацією
    setTimeout(() => {
      setOffset(finalOffset);
    }, 50);

    // коли анімація завершена — показуємо результат
    setTimeout(() => {
      setSpinning(false);
      setResult(segments[winningIndex]);
    }, 4500);
  };

  const handleSpin = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    try {
      // 1️⃣ Створюємо інвойс
      const { data: invoice } = await api.post("/api/wheel/create_invoice");
      if (!invoice.success) throw new Error("Invoice creation failed");

      const link = invoice.invoice_link;

      // 2️⃣ Оплата в Telegram
      if (window.Telegram?.WebApp?.openInvoice) {
        window.Telegram.WebApp.openInvoice(link, async (status) => {
          if (status === "paid") {
            // 3️⃣ Після оплати — виклик бекенду для розрахунку нагороди
            const { data: spinData } = await api.post("/api/wheel/spin");
            if (!spinData.success) throw new Error("Spin failed");
            spinToReward(spinData.result.type);
          } else {
            setSpinning(false);
          }
        });
      } else {
        // 🧪 Тест без Telegram (локальний режим)
        console.log("⚠️ Telegram WebApp не знайдено — тестовий спін");
        const { data: spinData } = await api.post("/api/wheel/spin");
        spinToReward(spinData.result.type);
      }
    } catch (err) {
      console.error("Spin error:", err);
      setSpinning(false);
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
          🎉 You won: <strong>{result.label}</strong>
        </div>
      )}
    </div>
  );
}
