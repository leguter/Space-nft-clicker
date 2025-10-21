
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

  const segmentWidth = 160; // px ширина одного блоку
  const totalSegments = segments.length;

  const handleSpin = async () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);

    try {
      const { data } = await api.post("/wheel/spin");
      if (!data.success) throw new Error("Spin failed");

      const rewardType = data.result.type;
      const winningIndex = segments.findIndex(s => s.type === rewardType);
      if (winningIndex === -1) throw new Error("Prize not found in segments");

      // Додатковий оберт для ефекту
      const randomTurns = 3 + Math.random() * 2; // 3–5 повних обертів
      const finalOffset =
        offset - (winningIndex + totalSegments * randomTurns) * segmentWidth;

      setOffset(finalOffset);

      // Після анімації показуємо результат
      setTimeout(() => {
        setSpinning(false);
        setResult(data.result);
      }, 4500);
    } catch (err) {
      console.error(err);
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
          🎉 You won: <strong>{result.value}</strong> ({result.type})
        </div>
      )}
    </div>
  );
}
