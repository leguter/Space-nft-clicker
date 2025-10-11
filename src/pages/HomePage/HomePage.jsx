// import { useState } from "react";
import { useOutletContext } from "react-router-dom";
// Імпортуємо стилі як об'єкт `styles`
import styles from "./HomePage.module.css";
// Іконки для інтерфейсу
import { FaUserCircle } from "react-icons/fa"; // npm install react-icons
import { FiZap } from "react-icons/fi";
import { Link } from "react-router-dom";
export default function HomePage() {
   const { balance, progress, isTapped, handleTap } = useOutletContext();
  // Для прикладу використаємо внутрішній стан, але ці дані мають приходити ззовні
  // const [balance, setBalance] = useState(1245678);
  // const [progress, setProgress] = useState(0.75); // 75% прогресу
  // const [isTapped, setIsTapped] = useState(false);
  // Функція для обробки натискання
  // const handleTap = () => {
  //   // 1. Анімація
  //   setIsTapped(true);
  //   setTimeout(() => setIsTapped(false), 150);

  //   // 2. Логіка (збільшення балансу, тощо)
  //   setBalance((prevBalance) => prevBalance + 1);
  //   // Тут ви б викликали функцію, передану через пропси
  //   // onTap();
  // };

  return (
    <div className={styles.container}>
      <div className={styles.Card}>
        {/* -- ХЕДЕР -- */}
        <header className={styles.header}>
          <h1 className={styles.title}>SPACE CLICKER</h1>
          <FaUserCircle className={styles.userIcon} />
        </header>

        {/* -- БАЛАНС -- */}
        <div className={styles.balance}>
          {balance.toLocaleString("en-US")} ★
        </div>

        {/* -- ГОЛОВНА КНОПКА -- */}
        <div
          className={`${styles.tapButton} ${isTapped ? styles.tapped : ""}`}
          onClick={handleTap}
        >
          <div className={styles.tapButtonInner}>
            <span className={styles.tapIcon}>👆</span>
            <span className={styles.tapText}>Tap</span>
          </div>
        </div>

        {/* -- ПРОГРЕС БАР -- */}
        <div className={styles.progressSection}>
          <span className={styles.progressLabel}>PROGRESS</span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress * 100}%` }}
            ></div>
          </div>
        </div>

        {/* -- КНОПКА БУСТЕРІВ -- */}
         <Link to="/boosters" className={styles.boostersButton}>
          <FiZap /> Boosters
        </Link>
      </div>
    </div>
  );
}