import { useState } from "react";
import { useOutletContext } from "react-router-dom";
// Імпортуємо стилі як об'єкт `styles`
import styles from "./HomePage.module.css";
// Іконки для інтерфейсу
import { FaUserCircle } from "react-icons/fa"; // npm install react-icons
import { FiZap } from "react-icons/fi";
import { Link } from "react-router-dom";
import TapButton from "../../components/TapButton/TapButton";
export default function HomePage() {
   const { balance, progress, isTapped, handleTap, tapPower } = useOutletContext();
     const [floatingNumbers, setFloatingNumbers] = useState([]);
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
const handleTapWithAnimation = (e) => {
    // 1. Викликаємо оригінальну функцію для оновлення балансу
    handleTap();

    // 2. Створюємо новий об'єкт для анімації
    const newNumber = {
      id: Date.now(),
      value: tapPower, // Використовуємо динамічне значення
      x: e.clientX,     // Координати кліку
      y: e.clientY,
    };

    // 3. Додаємо його в масив для рендеру
    setFloatingNumbers((current) => [...current, newNumber]);

    // 4. Видаляємо його через 1 секунду (тривалість анімації)
    setTimeout(() => {
      setFloatingNumbers((current) => current.filter((num) => num.id !== newNumber.id));
    }, 1000);
  };
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
       <TapButton isTapped={isTapped} 
          onClick={handleTapWithAnimation}  />

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