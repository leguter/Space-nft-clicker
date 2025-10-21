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
  const [offset, setOffset] = useState(0);
  const [result, setResult] = useState(null);
  // 1. Додаємо стан для налаштувань анімації
  const [transition, setTransition] = useState({ duration: 4, ease: "easeOut" });

  const segmentWidth = 160; // ширина одного сегмента
  const totalSegments = segments.length;
  const wheelCycleLength = totalSegments * segmentWidth; // 4 * 160 = 640px
  // 2. Зсув для центрування сегмента під маркером (160 / 2 = 80)
  const centeringOffset = segmentWidth / 2;

  // 🔹 Оновлена функція обертання
  const spinToReward = (rewardType) => {
    // знаходимо індекс призу
    const winningIndex = segments.findIndex(s => s.type === rewardType);

    if (winningIndex === -1) {
      console.error("Приз не знайдено:", rewardType);
      setSpinning(false);
      return;
    }

    // 3. Розраховуємо цільову позицію, щоб сегмент був у центрі
    // (напр. 1 * -160 + 80 = -80px)
    const targetPosition = (winningIndex * -segmentWidth) + centeringOffset;

    // 4. Поточна "базова" позиція (залишок від ділення)
    const currentBaseOffset = offset % wheelCycleLength;
    
    // 5. Кількість повних обертів (завжди ціле число)
    const randomTurns = 4 + Math.floor(Math.random() * 3); // 4, 5, or 6
    const spinDistance = (totalSegments * randomTurns) * segmentWidth;

    // 6. Нова фінальна позиція
    // Ми беремо поточну базу, віднімаємо дистанцію обертів,
    // і додаємо різницю, щоб потрапити на цільову позицію.
    const finalOffset = currentBaseOffset - spinDistance + (targetPosition - currentBaseOffset);

    // 7. Встановлюємо нормальну анімацію і запускаємо її
    setTransition({ duration: 4, ease: "easeOut" });
    setResult(null);
    setOffset(finalOffset);

    // після завершення анімації показуємо результат
    setTimeout(() => {
      setSpinning(false);
      setResult(segments[winningIndex]);
    }, 4500); // 4000ms анімація + 500ms буфер
  };

  // 8. 🔹 Нова функція: "невидиме" скидання позиції
  const handleAnimationComplete = () => {
    if (spinning) return; // Ігнорувати, якщо анімація ще не завершена
    
    // 9. Визначаємо, на якій "базовій" позиції ми зупинилися
    // (Це та сама логіка 'targetPosition', що й у spinToReward)
    const winningIndex = result ? segments.findIndex(s => s.type === result.type) : -1;

    if (winningIndex !== -1) {
      const targetPosition = (winningIndex * -segmentWidth) + centeringOffset;
      // 10. Встановлюємо анімацію на 0 секунд
      setTransition({ duration: 0 });
      // 11. "Телепортуємо" колесо на базову позицію
      setOffset(targetPosition);
    }
  };

  // 🔹 Обробка спіну з оплатою
  const handleSpin = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

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
          // 12. Використовуємо transition зі стану
          transition={transition}
          // 13. Додаємо обробник завершення анімації
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