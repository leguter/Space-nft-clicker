// import { useState } from "react";
// import HomePage from "./pages/HomePage/HomePage";
// import EarnPage from "./pages/EarnPage/EarnPage";
// import RafflesPage from "./pages/RafflesPage/RafflesPage";
// import BoostersPage from "./pages/BoostersPage/BoostersPage";
// import ProfilePage from "./pages/ProfilePage/ProfilePage";
// import "./App.css";
// export default function App() {
//   const [page, setPage] = useState("home");
//   const [balance, setBalance] = useState(0);
//   const [tapCount, setTapCount] = useState(0);

//   const onTap = () => {
//     setBalance((b) => b + 1);
//     setTapCount((t) => t + 1);
//   };

//   const renderPage = () => {
//     switch (page) {
//       case "home":
//         return <HomePage balance={balance} onTap={onTap} tapCount={tapCount} />;
//       case "earn":
//         return <EarnPage />;
//       case "raffles":
//         return <RafflesPage />;
//       case "boosters":
//         return <BoostersPage />;
//       case "profile":
//         return <ProfilePage balance={balance} />;
//       default:
//         return <HomePage />;
//     }
//   };

//   return (
//     <div className="parent-container">
//       <div className="your-content">
//       <div className="p-4 flex-1">{renderPage()}</div>

//       <div className="menu">
//         <button onClick={() => setPage("home")}>🏠</button>
//         <button onClick={() => setPage("earn")}>💎</button>
//         <button onClick={() => setPage("raffles")}>🎁</button>
//         <button onClick={() => setPage("boosters")}>⚡</button>
//         <button onClick={() => setPage("profile")}>👤</button>
//       </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
// Імпортуємо ваші сторінки
import HomePage from "./pages/HomePage/HomePage";
import EarnPage from "./pages/EarnPage/EarnPage";
import RafflesPage from "./pages/RafflesPage/RafflesPage";
import BoostersPage from "./pages/BoostersPage/BoostersPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../src/components/MainLayout/MainLayout"; // Наш новий контейнер
import { useEffect } from "react";
// import { Routes, Route } from 'react-router-dom';
// Імпортуємо стилі для App та навігації
// import styles from "./App.module.css";
// Імпортуємо іконки
// import { FaHome, FaGem, FaGift, FaBolt, FaUser } from "react-icons/fa";

// export default function App() {
//   // 1. Повертаємо стейти для балансу та кліків з вашого першого файлу
//   const [balance, setBalance] = useState(0);
//   const [tapCount, setTapCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState("home");

//   // 2. Повертаємо логіку для оновлення балансу при кліку
//   const onTap = () => {
//     setBalance((prevBalance) => prevBalance + 1);
//     setTapCount((prevTapCount) => prevTapCount + 1);
//   };

//   // 3. Оновлюємо рендер сторінок, передаючи необхідні пропси
//   const renderPage = () => {
//     switch (currentPage) {
//       case "home":
//         // Передаємо всі необхідні дані в HomePage
//         return <HomePage balance={balance} onTap={onTap} tapCount={tapCount}  />;
//       case "earn":
//         return <EarnPage />;
//       case "raffles":
//         return <RafflesPage />;
//       case "boosters":
//         return <BoostersPage />;
//       case "profile":
//         // Передаємо баланс в ProfilePage
//         return <ProfilePage balance={balance} />;
//       default:
//         return <HomePage balance={balance} onTap={onTap} tapCount={tapCount} />;
//     }
//   };

//   return (
    
//     // Використовуємо контейнер зі стилями CSS Modules
//     <div className={styles.appContainer}>
       
//       {/* Рендеримо активну сторінку */}
//       <main className={styles.mainContent}>{renderPage()}</main>

//       {/* Ваша красива навігація */}
//       <nav className={styles.bottomNav}>
//         <button
//           className={`${styles.navItem} ${
//             currentPage === "home" ? styles.navItemActive : ""
//           }`}
//           onClick={() => setCurrentPage("home")}
//         >
//           <FaHome />
//           <span>Home</span>
//         </button>
//         <button
//           className={`${styles.navItem} ${
//             currentPage === "earn" ? styles.navItemActive : ""
//           }`}
//           onClick={() => setCurrentPage("earn")}
//         >
//           <FaGem />
//           <span>Earn</span>
//         </button>
//         <button
//           className={`${styles.navItem} ${
//             currentPage === "raffles" ? styles.navItemActive : ""
//           }`}
//           onClick={() => setCurrentPage("raffles")}
//         >
//           <FaGift />
//           <span>Raffles</span>
//         </button>
//         <button
//           className={`${styles.navItem} ${
//             currentPage === "boosters" ? styles.navItemActive : ""
//           }`}
//           onClick={() => setCurrentPage("boosters")}
//         >
//           <FaBolt />
//           <span>Boosters</span>
//         </button>
//         <button
//           className={`${styles.navItem} ${
//             currentPage === "profile" ? styles.navItemActive : ""
//           }`}
//           onClick={() => setCurrentPage("profile")}
//         >
//           <FaUser />
//           <span>Profile</span>
//         </button>
//       </nav>
//     </div>
//   );
// }
export default function App() {
   const [userData, setUserData] = useState(null);
// let userData = null;
 useEffect(() => {
        // Хук, який виконується один раз після того, як компонент з'явився на екрані

        const tg = window.Telegram.WebApp;

        const authenticate = async () => {
            try {
                // Повідомляємо Telegram, що додаток готовий
                tg.ready();

                if (!tg.initData) {
                    console.error("Не знайдено initData. Додаток запущено не через Telegram?");
                    
                    // Для дебагу у браузері, показуємо повідомлення прямо на екрані
                    const debugOutput = document.getElementById('debug-output');
                    if (debugOutput) {
                        debugOutput.textContent = 'Запустіть додаток через клієнт Telegram для автентифікації.';
                    }
                    return; // Важливо: виходимо з функції, якщо даних немає 
                }

                console.log("Відправляємо initData на бекенд:", tg.initData);

                const response = await fetch('https://back-space-clicker.onrender.com/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ initData: tg.initData }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Помилка автентифікації');
                }

                const userData = await response.json();
                console.log("✅ Успішна відповідь від бекенду:", userData);
                localStorage.setItem('authToken', userData.token);
                 setUserData(userData)
                // Виводимо дані на екран для дебагу
                const debugOutput = document.getElementById('debug-output');
                if (debugOutput) {
                    debugOutput.textContent = JSON.stringify(userData, null, 2);
                }

            } catch (error) {
                console.error("❌ Сталася помилка під час автентифікації:", error);
                const debugOutput = document.getElementById('debug-output');
                if (debugOutput) {
                    debugOutput.textContent = `Помилка: ${error.message}`;
                }
            }
        };

        authenticate();

    }, []); // Пустий масив залежностей означає, що код виконається 1 раз

  return (
    <Routes>
      {/* Всі сторінки тепер знаходяться всередині MainLayout */}
      <Route path="/" element={<MainLayout />}>
        {/* "index" означає, що це сторінка за замовчуванням для "/" */}
        <Route index element={<HomePage />} />
        <Route path="earn" element={<EarnPage />} />
        <Route path="raffles" element={<RafflesPage />} />
        <Route path="boosters" element={<BoostersPage />} />
        <Route path="profile" element={<ProfilePage user={userData} />} />
      </Route>
    </Routes>
  );
}