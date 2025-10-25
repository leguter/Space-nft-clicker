
// import { useState, useEffect } from "react";
// import { Outlet, NavLink } from "react-router-dom";
// import styles from "../../App.module.css";
// import { FaHome, FaGem, FaGift, FaBolt, FaUser } from "react-icons/fa";
// import api from '../../utils/api'
// export default function MainLayout() {
//   const [balance, setBalance] = useState(0);
//   const [progress, setProgress] = useState(0.75);
//    const [tapPower, setTapPower] = useState(0.75);
//   const [isTapped, setIsTapped] = useState(false);
//   // 🧩 1. Отримуємо дані користувача при запуску
//   useEffect(() => {
//     const fetchUserData = async () => {
//   try {
//     const res = await api.get("/api/user/me", {
//       headers: {
//         "Authorization": `Bearer ${localStorage.getItem("authToken")}`
//       }
//     });
     
//     // ✅ Axios автоматично перевіряє, чи успішний запит (статус 2xx)
//     // ✅ Дані з відповіді знаходяться в `res.data`
//     setBalance(res.data.balance); // отримуємо баланс з res.data
//     setTapPower(Number(res.data.tap_power));
//     // console.log(tapPower)

//   } catch (err) {
//     // ❌ Якщо сервер повертає помилку (4xx, 5xx), axios відхиляє проміс,
//     // і виконання переходить у блок catch
//     if (err.response) {
//       // Помилка прийшла з відповіддю від сервера
//       console.error("❌ Error loading user data:", err.response.data.message);
//     } else {
//       // Помилка мережі або інша проблема
//       console.error("❌ Server error:", err.message);
//     }
//   }
// };
//     fetchUserData();
//   }, []);

//   useEffect(() => {
//   console.log("tapPower змінився:", tapPower);
// }, [tapPower]);


//   // ⚡ 2. TAP — збільшуємо баланс через бекенд
//   const handleTap = async () => {
//     setIsTapped(true);

//     try {
//     // Для POST-запиту з axios:
//     // 1-й аргумент: URL
//     // 2-й аргумент: тіло запиту (data). Якщо тіла немає, передаємо порожній об'єкт {}
//     // 3-й аргумент: конфігурація (включно з заголовками)
//     const res = await api.post(
//       "/api/user/tap",
//       {}, // 👈 Порожнє тіло запиту
//       {
//         headers: {
//           "Authorization": `Bearer ${localStorage.getItem("authToken")}`
//         }
//       }
//     );

//     // ✅ Дані вже розпарсені і знаходяться в res.data
//     setBalance(res.data.newBalance);

//   } catch (err) {
//     // ❌ Axios автоматично "ловить" помилки з кодами 4xx/5xx
//     const errorMessage = err.response ? err.response.data.message : err.message;
//     console.error("❌ Tap error:", errorMessage);
//   } finally {
//     // 💡 Цей блок виконається завжди (і при успіху, і при помилці),
//     // що гарантує скидання стану анімації.
//     setTimeout(() => setIsTapped(false), 150);
//   }
//   };

//   return (
//     <div className={styles.appContainer}>
//       <main className={styles.mainContent}>
//         {/* 🔁 передаємо контекст усім сторінкам */}
//         <Outlet context={{ balance, progress, isTapped, handleTap, tapPower}} />
//       </main>

//       {/* 🔽 нижня навігація */}
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
import api from '../../utils/api';

export default function MainLayout() {
  const [balance, setBalance] = useState(0);
  const [tapPower, setTapPower] = useState(1); // Починаємо з 1, поки не завантажилось
  const [progress, setProgress] = useState(0); // Стан для прогрес-бару
  const [isTapped, setIsTapped] = useState(false);
  const [referrals, setReferrals] = useState(0);
  const [internalStars, setInternalStars] = useState(0);

  // 1. Отримуємо дані користувача при запуску
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get("/api/user/me", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          }
        });
        
        // Встановлюємо всі дані з бекенду
        setBalance(res.data.balance || 0);
        setTapPower(Number(res.data.tap_power) || 1);
        setProgress(Number(res.data.click_progress) || 0); // 🟢 ВИПРАВЛЕНО: завантажуємо прогрес
        setReferrals(res.data.referrals || 0);
        setInternalStars(res.data.internal_stars || 0);

      } catch (err) {
        console.error("❌ Error loading user data:", err.response?.data?.message || err.message);
      }
    };
    fetchUserData();
  }, []); // Пустий масив - виконати 1 раз


  // 2. ⚡ TAP — один запит, який оновлює все
  const handleTap = async () => {
    setIsTapped(true);

    try {
      // Викликаємо ТІЛЬКИ /api/user/tap
      const res = await api.post(
        "/api/user/tap",
        {}, // Порожнє тіло запиту
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          }
        }
      );

      // Бекенд повертає нові дані, ми їх просто встановлюємо
      setBalance(res.data.newBalance);
      setProgress(res.data.progress); // 🟢 ВИПРАВЛЕНО: оновлюємо прогрес

    } catch (err) {
      const errorMessage = err.response ? err.response.data.message : err.message;
      console.error("❌ Tap error:", errorMessage);
    } finally {
      // Гарантує скидання анімації
      setTimeout(() => setIsTapped(false), 150);
    }
  };

  // 3. 🎟️ CLAIM — окрема функція для отримання квитка
  // (Твій старий код змішував 'tap' і 'claim', це виправлено)
  const claimTicket = async () => {
    try {
      // ❗️ ВАЖЛИВО: цей роут має існувати на бекенді
      // (Я бачу його у твоєму файлі - /api/user/claim-ticket)
      const res = await api.post(
        "/api/user/claim-ticket",
        {},
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          },
        }
      );
      
      // Після 'claim' бекенд повертає 'progress: 0'
      setProgress(res.data.progress); 
      // Тут можна також оновити кількість квитків, якщо потрібно
      
    } catch (err) {
      console.error("❌ Claim ticket error:", err.response?.data?.message || err.message);
    }
  };

  // Визначаємо, чи готова кнопка "Claim"
  const ticketReady = progress >= 1;

  return (
    <div className={styles.appContainer}>
      <main className={styles.mainContent}>
        {/* 🔁 передаємо оновлений контекст усім сторінкам */}
        <Outlet context={{ 
          balance, 
          tapPower, 
          isTapped, 
          handleTap, 
          progress, 
          ticketReady, // ⬅️ чи заповнений бар
          claimTicket, // ⬅️ функція для клейму
          referrals,
          internalStars
        }} />
      </main>

      {/* 🔽 нижня навігація (без змін) */}
      <nav className={styles.bottomNav}>
        <NavLink to="/" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ""}`}>
          <FaHome /><span>Home</span>
        </NavLink>
        <NavLink to="/earn" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ""}`}>
          <FaGem /><span>Earn</span>
        </NavLink>
        <NavLink to="/raffles" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ""}`}>
          <FaGift /><span>Raffles</span>
        </NavLink>
        <NavLink to="/boosters" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ""}`}>
          <FaBolt /><span>Boosters</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ""}`}>
          <FaUser /><span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
}
