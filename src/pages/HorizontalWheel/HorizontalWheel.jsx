// import { useState } from "react";
// import { motion } from "framer-motion";
// import api from "../../utils/api";
// import styles from "./HorizontalWheel.module.css";

// // Кожен тип призу унікальний
// const segments = [
//   { label: "🎁 NFT Box", type: "nft", color: "linear-gradient(135deg, #ff0077, #ff55cc)" },
//   { label: "🎟 Ticket", type: "raffle_ticket", color: "linear-gradient(135deg, #0066ff, #00ccff)" },
//   { label: "🌟 5 Stars", type: "stars", color: "linear-gradient(135deg, #ffee55, #ffaa00)" },
//   { label: "🚀 Boost", type: "boost", color: "linear-gradient(135deg, #00ff99, #00ffaa)" },
// ];

// export default function HorizontalWheel() {
//   const [spinning, setSpinning] = useState(false);
//   const [offset, setOffset] = useState(0);
//   const [result, setResult] = useState(null);

//   const segmentWidth = 160; // ширина одного сегмента
//   const totalSegments = segments.length;

//   // 🔹 Функція обертання до конкретного призу
//   const spinToReward = (rewardType) => {
//     // знаходимо індекс призу
//     const winningIndex = segments.findIndex(s => s.type === rewardType);

//     if (winningIndex === -1) {
//       console.error("Приз не знайдено:", rewardType);
//       setSpinning(false);
//       return;
//     }

//     // обчислюємо offset для анімації
//   const randomTurns = 4 + Math.floor(Math.random() * 3);
//     // (160 / 2 = 80). Цей зсув центрує сегмент під маркером.
//      const centeringOffset = segmentWidth / 2; 
//  const finalOffset = -((winningIndex + totalSegments * randomTurns) * segmentWidth) + centeringOffset;

//     // скидаємо попереднє положення, щоб анімація повторювалась коректно
//     setOffset(0);
//     setResult(null);

//     setTimeout(() => {
//       setOffset(finalOffset);
//     }, 50);

//     // після завершення анімації показуємо результат
//     setTimeout(() => {
//       setSpinning(false);
//       setResult(segments[winningIndex]);
//     }, 4500);
//   };

//   // 🔹 Обробка спіну з оплатою
//   const handleSpin = async () => {
//     if (spinning) return;
//     setSpinning(true);
//     setResult(null);

//     try {
//       // 1️⃣ створюємо інвойс
//       const { data: invoice } = await api.post("/api/wheel/create_invoice");
//       if (!invoice.success) throw new Error("Не вдалося створити інвойс");

//       const link = invoice.invoice_link;

//       // 2️⃣ оплата через Telegram
//       if (window.Telegram?.WebApp?.openInvoice) {
//         window.Telegram.WebApp.openInvoice(link, async (status) => {
//           if (status === "paid") {
//             // 3️⃣ отримуємо результат від бекенду
//             const { data: spinData } = await api.post("/api/wheel/spin");
//             if (!spinData.success) throw new Error("Спін не вдався");

//             // 4️⃣ запускаємо обертання до правильного призу
//             spinToReward(spinData.result.type);
//           } else {
//             setSpinning(false);
//           }
//         });
//       } else {
//         // 🧪 Тест без Telegram
//         const { data: spinData } = await api.post("/api/wheel/spin");
//         spinToReward(spinData.result.type);
//       }
//     } catch (err) {
//       console.error("Помилка спіну:", err);
//       setSpinning(false);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h2>🎡 Wheel of Fortune</h2>

//       <div className={styles.wheelWrapper}>
//         <motion.div
//           className={styles.wheel}
//           animate={{ x: offset }}
//           transition={{ duration: 4, ease: "easeOut" }}
//         >
//           {[...Array(8)].flatMap((_, i) =>
//             segments.map((seg, idx) => (
//               <div
//                 key={`${i}-${idx}`}
//                 className={styles.segment}
//                 style={{ background: seg.color }}
//               >
//                 {seg.label}
//               </div>
//             ))
//           )}
//         </motion.div>

