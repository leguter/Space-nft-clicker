// // import { useState } from "react";
// // import { motion } from "framer-motion";
// // import api from "../../utils/api";
// // import styles from "./HorizontalWheel.module.css";

// // // Кожен тип призу унікальний
// // const segments = [
// //   { label: "🎁 NFT Box", type: "nft", color: "linear-gradient(135deg, #ff0077, #ff55cc)" },
// //   { label: "🎟 Ticket", type: "raffle_ticket", color: "linear-gradient(135deg, #0066ff, #00ccff)" },
// //   { label: "🌟 5 Stars", type: "stars", color: "linear-gradient(135deg, #ffee55, #ffaa00)" },
// //   { label: "🚀 Boost", type: "boost", color: "linear-gradient(135deg, #00ff99, #00ffaa)" },
// // ];

// // export default function HorizontalWheel() {
// //   const [spinning, setSpinning] = useState(false);
// //   const [offset, setOffset] = useState(0);
// //   const [result, setResult] = useState(null);

// //   const segmentWidth = 160; // ширина одного сегмента
// //   const totalSegments = segments.length;

// //   // 🔹 Функція обертання до конкретного призу
// //   const spinToReward = (rewardType) => {
// //     // знаходимо індекс призу
// //     const winningIndex = segments.findIndex(s => s.type === rewardType);

// //     if (winningIndex === -1) {
// //       console.error("Приз не знайдено:", rewardType);
// //       setSpinning(false);
// //       return;
// //     }

// //     // обчислюємо offset для анімації
// //   const randomTurns = 4 + Math.floor(Math.random() * 3);
// //     // (160 / 2 = 80). Цей зсув центрує сегмент під маркером.
// //      const centeringOffset = segmentWidth / 2; 
// //  const finalOffset = -((winningIndex + totalSegments * randomTurns) * segmentWidth) + centeringOffset;

// //     // скидаємо попереднє положення, щоб анімація повторювалась коректно
// //     setOffset(0);
// //     setResult(null);

// //     setTimeout(() => {
// //       setOffset(finalOffset);
// //     }, 50);

// //     // після завершення анімації показуємо результат
// //     setTimeout(() => {
// //       setSpinning(false);
// //       setResult(segments[winningIndex]);
// //     }, 4500);
// //   };

// //   // 🔹 Обробка спіну з оплатою
// //   const handleSpin = async () => {
// //     if (spinning) return;
// //     setSpinning(true);
// //     setResult(null);

// //     try {
// //       // 1️⃣ створюємо інвойс
// //       const { data: invoice } = await api.post("/api/wheel/create_invoice");
// //       if (!invoice.success) throw new Error("Не вдалося створити інвойс");

// //       const link = invoice.invoice_link;

// //       // 2️⃣ оплата через Telegram
// //       if (window.Telegram?.WebApp?.openInvoice) {
// //         window.Telegram.WebApp.openInvoice(link, async (status) => {
// //           if (status === "paid") {
// //             // 3️⃣ отримуємо результат від бекенду
// //             const { data: spinData } = await api.post("/api/wheel/spin");
// //             if (!spinData.success) throw new Error("Спін не вдався");

// //             // 4️⃣ запускаємо обертання до правильного призу
// //             spinToReward(spinData.result.type);
// //           } else {
// //             setSpinning(false);
// //           }
// //         });
// //       } else {
// //         // 🧪 Тест без Telegram
// //         const { data: spinData } = await api.post("/api/wheel/spin");
// //         spinToReward(spinData.result.type);
// //       }
// //     } catch (err) {
// //       console.error("Помилка спіну:", err);
// //       setSpinning(false);
// //     }
// //   };

// //   return (
// //     <div className={styles.container}>
// //       <h2>🎡 Wheel of Fortune</h2>

// //       <div className={styles.wheelWrapper}>
// //         <motion.div
// //           className={styles.wheel}
// //           animate={{ x: offset }}
// //           transition={{ duration: 4, ease: "easeOut" }}
// //         >
// //           {[...Array(8)].flatMap((_, i) =>
// //             segments.map((seg, idx) => (
// //               <div
// //                 key={`${i}-${idx}`}
// //                 className={styles.segment}
// //                 style={{ background: seg.color }}
// //               >
// //                 {seg.label}
// //               </div>
// //             ))
// //           )}
// //         </motion.div>

// //         <div className={styles.marker}>▼</div>
// //       </div>

// //       <button
// //         onClick={handleSpin}
// //         disabled={spinning}
// //         className={styles.spinButton}
// //       >
// //         {spinning ? "Spinning..." : "Spin for 1 XTR"}
// //       </button>

// //       {result && (
// //         <div className={styles.result}>
// //           🎉 You won: <strong>{result.label}</strong>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// import { useState } from "react";
// // eslint-disable-next-line no-unused-vars
// import { motion } from "framer-motion";
// import api from "../../utils/api";
// import styles from "./HorizontalWheel.module.css";

