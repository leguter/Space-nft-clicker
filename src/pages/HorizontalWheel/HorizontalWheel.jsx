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
  // Зсув для центрування сегмента під маркером (160 / 2 = 80)
  const centeringOffset = segmentWidth / 2;

  // 1. Встановлюємо початковий offset так, щоб "NFT Box" (перший елемент)
  // був рівно по центру під маркером.
  const [offset, setOffset] = useState(centeringOffset); 
  
  // 2. Налаштування анімації виносимо в стан, щоб керувати нею
  const [transition, setTransition] = useState({ duration: 4, ease: "easeOut" });

  // 🔹 Функція обертання до конкретного призу
  const spinToReward = (rewardType) => {
    // знаходимо індекс призу
    const winningIndex = segments.findIndex(s => s.type === rewardType);

    if (winningIndex === -1) {
      console.error("Приз не знайдено:", rewardType);
      setSpinning(false);
      return;
    }

    // 3. Розраховуємо "базову" цільову позицію для цього призу
    // (напр., 'Ticket' (index 1) -> (1 * -160) + 80 = -80px)
    // (напр., 'Boost' (index 3) -> (3 * -160) + 80 = -400px)
    const targetPosition = (winningIndex * -segmentWidth) + centeringOffset;

    // 4. Беремо поточний offset (звідки ми починаємо крутити)
    const currentOffset = offset;
    
    // 5. Знаходимо "базову" позицію поточного offset.
    // (напр., якщо offset = -3280, то -3280 % 640 = -80)
    const currentBaseOffset = currentOffset % wheelCycleLength;

    // 6. Кількість повних обертів (ЗАВЖДИ ціле число)
    const randomTurns = 4 + Math.floor(Math.random() * 3); // 4, 5, or 6
    const spinDistance = wheelCycleLength * randomTurns;

    // 7. ❗️ КЛЮЧОВА ЛОГІКА:
    // Ми беремо поточну позицію,
    // додаємо різницю, щоб потрапити на потрібний приз,
    // і віднімаємо величезну дистанцію для обертання.
    const finalOffset = currentOffset + (targetPosition - currentBaseOffset) - spinDistance;

    // 8. Встановлюємо нормальну анімацію і запускаємо її
    setTransition({ duration: 4, ease: "easeOut" });
    setResult(null);
    setOffset(finalOffset);

    // 9. Після завершення анімації показуємо результат
    setTimeout(() => {
      setSpinning(false);
      setResult(segments[winningIndex]);
    }, 4500); // 4000ms анімація + 500ms буфер
  };

  // 🔹 Обробка спіну з оплатою
  const handleSpin = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null); // Ховаємо попередній результат

    try {
      // 1️⃣ створюємо інвойс
      const { data: invoice } = await api.post("/api/wheel/create_invoice");
      if (!invoice.success) throw new Error("Не вдалося створити інвойс");

      const link = invoice.invoice_link;

      // 2️⃣ оплата через Telegram
      if (window.Telegram?.WebApp?.openInvoice) {
        window.Telegram.WebApp.openInvoice(link, async (status) => {
          if (status === "paid") {
            // 3️⃣ отримуємо результат від бекенду
            const { data: spinData } = await api.post("/api/wheel/spin");
            if (!spinData.success) throw new Error("Спін не вдався");

            // 4️⃣ запускаємо обертання до правильного призу
            spinToReward(spinData.result.type);
          } else {
            setSpinning(false);
          }
        });
      } else {
        // 🧪 Тест без Telegram
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
          // Використовуємо transition зі стану
          transition={transition}
          // onAnimationComplete нам більше НЕ ПОТРІБЕН
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