//         <div className={styles.marker}>▼</div>
//       </div>

//       <button
//         onClick={handleSpin}
//         disabled={spinning}
//         className={styles.spinButton}
//       >
//         {spinning ? "Spinning..." : "Spin for 1 XTR"}
//       </button>

//       {result && (
//         <div className={styles.result}>
//           🎉 You won: <strong>{result.label}</strong>
//         </div>
//       )}
//     </div>
//   );
// }
import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import api from "../../utils/api";
import styles from "./HorizontalWheel.module.css";

// Кожен тип призу унікальний
const segments = [
  { label: "🎁 NFT Box", type: "nft", color: "linear-gradient(135deg, #ff0077, #ff55cc)" },
  { label: "🎟 Ticket", type: "raffle_ticket", color: "linear-gradient(135deg, #0066ff, #00ccff)" },
  { label: "🌟 5 Stars", type: "stars", color: "linear-gradient(135deg, #ffee55, #ffaa00)" },
  { label: "🚀 Boost", type: "boost", color: "linear-gradient(135deg, #00ff99, #00ffaa)" },
];

export default function HorizontalWheel() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const segmentWidth = 160;
  const totalSegments = segments.length;
  const wheelCycleLength = totalSegments * segmentWidth; // 4 * 160 = 640px
  const centeringOffset = segmentWidth / 2; // 80px

  const [offset, setOffset] = useState(0);
  const [transition, setTransition] = useState({ duration: 0, ease: "easeOut" });

  const spinToReward = (rewardType) => {
    const winningIndex = segments.findIndex((s) => s.type === rewardType);

    if (winningIndex === -1) {
      console.error("Приз не знайдено:", rewardType);
      setSpinning(false);
      return;
    }

    const targetPosition = winningIndex * -segmentWidth + centeringOffset;
    const currentOffset = offset;
    const currentBaseOffset = currentOffset % wheelCycleLength;
    const randomTurns = 4 + Math.floor(Math.random() * 3);
    const spinDistance = wheelCycleLength * randomTurns;

    const finalOffset = currentOffset + (targetPosition - currentBaseOffset) - spinDistance;

    setTransition({ duration: 4, ease: "easeOut" });
    setResult(null);
    setOffset(finalOffset);

    setTimeout(() => {
      setSpinning(false);
      setResult(segments[winningIndex]);
    }, 4500);
  };

  const handleAnimationComplete = () => {
    if (transition.duration === 0) return;

    const currentBaseOffset = offset % wheelCycleLength;
    setTransition({ duration: 0 });
    setOffset(currentBaseOffset);
  };

  const handleSpin = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    try {
      const { data: invoice } = await api.post("/api/wheel/create_invoice");
      if (!invoice.success) throw new Error("Не вдалося створити інвойс");

      const link = invoice.invoice_link;

      if (window.Telegram?.WebApp?.openInvoice) {
        window.Telegram.WebApp.openInvoice(link, async (status) => {
          if (status === "paid") {
            const { data: spinData } = await api.post("/api/wheel/spin");
            if (!spinData.success) throw new Error("Спін не вдався");
            spinToReward(spinData.result.type);
          } else {
            setSpinning(false);
          }
        });
      } else {
        const { data: spinData } = await api.post("/api/wheel/spin");
        spinToReward(spinData.result.type);
      }
    } catch (err) {
      console.error("Помилка спіну:", err);
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
          transition={transition}
          onAnimationComplete={handleAnimationComplete}
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
        {spinning ? "Spinning..." : "Spin for 10 ⭐"}
      </button>

      {result && (
        <div className={styles.result}>
          🎉 You won: <strong>{result.label}</strong>
        </div>
      )}
    </div>
  );
}
