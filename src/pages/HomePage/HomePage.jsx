// import { useState, useEffect } from "react";
// import { useOutletContext, Link } from "react-router-dom";
// import styles from "./HomePage.module.css";
// import { FaUserCircle } from "react-icons/fa";
// import { FiZap } from "react-icons/fi";
// import TapButton from "../../components/TapButton/TapButton";
// import api from "../../utils/api";
// import ProfileModal from "../../components/ProfileModal/ProfileModal";

// export default function HomePage() {
//   const { balance, isTapped, handleTap, tapPower } = useOutletContext();

//   const [floatingNumbers, setFloatingNumbers] = useState([]);
//   const [localProgress, setLocalProgress] = useState(0);
//   const [clicks, setClicks] = useState(0);
//    const [profileOpen, setProfileOpen] = useState(false);

//   // 🧠 Отримати прогрес при вході
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await api.get("/api/user/me", {
//           headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
//         });
//         // 🟢 Виправлено: беремо click_progress, а не progress
//         setLocalProgress(res.data.click_progress || 0);
//       } catch (err) {
//         console.error("❌ Failed to load user progress:", err);
//       }
//     };
//     fetchUser();
//   }, []);

//   // ⚡ Обробник кліку (анімація + оновлення бекенду)
//   const handleTapWithAnimation = async (e) => {
//     handleTap();

//     // створюємо ефект "літаючого числа"
//     const newNumber = {
//       id: Date.now(),
//       value: tapPower,
//       x: e.clientX,
//       y: e.clientY,
//     };
//     setFloatingNumbers((curr) => [...curr, newNumber]);
//     setTimeout(() => {
//       setFloatingNumbers((curr) => curr.filter((num) => num.id !== newNumber.id));
//     }, 1000);

//     // локально оновлюємо
//     setClicks((prev) => prev + 1);
//     setLocalProgress((prev) => Math.min(prev + 0.001, 1));

//     // оновлення на бекенді
//     try {
//       const res = await api.post(
//         "/api/user/update-clicks",
//         { progress: 0.001 },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
//       );

//       // 🟢 синхронізація після відповіді
//       setLocalProgress(res.data.progress);
//     } catch (err) {
//       console.error("❌ update-clicks error:", err.response?.data?.message || err.message);
//     }
//   };

//   // 🎟 Отримати квиток (100%)
//   const handleClaimTicket = async () => {
//     try {
//       const res = await api.post(
//         "/api/user/claim-ticket",
//         {},
//         { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
//       );

//       alert(`🎟 Ticket claimed! You now have ${res.data.tickets} tickets.`);
//       setLocalProgress(0);
//       setClicks(0);
//     } catch (err) {
//       alert(err.response?.data?.message || "Error claiming ticket");
//     }
//   };

//   const progressColor =
//     localProgress < 0.7
//       ? "#00eaff"
//       : localProgress < 0.95
//       ? "#00ff99"
//       : "#ff00ff";

//   return (
//     <div className={styles.container}>
//       <div className={styles.Card}>
//         <header className={styles.header}>
//           <h1 className={styles.title}>SPACE CLICKER</h1>
//             <div className={styles.userIcon}>
//       {/* решта твого клікеру */}
//       <button width="24px" height="24px" className={styles.btnProfile} onClick={() => setProfileOpen(true)}><FaUserCircle className={styles.userIcon} /></button>
//       <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} /> 
//     </div>
//         </header>

//         <div className={styles.balance}>{balance.toLocaleString("en-US")} ★</div>

//         <TapButton isTapped={isTapped} onClick={handleTapWithAnimation} />

//         <div
//           className={styles.progressSection}
//           onClick={() => localProgress >= 1 && handleClaimTicket()}
//           style={{ cursor: localProgress >= 1 ? "pointer" : "default" }}
//         >
//           <span className={styles.progressLabel}>PROGRESS</span>
//           <div className={styles.progressBar}>
//             <div
//               className={styles.progressFill}
//               style={{
//                 width: `${Math.min(localProgress * 100, 100)}%`,
//                 backgroundColor: progressColor,
//                 boxShadow:
//                   localProgress >= 0.95
//                     ? `0 0 20px ${progressColor}, 0 0 40px ${progressColor}`
//                     : "none",
//                 transition: "all 0.3s ease-in-out",
//               }}
//             ></div>
//           </div>
//         </div>

//         <Link to="/boosters" className={styles.boostersButton}>
//           <FiZap /> Boosters
//         </Link>
//       </div>

//       {floatingNumbers.map((num) => (
//         <div
//           key={num.id}
//           className={styles.floatingNumber}
//           style={{ left: `${num.x}px`, top: `${num.y}px` }}
//         >
//           +{num.value}
//         </div>
//       ))}
//     </div>
//   );
// }

import { useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import styles from "./HomePage.module.css";
import { FaUserCircle } from "react-icons/fa";
import { FiZap } from "react-icons/fi";
import TapButton from "../../components/TapButton/TapButton";
// ❌ api.js ТУТ БІЛЬШЕ НЕ ПОТРІБЕН
// import api from "../../utils/api"; 
import ProfileModal from "../../components/ProfileModal/ProfileModal";

export default function HomePage() {
  // 1. 🟢 ОТРИМУЄМО ВСЕ З MAINA, ВКЛЮЧАЮЧИ 'progress'
  const { 
    balance, 
    isTapped, 
    handleTap, // ⬅️ Готова функція з MainLayout
    tapPower,
    progress,    // ⬅️ Готовий прогрес з MainLayout
    ticketReady, // ⬅️ Готовий boolean з MainLayout
    claimTicket  // ⬅️ Готова функція з MainLayout
  } = useOutletContext();

  const [floatingNumbers, setFloatingNumbers] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);

  // ❌ ВИДАЛЕНО ВЕСЬ 'useEffect'
  // MainLayout вже завантажує 'progress' для нас.

  // 2. ⚡️ ФУНКЦІЯ СПРОЩЕНА
  const handleTapWithAnimation = (e) => {
    // 3. 🟢 Викликаємо ТІЛЬКИ ОДНУ функцію з MainLayout
    // Вона вже оновлює і баланс, і прогрес на бекенді
    handleTap();

    // створюємо ефект "літаючого числа"
    const newNumber = {
      id: Date.now(),
      value: tapPower,
      x: e.clientX,
      y: e.clientY,
    };
    setFloatingNumbers((curr) => [...curr, newNumber]);
    setTimeout(() => {
      setFloatingNumbers((curr) => curr.filter((num) => num.id !== newNumber.id));
    }, 1000);
    
    // ❌ ВИДАЛЕНО ВСЮ ЛОКАЛЬНУ ЛОГІКУ 'progress'
    // ❌ ВИДАЛЕНО ВЕСЬ 'api.post("/api/user/update-clicks")'
  };

  // 3. 🎟️ ФУНКЦІЯ СПРОЩЕНА
  const handleClaimTicket = () => {
    // Просто викликаємо готову функцію з MainLayout
    claimTicket();
    
    // (Не використовуй alert, краще toast, 
    // але логіка клейму тепер повністю у MainLayout)
  };

  const progressColor =
    progress < 0.7
      ? "#00eaff"
      : progress < 0.95
      ? "#00ff99"
      : "#ff00ff";

  return (
    <div className={styles.container}>
      <div className={styles.Card}>
        <header className={styles.header}>
          <h1 className={styles.title}>SPACE CLICKER</h1>
          <div className={styles.userIcon}>
            <button width="24px" height="24px" className={styles.btnProfile} onClick={() => setProfileOpen(true)}><FaUserCircle className={styles.userIcon} /></button>
            <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} /> 
          </div>
        </header>

        {/* 4. 🟢 Використовуємо 'balance' з MainLayout */}
        <div className={styles.balance}>{balance.toLocaleString("en-US")} ★</div>

        <TapButton isTapped={isTapped} onClick={handleTapWithAnimation} />

        <div
          className={styles.progressSection}
          // 5. 🟢 Використовуємо 'ticketReady' з MainLayout
          onClick={() => ticketReady && handleClaimTicket()}
          style={{ cursor: ticketReady ? "pointer" : "default" }}
        >
          <span className={styles.progressLabel}>PROGRESS</span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                // 6. 🟢 Використовуємо 'progress' з MainLayout
                width: `${Math.min(progress * 100, 100)}%`,
                backgroundColor: progressColor,
                boxShadow:
                  progress >= 0.95
                    ? `0 0 20px ${progressColor}, 0 0 40px ${progressColor}`
                    : "none",
                transition: "all 0.3s ease-in-out",
              }}
            ></div>
          </div>
        </div>

        <Link to="/boosters" className={styles.boostersButton}>
          <FiZap /> Boosters
        </Link>
      </div>

      {floatingNumbers.map((num) => (
        <div
          key={num.id}
          className={styles.floatingNumber}
          style={{ left: `${num.x}px`, top: `${num.y}px` }}
        >
          +{num.value}
        </div>
      ))}
    </div>
  );
}


