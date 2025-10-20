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

import  { useState } from "react";
import { motion } from "framer-motion";
import api from "../../utils/api";
import styles from "./WheelPage.module.css"; // ❗️ Імпортуємо стилі

// ... (конфігурація segments залишається такою ж)
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
  const [balance, setBalance] = useState(null);
  const [tickets, setTickets] = useState(null);

  // Створюємо audio об'єкти один раз
  const [spinSound] = useState(() => new Audio("https://actions.google.com/sounds/v1/foley/spinning_coin.ogg"));
  const [winSound] = useState(() => new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"));

  const getSegmentIndex = (type) => {
    switch (type) {
      case "raffle_ticket":
        return Math.floor(Math.random() * 6); // 0-5
      case "stars":
        return 6; // 6
      case "nft":
        return 7; // 7
      default:
        return 0;
    }
  };

  const spin = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    try {
      // 1️⃣ Отримати інвойс
      const invoiceRes = await api.post("/api/wheel/create_invoice");
      if (!invoiceRes.data.success) {
        throw new Error(invoiceRes.data.message || "Invoice creation failed");
      }
      const invoiceLink = invoiceRes.data.invoice_link;

      // 2️⃣ Відкрити Telegram оплату
      if (window.Telegram?.WebApp) {
        const onPayment = async (event) => {
          window.Telegram.WebApp.offEvent("invoiceClosed", onPayment);

          if (event.status === "paid") {
            spinSound.currentTime = 0;
            spinSound.play();

            try {
              // 4️⃣ Викликаємо /spin
              const res = await api.post("/api/wheel/spin");
              const data = res.data;

              // 5️⃣ Розрахунок анімації
              const prizeIndex = getSegmentIndex(data.result.type);
              const degreesPerSegment = 360 / segments.length; // 45
              
              const baseSpins = (Math.floor(rotation / 360) + 5) * 360;
              const prizeAngle = prizeIndex * degreesPerSegment;
              const jitter = (Math.random() - 0.5) * (degreesPerSegment * 0.5);

              setRotation(baseSpins - prizeAngle + jitter);

              // 6️⃣ Показуємо результат
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
            const segmentAngle = 360 / segments.length; // 45
            const skewAngle = 90 - segmentAngle; // 45

            return (
              <div
                key={i}
                className={styles.segment}
                style={{
                  // ❗️ Залишаємо лише ДИНАМІЧНІ стилі
                  transform: `rotate(${i * segmentAngle}deg) skewY(-${skewAngle}deg)`,
                  background: p.color,
                  color: p.type === "nft" ? "#000" : "#fff",
                }}
              >
               <span
                  className={styles.segmentSpan}
                  style={{
                    // ✅ ОСЬ ВИПРАВЛЕНИЙ РЯДОК
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

      <button
        onClick={spin}
        disabled={spinning}
        className={styles.spinButton}
      >
        {spinning ? "Крутиться..." : "Крутить (10⭐)"}
      </button>

      {/* Блок результатів */}
      {result && (
        <p className={styles.resultBox}>
          Вы выиграли:{" "}
          {result.type === "raffle_ticket"
            ? "🎟 1 Ticket"
            : result.type === "stars"
            ? "🌟 5 Stars"
            : "🎁 NFT Mystery Box"}
        </p>
      )}

      {/* Блоки балансу */}
      {tickets !== null && (
        <div className={styles.ticketsBox}>🎟 Tickets: {tickets}</div>
      )}

      {balance !== null && (
        <div className={styles.balanceBox}>⭐ Internal Balance: {balance}</div>
      )}

      {/* ❗️ Тег <style> видалено, бо @keyframes тепер у .css файлі */}
    </div>
  );
}