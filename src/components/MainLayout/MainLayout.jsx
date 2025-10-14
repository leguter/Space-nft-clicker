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

export default function MainLayout() {
  const [balance, setBalance] = useState(0);
  const [progress, setProgress] = useState(0.75);
  const [isTapped, setIsTapped] = useState(false);

  // 🧩 1. Отримуємо дані користувача при запуску
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("https://back-space-clicker-1.onrender.com/api/user/me", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          }
        });
        const data = await res.json();

        if (res.ok) {
          setBalance(data.balance); // отримуємо баланс з бази
        } else {
          console.error("❌ Error loading user data:", data.message);
        }
      } catch (err) {
        console.error("❌ Server error:", err);
      }
    };

    fetchUserData();
  }, []);

  // ⚡ 2. TAP — збільшуємо баланс через бекенд
  const handleTap = async () => {
    setIsTapped(true);

    try {
      const res = await fetch("https://back-space-clicker-1.onrender.com/api/user/tap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setBalance(data.newBalance);
      } else {
        console.error("❌ Tap error:", data.message);
      }
    } catch (err) {
      console.error("❌ Server error:", err);
    }

    setTimeout(() => setIsTapped(false), 150);
  };

  return (
    <div className={styles.appContainer}>
      <main className={styles.mainContent}>
        {/* 🔁 передаємо контекст усім сторінкам */}
        <Outlet context={{ balance, progress, isTapped, handleTap }} />
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
