// import { useState } from "react";
// import { useOutletContext } from "react-router-dom";
// // Імпортуємо стилі як об'єкт `styles`
// import styles from "./HomePage.module.css";
// // Іконки для інтерфейсу
// import { FaUserCircle } from "react-icons/fa"; // npm install react-icons
// import { FiZap } from "react-icons/fi";
// import { Link } from "react-router-dom";
// import TapButton from "../../components/TapButton/TapButton";
// export default function HomePage() {
//    const { balance, progress, isTapped, handleTap, tapPower } = useOutletContext();
//   //  console.log(tapPower)
//      const [floatingNumbers, setFloatingNumbers] = useState([]);
//   // Для прикладу використаємо внутрішній стан, але ці дані мають приходити ззовні
//   // const [balance, setBalance] = useState(1245678);
//   // const [progress, setProgress] = useState(0.75); // 75% прогресу
//   // const [isTapped, setIsTapped] = useState(false);
//   // Функція для обробки натискання
//   // const handleTap = () => {
//   //   // 1. Анімація
//   //   setIsTapped(true);
//   //   setTimeout(() => setIsTapped(false), 150);

//   //   // 2. Логіка (збільшення балансу, тощо)
//   //   setBalance((prevBalance) => prevBalance + 1);
//   //   // Тут ви б викликали функцію, передану через пропси
//   //   // onTap();
//   // };
// const handleTapWithAnimation = (e) => {
//     // 1. Викликаємо оригінальну функцію для оновлення балансу
//     handleTap();

//     // 2. Створюємо новий об'єкт для анімації
//     const newNumber = {
//       id: Date.now(),
//       value: tapPower, // Використовуємо динамічне значення
//       x: e.clientX,     // Координати кліку
//       y: e.clientY,
//     };

//     // 3. Додаємо його в масив для рендеру
//     setFloatingNumbers((current) => [...current, newNumber]);

//     // 4. Видаляємо його через 1 секунду (тривалість анімації)
//     setTimeout(() => {
//       setFloatingNumbers((current) => current.filter((num) => num.id !== newNumber.id));
//     }, 1000);
//   };
//   return (
//     <div className={styles.container}>
//       <div className={styles.Card}>
//         {/* -- ХЕДЕР -- */}
//         <header className={styles.header}>
//           <h1 className={styles.title}>SPACE CLICKER</h1>
//           <FaUserCircle className={styles.userIcon} />
//         </header>

//         {/* -- БАЛАНС -- */}
//         <div className={styles.balance}>
//           {balance.toLocaleString("en-US")} ★
//         </div>

//         {/* -- ГОЛОВНА КНОПКА -- */}
//        <TapButton isTapped={isTapped} 
//           onClick={handleTapWithAnimation}  />

//         {/* -- ПРОГРЕС БАР -- */}
//         <div className={styles.progressSection}>
//           <span className={styles.progressLabel}>PROGRESS</span>
//           <div className={styles.progressBar}>
//             <div
//               className={styles.progressFill}
//               style={{ width: `${progress * 100}%` }}
//             ></div>
//           </div>
//         </div>

//         {/* -- КНОПКА БУСТЕРІВ -- */}
//          <Link to="/boosters" className={styles.boostersButton}>
//           <FiZap /> Boosters
//         </Link>
//       </div>
//         {floatingNumbers.map((num) => (
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
import { useOutletContext } from "react-router-dom";
import styles from "./HomePage.module.css";
import { FaUserCircle } from "react-icons/fa";
import { FiZap } from "react-icons/fi";
import TapButton from "../../components/TapButton/TapButton";
import api from "../../utils/api";
import { Link } from "react-router-dom";
export default function HomePage() {
  const { balance, progress, isTapped, handleTap, tapPower } = useOutletContext();
  const [floatingNumbers, setFloatingNumbers] = useState([]);
  const [localProgress, setLocalProgress] = useState(progress);

  const handleTapWithAnimation = (e) => {
    handleTap();

    const newNumber = {
      id: Date.now(),
      value: tapPower,
      x: e.clientX,
      y: e.clientY,
    };

    setFloatingNumbers((current) => [...current, newNumber]);
    setTimeout(() => {
      setFloatingNumbers((current) => current.filter((num) => num.id !== newNumber.id));
    }, 1000);
  };

  const handleClaimTicket = async () => {
    try {
      const res = await api.post("/api/user/claim-ticket", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      });

      alert(`🎟 Ticket claimed! New tickets: ${res.data.tickets}`);
      setLocalProgress(0); // скидаємо прогрес
    } catch (err) {
      alert(err.response?.data?.message || "Error claiming ticket");
    }
  };

  // Колір прогресу залежить від прогресу
  const progressColor = localProgress < 0.7
    ? "#00eaff"
    : localProgress < 0.95
      ? "#00ff99"
      : "#ff00ff"; // коли близько до 100%

  return (
    <div className={styles.container}>
      <div className={styles.Card}>
        <header className={styles.header}>
          <h1 className={styles.title}>SPACE CLICKER</h1>
          <FaUserCircle className={styles.userIcon} />
        </header>

        <div className={styles.balance}>
          {balance.toLocaleString("en-US")} ★
        </div>

        <TapButton isTapped={isTapped} onClick={handleTapWithAnimation} />

        <div 
          className={styles.progressSection} 
          onClick={() => localProgress >= 1 && handleClaimTicket()}
          style={{ cursor: localProgress >= 1 ? "pointer" : "default" }}
        >
          <span className={styles.progressLabel}>PROGRESS</span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `100%`,
                backgroundColor: progressColor,
                boxShadow: localProgress >= 0.95
                  ? `0 0 20px ${progressColor}, 0 0 40px ${progressColor}`
                  : "none",
                transition: "all 0.3s ease-in-out"
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
