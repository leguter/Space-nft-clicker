
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
import api from "../../utils/api";

export default function MainLayout() {
  const [balance, setBalance] = useState(0);
  const [tapPower, setTapPower] = useState(0);
  const [isTapped, setIsTapped] = useState(false);

  // Для прогресу
  const [clickCount, setClickCount] = useState(0);
  const [progress, setProgress] = useState(0); // 0 - 100%
  const clicksPerTicket = 1000; // потрібно 1000 кліків для квитка
  const [ticketReady, setTicketReady] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get("/api/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const clicks = res.data.clickCount;
        setBalance(res.data.balance);
        setTapPower(Number(res.data.tap_power));
        setClickCount(clicks || 0); // якщо бекенд зберігає
      } catch (err) {
        console.error("❌ Error loading user data:", err.message);
      }
    };
    fetchUserData();
  }, []);

  // Обновлюємо прогрес при зміні clickCount
  useEffect(() => {
    const newProgress = clickCount / clicksPerTicket;
    setProgress(newProgress > 1 ? 1 : newProgress);
    setTicketReady(clickCount >= clicksPerTicket);
  }, [clickCount]);

  const handleTap = async () => {
    setIsTapped(true);
    try {
      const res = await api.post(
        "/api/user/tap",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setBalance(res.data.newBalance);

      // Лічимо кліки для прогресу
      const newClickCount = clickCount + 1;
      setClickCount(newClickCount);

      // Якщо бекенд підтримує, можна синхронізувати clickCount:
      await api.post(
        "/api/user/update-clicks",
        { clickCount: newClickCount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
    } catch (err) {
      console.error("❌ Tap error:", err.message);
    } finally {
      setTimeout(() => setIsTapped(false), 150);
    }
  };

  const claimTicket = async () => {
    try {
      await api.post(
        "/api/user/claim-ticket",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      // Скидаємо прогрес
      setClickCount(0);
      setProgress(0);
      setTicketReady(false);
    } catch (err) {
      console.error("❌ Claim ticket error:", err.message);
    }
  };

  return (
    <div className={styles.appContainer}>
      <main className={styles.mainContent}>
        <Outlet context={{ balance, tapPower, isTapped, handleTap, progress, ticketReady, claimTicket }} />
      </main>

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