// // Кожен тип призу унікальний
// const segments = [
//       { label: "🎟 Ticket", type: "raffle_ticket", image: "/images/ticket.png", },
//   { 
//     label: "calendar", 
//     type: "nft", 
//     color: "", // gradient більше не потрібен
//     image: "/images/calendar.jpg", // шлях до картинки
//     stars: 1200,
//   },
//   { label: "🎟 Ticket", type: "raffle_ticket", image: "/images/ticket.png", },
//   { label: "🌟 5 Stars", type: "stars", stars: 5, image: "/images/5stars.png", },
//   { label: "🚀 Boost", type: "boost", image: "/images/boost.png", },
//     { 
//     label: "Swiss watch", 
//     type: "nft", 
//     color: "", // gradient більше не потрібен
//     image: "/images/swisswatch.jpg", // шлях до картинки
//     stars: 5500,
//   },
// ];

// export default function HorizontalWheel() {
//   const [spinning, setSpinning] = useState(false);
//   const [result, setResult] = useState(null);

//   const segmentWidth = 160;
//   const totalSegments = segments.length;
//   const wheelCycleLength = totalSegments * segmentWidth; // 4 * 160 = 640px
//   const centeringOffset = segmentWidth / 2; // 80px

//   const [offset, setOffset] = useState(0);
//   const [transition, setTransition] = useState({ duration: 0, ease: "easeOut" });

//   const spinToReward = (rewardType) => {
//     const winningIndex = segments.findIndex((s) => s.type === rewardType);

//     if (winningIndex === -1) {
//       console.error("Приз не знайдено:", rewardType);
//       setSpinning(false);
//       return;
//     }

//     const targetPosition = winningIndex * -segmentWidth + centeringOffset;
//     const currentOffset = offset;
//     const currentBaseOffset = currentOffset % wheelCycleLength;
//     const randomTurns = 4 + Math.floor(Math.random() * 3);
//     const spinDistance = wheelCycleLength * randomTurns;

//     const finalOffset = currentOffset + (targetPosition - currentBaseOffset) - spinDistance;

//     setTransition({ duration: 4, ease: "easeOut" });
//     setResult(null);
//     setOffset(finalOffset);

//     setTimeout(() => {
//       setSpinning(false);
//       setResult(segments[winningIndex]);
//     }, 4500);
//   };

//   const handleAnimationComplete = () => {
//     if (transition.duration === 0) return;

//     const currentBaseOffset = offset % wheelCycleLength;
//     setTransition({ duration: 0 });
//     setOffset(currentBaseOffset);
//   };

//   const handleSpin = async () => {
//     if (spinning) return;
//     setSpinning(true);
//     setResult(null);

//     try {
//       const { data: invoice } = await api.post("/api/wheel/create_invoice");
//       if (!invoice.success) throw new Error("Не вдалося створити інвойс");

//       const link = invoice.invoice_link;

//       if (window.Telegram?.WebApp?.openInvoice) {
//         window.Telegram.WebApp.openInvoice(link, async (status) => {
//           if (status === "paid") {
//             const { data: spinData } = await api.post("/api/wheel/spin");
//             if (!spinData.success) throw new Error("Спін не вдався");
//             spinToReward(spinData.result.type);
//           } else {
//             setSpinning(false);
//           }
//         });
//       } else {
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
//           transition={transition}
//           onAnimationComplete={handleAnimationComplete}
//         >
//           {[...Array(8)].flatMap((_, i) =>
//             segments.map((seg, idx) => (
//               <div
//                 key={`${i}-${idx}`}
//                 className={styles.segment}
//                 style={{ background: seg.image ? `url(${seg.image}) center/cover no-repeat` : seg.color}}
//               >
//                 {!seg.image && seg.label}
//               </div>
//             ))
//           )}
//           {/* {segments.map((seg, idx) => (
//   <div
//     key={idx}
//     className={styles.segment}
//     style={{
//       background: seg.image ? `url(${seg.image}) center/cover no-repeat` : seg.color
//     }}
//   >
//     {!seg.image && seg.label}
//   </div>
// ))} */}
//         </motion.div>

//         <div className={styles.marker}>▼</div>
//       </div>

//       <button
//         onClick={handleSpin}
//         disabled={spinning}
//         className={styles.spinButton}
//       >
//         {spinning ? "Spinning..." : "Spin for 10 ⭐"}
//       </button>

//       {result && (
//         <div className={styles.result}>
//           🎉 You won: <strong>{result.label}</strong>
//         </div>
//       )}
//       {/* <div className={styles.dropList}>
//         {segments.map((seg, i)=> (
//             <div> </div>
//         ))} */}
//     <h2 className={styles.sectionTitle}>СОДЕРЖИМОЕ КЕЙСА</h2>
// <div className={styles.itemsGrid}>
//   {segments.map((item, index) => (
//     <div key={index} className={styles.itemCard}>
//       {/* Картинка подарунка/NFT */}
//       <div className={styles.itemImageWrapper}>
//         <img
//           src={item.image || "/images/placeholder.png"}
//           alt={item.label}
//           className={styles.itemImage}
//           width="48"
//           height="48"
//         />
//       </div>

