// import { useState } from "react";
// import { Outlet, NavLink } from "react-router-dom"; // Використовуємо NavLink для активних стилів
// import styles from "../../App.module.css";
// import { FaHome, FaGem, FaGift, FaBolt, FaUser } from "react-icons/fa";

// export default function MainLayout() {
//   // 1. Вся логіка тепер живе тут
//  const [balance, setBalance] = useState(1245678);
//   const [progress, setProgress] = useState(0.75); // 75% прогресу
//   const [isTapped, setIsTapped] = useState(false);
// const handleTap = () => {
//     // 1. Анімація
//     setIsTapped(true);
//     setTimeout(() => setIsTapped(false), 150);

//     // 2. Логіка (збільшення балансу, тощо)
//     setBalance((prevBalance) => prevBalance + 1);
//     // Тут ви б викликали функцію, передану через пропси
//     // onTap();
//   };
// //   const onTap = () => {
// //     setBalance((prevBalance) => prevBalance + 1);
// //     setTapCount((prevTapCount) => prevTapCount + 1);
// //   };

//   return (
//     <div className={styles.appContainer}>
//       <main className={styles.mainContent}>
//         {/* 2. Передаємо стан та функції дочірнім сторінкам через context */}
//         <Outlet context={{ balance, progress, isTapped, handleTap }} />
//       </main>

//       {/* 3. Наша навігація з NavLink замість button */}
//       <nav className={styles.bottomNav}>
//         <NavLink
//           to="/"
//           className={({ isActive }) =>
//             `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
//           }
//         >
//           <FaHome />
//           <span>Home</span>
//         </NavLink>
//         <NavLink
//           to="/earn"
//           className={({ isActive }) =>
//             `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
//           }
//         >
//           <FaGem />
//           <span>Earn</span>
//         </NavLink>
//         <NavLink
//           to="/raffles"
//           className={({ isActive }) =>
//             `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
//           }
//         >
//           <FaGift />
//           <span>Raffles</span>
//         </NavLink>
//         <NavLink
//           to="/boosters"
//           className={({ isActive }) =>
//             `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
//           }
//         >
//           <FaBolt />
//           <span>Boosters</span>
//         </NavLink>
//         <NavLink
//           to="/profile"
//           className={({ isActive }) =>
//             `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
//           }
//         >
//           <FaUser />
//           <span>Profile</span>
//         </NavLink>
//       </nav>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import styles from "../../App.module.css";
import { FaHome, FaGem, FaGift, FaBolt, FaUser } from "react-icons/fa";
import api from '../../utils/api'
export default function MainLayout() {
  const [balance, setBalance] = useState(0);
  const [progress, setProgress] = useState(0.75);
   const [tapPower, setTapPower] = useState(0.75);
  const [isTapped, setIsTapped] = useState(false);
  // 🧩 1. Отримуємо дані користувача при запуску
  useEffect(() => {
    const fetchUserData = async () => {
  try {
    const res = await api.get("/api/user/me", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
      }
    });

    // ✅ Axios автоматично перевіряє, чи успішний запит (статус 2xx)
    // ✅ Дані з відповіді знаходяться в `res.data`
    setBalance(res.data.balance); // отримуємо баланс з res.data
    setTapPower(res.data.tapPower);
    console.log(tapPower)

  } catch (err) {
    // ❌ Якщо сервер повертає помилку (4xx, 5xx), axios відхиляє проміс,
    // і виконання переходить у блок catch
    if (err.response) {
      // Помилка прийшла з відповіддю від сервера
      console.error("❌ Error loading user data:", err.response.data.message);
    } else {
      // Помилка мережі або інша проблема
      console.error("❌ Server error:", err.message);
    }
  }
};
    fetchUserData();
  }, []);

  // ⚡ 2. TAP — збільшуємо баланс через бекенд
  const handleTap = async () => {
    setIsTapped(true);

    try {
    // Для POST-запиту з axios:
    // 1-й аргумент: URL
    // 2-й аргумент: тіло запиту (data). Якщо тіла немає, передаємо порожній об'єкт {}
    // 3-й аргумент: конфігурація (включно з заголовками)
    const res = await api.post(
      "/api/user/tap",
      {}, // 👈 Порожнє тіло запиту
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
      }
    );

    // ✅ Дані вже розпарсені і знаходяться в res.data
    setBalance(res.data.newBalance);

  } catch (err) {
    // ❌ Axios автоматично "ловить" помилки з кодами 4xx/5xx
    const errorMessage = err.response ? err.response.data.message : err.message;
    console.error("❌ Tap error:", errorMessage);
  } finally {
    // 💡 Цей блок виконається завжди (і при успіху, і при помилці),
    // що гарантує скидання стану анімації.
    setTimeout(() => setIsTapped(false), 150);
  }
  };

  return (
    <div className={styles.appContainer}>
      <main className={styles.mainContent}>
        {/* 🔁 передаємо контекст усім сторінкам */}
        <Outlet context={{ balance, progress, isTapped, handleTap, tapPower}} />
      </main>

      {/* 🔽 нижня навігація */}
      <nav className={styles.bottomNav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
          }
        >
          <FaHome />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/earn"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
          }
        >
          <FaGem />
          <span>Earn</span>
        </NavLink>
        <NavLink
          to="/raffles"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
          }
        >
          <FaGift />
          <span>Raffles</span>
        </NavLink>
        <NavLink
          to="/boosters"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
          }
        >
          <FaBolt />
          <span>Boosters</span>
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
          }
        >
          <FaUser />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
}
