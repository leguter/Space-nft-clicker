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
  const centeringOffset = segmentWidth / 2; // 160 / 2 = 80

  // Встановлюємо початковий offset, щоб перший елемент був у центрі
  const [offset, setOffset] = useState(centeringOffset); 
  
  // 1. ❗️ ВИРІШЕННЯ ПРОБЛЕМИ №1:
  // Початкова тривалість анімації = 0 секунд.
  // Це запобіжить "повільному" руху колеса при завантаженні сторінки.
  const [transition, setTransition] = useState({ duration: 0, ease: "easeOut" });

  // 🔹 Функція обертання до конкретного призу
  const spinToReward = (rewardType) => {
    const winningIndex = segments.findIndex(s => s.type === rewardType);

    if (winningIndex === -1) {
      console.error("Приз не знайдено:", rewardType);
      setSpinning(false);
      return;
    }

    const targetPosition = (winningIndex * -segmentWidth) + centeringOffset;
    const currentOffset = offset;
    const currentBaseOffset = currentOffset % wheelCycleLength;
    const randomTurns = 4 + Math.floor(Math.random() * 3); 
    const spinDistance = wheelCycleLength * randomTurns;
    const finalOffset = currentOffset + (targetPosition - currentBaseOffset) - spinDistance;

    // 2. Встановлюємо тривалість 4 секунди САМЕ ДЛЯ ПРОКРУТКИ
    setTransition({ duration: 4, ease: "easeOut" });
    setResult(null);
    setOffset(finalOffset); // Запускаємо анімацію до finalOffset

    // Після завершення анімації показуємо результат
    setTimeout(() => {
      setSpinning(false);
      setResult(segments[winningIndex]);
    }, 4500); // 4000ms анімація + 500ms буфер
  };

  // 3. ❗️ ВИРІШЕННЯ ПРОБЛЕМИ №2:
  // Ця функція спрацює, коли анімація (прокрутка) завершиться
  const handleAnimationComplete = () => {
    // Ми НЕ хочемо нічого робити, якщо анімація, що завершилась,
    // була "миттєвою" (напр., при завантаженні або при цьому ж скиданні)
    if (transition.duration === 0) return;

    // 4. Розраховуємо базову позицію (напр., -80px для "Ticket")
    const currentBaseOffset = offset % wheelCycleLength;

    // 5. Встановлюємо наступну анімацію на 0 секунд
    setTransition({ duration: 0 });
    
    // 6. "Телепортуємо" колесо з (напр.) -2640px на -80px
    // Візуально нічого не зміниться, але offset буде малим
    // і ми ніколи не "вийдемо за межі" відрендерених сегментів.
    setOffset(currentBaseOffset);
  };

  // 🔹 Обробка спіну з оплатою
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
          transition={transition}
          // 7. Додаємо обробник завершення анімації
          onAnimationComplete={handleAnimationComplete} 
        >
          {[...Array(8)].flatMap((_, i) => // 8 масивів достатньо з цим фіксом
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