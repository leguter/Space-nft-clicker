// import { useState } from "react";
// import styles from "./WheelPage.module.css";
// import api from "../../utils/api";

// export default function WheelPage() {
//   const [spinning, setSpinning] = useState(false);
//   const [rotation, setRotation] = useState(0);
//   const [result, setResult] = useState(null);
//   const [balance, setBalance] = useState(null); // Баланс внутрішніх зірок

//   const segments = [
//     "🎟 Ticket",
//     "🎟 Ticket",
//     "🎟 Ticket",
//     "🎟 Ticket",
//     "🎟 Ticket",
//     "🎟 Ticket",
//     "🌟 5 Stars", // Це 5 *внутрішніх* зірок
//     "🎁 NFT Box",
//   ];

//   const spinWheel = async () => {
//     if (spinning) return;
//     setSpinning(true);
//     setResult(null);

//     try {
//       // 1️⃣ Отримати інвойс від бекенду
//       const invoiceRes = await api.post("/api/wheel/create_invoice");
//       if (!invoiceRes.data.success) {
//         throw new Error(invoiceRes.data.message || "Invoice creation failed");
//       }

//       const invoiceLink = invoiceRes.data.invoice_link;

//       // 2️⃣ Відкрити Telegram оплату (XTR)
//       if (window.Telegram?.WebApp) {
//         const onPayment = async (event) => {
//           // Важливо одразу зняти слухача, щоб він не спрацював двічі
//           window.Telegram.WebApp.offEvent("invoiceClosed", onPayment);

//           // Перевіряємо, чи оплата успішна
//           if (event.status === "paid") {
//             try {
//               // 3️⃣ Оплата пройшла, викликаємо /spin для отримання призу
//               const res = await api.post("/api/wheel/spin");
//               const data = res.data;

//               // 4️⃣ Анімуємо колесо
//               const index = getSegmentIndex(data.result.type);

//               const baseSpins = 360 * 5; // 5 повних обертів
//               const segmentAngle = 360 / segments.length; // 45 градусів
              
//               // Вказівник на 0. Обертаємо "назад"
//               const targetAngle = -(segmentAngle * index);
              
//               // Невеликий випадковий зсув в межах сегмента
//               const randomJitter = (Math.random() - 0.5) * (segmentAngle * 0.8);
              
//               const newRotation = baseSpins + targetAngle + randomJitter;
//               setRotation(rotation + newRotation);

//               // 5️⃣ Показуємо результат після анімації
//               setTimeout(() => {
//                 setResult(data.result);
//                 setBalance(data.balance); // Оновлюємо баланс *внутрішніх* зірок
//                 setSpinning(false);
//               }, 4000); // 4 секунди анімації

//             } catch (spinErr) {
//               console.error("Spin error after payment:", spinErr);
//               alert("Spin failed after payment. Contact support.");
//               setSpinning(false);
//             }
//           } else {
//             // Оплата скасована, "pending" або "failed"
//             console.log("Payment not completed:", event.status);
//             setSpinning(false);
//           }
//         };

//         // Слухаємо подію закриття інвойсу
//         window.Telegram.WebApp.onEvent("invoiceClosed", onPayment);
//         // Відкриваємо інвойс
//         window.Telegram.WebApp.openInvoice(invoiceLink);

//       } else {
//         alert("Telegram WebApp not available");
//         setSpinning(false);
//       }
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Payment or spin error");
//       setSpinning(false);
//     }
//   };

//   const getSegmentIndex = (type) => {
//     switch (type) {
//       case "raffle_ticket":
//         // Повертає випадковий індекс серед перших 6 сегментів
//         return Math.floor(Math.random() * 6);
//       case "stars":
//         return 6; // 7-й сегмент (індекс 6)
//       case "nft":
//         return 7; // 8-й сегмент (індекс 7)
//       default:
//         return 0;
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.title}>Wheel of Fortune</h2>

//       <div className={styles.wheelContainer}>
//         <div
//           className={`${styles.wheel} ${spinning ? styles.spinning : ""}`}
//           style={{ transform: `rotate(${rotation}deg)` }}
//         >
//           {segments.map((seg, i) => (
//             <div
//               key={i}
//               className={styles.segment}
//               style={{
//                 // 360 / 8 = 45
//                 transform: `rotate(${45 * i}deg) skewY(-45deg)`,
//               }}
//             >
//               <span>{seg}</span>
//             </div>
//           ))}
//         </div>
//         <div className={styles.pointer}></div>
//       </div>