//       {/* Назва та зірки */}
//       <div className={styles.itemDetails}>
//         <p className={styles.itemName}>{item.label}</p>
        
        
//             {item.stars ? <div className={styles.itemStars}>{item.stars} <span className={styles.rotatingStar}>⭐️</span> </div> :  <div className={styles.itemStars}></div> }
//           {/* {item.stars ?? 0} <span className={styles.rotatingStar}>⭐️</span> */}
//       </div>
//     </div>
//   ))}
// </div>
//  {/* </div> */}
//       </div>
//     // </div>
    
//   );
// }


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import api from "../../utils/api";
import styles from "./HorizontalWheel.module.css";

// Кожен тип призу унікальний
const segments = [
  { label: "🎟 Ticket", type: "raffle_ticket", image: "/images/ticket.png" },
  {
    label: "calendar",
    type: "nft",
    image: "/images/calendar.jpg",
    stars: 1200,
  },
  { label: "🎟 Ticket", type: "raffle_ticket", image: "/images/ticket.png" },
  { label: "🌟 5 Stars", type: "stars", stars: 5, image: "/images/5stars.png" },
  { label: "🚀 Boost", type: "boost", image: "/images/boost.png" },
  {
    label: "Swiss watch",
    type: "nft",
    image: "/images/swisswatch.jpg",
    stars: 5500,
  },
];

export default function HorizontalWheel() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  // === НОВІ ЗМІННІ ===
  const [balance, setBalance] = useState(0); // Стан для балансу
  const navigate = useNavigate(); // Ініціалізуємо хук навігації
  const spinCost = 10; // Вартість одного спіну
  // === / Кінець нових змінних ===

  const segmentWidth = 160;
  const totalSegments = segments.length;
  const wheelCycleLength = totalSegments * segmentWidth;
  const centeringOffset = segmentWidth / 2;

  const [offset, setOffset] = useState(0);
  const [transition, setTransition] = useState({ duration: 0, ease: "easeOut" });

  // === Завантаження балансу ===
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await api.get("/api/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (res.data && res.data.internal_stars !== undefined) {
          setBalance(res.data.internal_stars);
        } else {
          console.warn("Не знайдено 'internal_stars' у відповіді");
          setBalance(0);
        }
      } catch (err) {
        console.error("❌ Failed to fetch balance:", err.response?.data || err.message);
      }
    };
    fetchBalance();
  }, []); // Пустий масив = виконати 1 раз при завантаженні
  // === / Кінець блоку завантаження ===

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

    // 1. Перевіряємо баланс ДО запиту
    if (balance < spinCost) {
      console.log("Недостатньо зірок. Перенаправлення на сторінку поповнення...");
      // 2. Якщо зірок не вистачає - перекидуємо на сторінку депозиту
      navigate("/deposit"); // (або ваш шлях до сторінки поповнення)
      return;
    }

    // Якщо грошей вистачає
    setSpinning(true);
    setResult(null);

    try {
      // 3. БІЛЬШЕ НЕ СТВОРЮЄМО ІНВОЙС.
      // Одразу викликаємо ендпоінт спіну.
      const { data: spinData } = await api.post("/api/wheel/spin");

      if (!spinData.success) {
        // Обробляємо помилку з бекенду
        throw new Error(spinData.message || "Спін не вдався");
      }

      // 4. Оновлюємо баланс локально
      if (spinData.new_internal_stars !== undefined) {
        setBalance(spinData.new_internal_stars);
      } else {
        // Якщо бекенд не повернув, оновлюємо оптимістично
        setBalance((prev) => prev - spinCost);
      }

      // 5. Запускаємо анімацію
      spinToReward(spinData.result.type);

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
                style={{ background: seg.image ? `url(${seg.image}) center/cover no-repeat` : seg.color }}
              >
                {!seg.image && seg.label}
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
        {spinning ? "Spinning..." : `Spin for ${spinCost} ⭐`}
      </button>

      {result && (
        <div className={styles.result}>
          🎉 You won: <strong>{result.label}</strong>
        </div>
      )}
      <h2 className={styles.sectionTitle}>СОДЕРЖИМОЕ КЕЙСА</h2>
      <div className={styles.itemsGrid}>
        {segments.map((item, index) => (
          <div key={index} className={styles.itemCard}>
            <div className={styles.itemImageWrapper}>
              <img
                src={item.image || "/images/placeholder.png"}
                alt={item.label}
                className={styles.itemImage}
                width="48"
                height="48"
              />
            </div>
            <div className={styles.itemDetails}>
              <p className={styles.itemName}>{item.label}</p>
              {item.stars ? <div className={styles.itemStars}>{item.stars} <span className={styles.rotatingStar}>⭐️</span> </div> : <div className={styles.itemStars}></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}