//       <button
//         className={styles.spinButton}
//         onClick={spinWheel}
//         disabled={spinning}
//       >
//         {spinning ? "Spinning..." : "Spin (10⭐)"}
//       </button>

//       {result && (
//         <div className={styles.resultBox}>
//           🎉 You won:{" "}
//           {result.type === "raffle_ticket"
//             ? "🎟 1 Ticket"
//             : result.type === "stars"
//             ? "🌟 5 Stars" // 5 внутрішніх зірок
//             : "🎁 NFT Mystery Box"}
//         </div>
//       )}

//       {balance !== null && (
//         <div className={styles.balance}>⭐ Internal Balance: {balance}</div>
//       )}
//     </div>
//   );
// }

import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import api from "../../utils/api"; // ❗️ Переконайтесь, що шлях правильний

//
// ❗️ ОСЬ ТУТ ВИ МОЖЕТЕ НАЛАШТУВАТИ ПРИЗИ ❗️
// Кількість сегментів (8) та їх 'type' мають відповідати
// логіці на вашому бекенді (getSegmentIndex)
//
const segments = [
  { label: "🎟 Ticket", type: "raffle_ticket", color: "linear-gradient(135deg, #0066ff, #00ccff)" },
  { label: "🎟 Ticket", type: "raffle_ticket", color: "linear-gradient(135deg, #2266ff, #22ccff)" },
  { label: "🎟 Ticket", type: "raffle_ticket", color: "linear-gradient(135deg, #0066ff, #00ccff)" },
  { label: "🎟 Ticket", type: "raffle_ticket", color: "linear-gradient(135deg, #2266ff, #22ccff)" },
  { label: "🎟 Ticket", type: "raffle_ticket", color: "linear-gradient(135deg, #0066ff, #00ccff)" },
  { label: "🎟 Ticket", type: "raffle_ticket", color: "linear-gradient(135deg, #2266ff, #22ccff)" },
  { label: "🌟 5 Stars", type: "stars", color: "linear-gradient(135deg, #ffee55, #ffaa00)" },
  { label: "🎁 NFT Box", type: "nft", color: "linear-gradient(135deg, #ff0077, #ff55cc)" },
];

export default function SpaceRaffle() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [balance, setBalance] = useState(null); // Баланс внутрішніх зірок
  const [tickets, setTickets] = useState(null); // Баланс квитків

  // Звуки з вашого нового файлу
  const spinSound = new Audio("https://actions.google.com/sounds/v1/foley/spinning_coin.ogg");
  const winSound = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");

  /**
   * Функція з вашої старої логіки.
   * Визначає індекс сегмента на основі відповіді сервера.
   */
  const getSegmentIndex = (type) => {
    switch (type) {
      case "raffle_ticket":
        // Повертає випадковий індекс серед перших 6 сегментів (0-5)
        return Math.floor(Math.random() * 6);
      case "stars":
        return 6; // 7-й сегмент
      case "nft":
        return 7; // 8-й сегмент
      default:
        return 0;
    }
  };

  /**
   * Повністю нова логіка spin, що включає оплату XTR
   */
  const spin = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    try {
      // 1️⃣ Отримати інвойс від бекенду
      const invoiceRes = await api.post("/api/wheel/create_invoice");
      if (!invoiceRes.data.success) {
        throw new Error(invoiceRes.data.message || "Invoice creation failed");
      }
      const invoiceLink = invoiceRes.data.invoice_link;

      // 2️⃣ Відкрити Telegram оплату (XTR)
      if (window.Telegram?.WebApp) {
        const onPayment = async (event) => {
          window.Telegram.WebApp.offEvent("invoiceClosed", onPayment);

          // 3️⃣ Перевіряємо, чи оплата успішна
          if (event.status === "paid") {
            // Оплата пройшла, запускаємо звук та анімацію
            spinSound.currentTime = 0;
            spinSound.play();

            try {
              // 4️⃣ Викликаємо /spin для отримання РЕАЛЬНОГО призу
              const res = await api.post("/api/wheel/spin");
              const data = res.data; // { success, result, balance, tickets }

              // 5️⃣ Розрахунок анімації
              const prizeIndex = getSegmentIndex(data.result.type);
              const degreesPerSegment = 360 / segments.length;
              
              // Цільова позиція (середина сегмента)
              const targetStop = (prizeIndex * degreesPerSegment) + (degreesPerSegment / 2);
              
              // Розраховуємо нове абсолютне значення rotation
              // Беремо поточний "оберт" та додаємо 5 повних обертів
              let newAbsoluteRotation = (Math.floor(rotation / 360) * 360) + (360 * 5);
              newAbsoluteRotation += targetStop;

              // Переконуємось, що ми не крутимо назад
              if (newAbsoluteRotation <= rotation) {
                newAbsoluteRotation += 360;
              }

              setRotation(newAbsoluteRotation); // framer-motion анімує до цього значення

              // 6️⃣ Показуємо результат після анімації
              setTimeout(() => {
                spinSound.pause();
                winSound.currentTime = 0;
                winSound.play();
                setResult(data.result);
                setBalance(data.balance);
                setTickets(data.tickets);
                setSpinning(false);
              }, 4200); // 4s анімація + 0.2s буфер

            } catch (spinErr) {
              console.error("Spin error after payment:", spinErr);
              alert("Spin failed after payment. Contact support.");
              spinSound.pause();
              setSpinning(false);
            }
          } else {
            // Оплата скасована або не вдалася
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

  //
  // JSX з вашого нового файлу (але з виправленнями)
  //
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-white"
      style={{
        background: "radial-gradient(circle at center, #0a0026, #000010 80%)",
      }}
    >
      <h1 className="text-xl mb-4 tracking-widest text-purple-300 font-bold">
        SPACE RAFFLE
      </h1>

      <div className="relative">
        {/* Указатель */}
        <div
          className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 z-10"
          style={{
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderBottom: "20px solid #ff00cc",
            filter: "drop-shadow(0 0 10px #ff00cc)",
          }}
        ></div>

        {/* Колесо */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.33, 1, 0.68, 1] }} // 4 секунди анімація
          className="rounded-full overflow-hidden border-[4px] border-purple-800 shadow-[0_0_30px_rgba(120,0,255,0.7)]"
          style={{
            width: "300px",
            height: "300px",
            position: "relative",
          }}
        >
       {segments.map((p, i) => {
  const segmentAngle = 360 / segments.length; // 45 для 8 сегментів
  const skewAngle = 90 - segmentAngle; // 45 для 8 сегментів

  return (
    <div
      key={i}
      style={{
        position: "absolute",
        width: "50%",
        height: "50%",
        top: "50%",
        left: "50%",
        transformOrigin: "0% 0%",
        
        // ❗️ ОСЬ ТУТ БУЛА ПОМИЛКА ❗️
        // Переконайтеся, що у вас тут зворотні лапки `...`
        transform: `rotate(${i * segmentAngle}deg) skewY(-${skewAngle}deg)`,
        
        background: p.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        color: p.type === "nft" ? "#000" : "#fff",
        textShadow: "0 0 10px rgba(255,255,255,0.6)",
      }}
    >
      {/* ❗️ ЦЕЙ SPAN ТЕЖ ВАЖЛИВИЙ ❗️
          Він "вирівнює" текст, щоб він не був косим */}
      <span style={{ transform: `skewY(${skewAngle}deg) rotate(${segmentAngle / 2}deg)` }}>
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
        className="mt-8 px-6 py-3 rounded-xl font-semibold text-lg shadow-[0_0_20px_rgba(255,0,255,0.5)] 
                 bg-gradient-to-r from-[#7a00ff] to-[#ff00cc] hover:scale-105 transition-transform"
      >
        {/* ❗️ На кнопці ціна з бекенду (10 XTR) */}
        {spinning ? "Крутиться..." : "Крутить (10⭐)"}
      </button>

      {/* ❗️ Блок результатів з вашої старої логіки */}
      {result && (
        <p
          className="mt-6 text-2xl font-bold"
          style={{
            color: "#ffe600",
            textShadow: "0 0 20px #ff00cc",
            animation: "blink 0.5s ease-in-out infinite alternate",
          }}
        >
          Вы выиграли:{" "}
          {result.type === "raffle_ticket"
            ? "🎟 1 Ticket"
            : result.type === "stars"
            ? "🌟 5 Stars" // 5 внутрішніх зірок
            : "🎁 NFT Mystery Box"}
        </p>
      )}

      {/* ❗️ Блоки балансу з вашої старої логіки */}
      {tickets !== null && (
        <div className="mt-4 text-lg">🎟 Tickets: {tickets}</div>
      )}

      {balance !== null && (
        <div className="mt-2 text-lg">⭐ Internal Balance: {balance}</div>
      )}

      <style>{`
        @keyframes blink {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(1.1); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}