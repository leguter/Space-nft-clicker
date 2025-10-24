// // import { useState } from "react";
// // import HomePage from "./pages/HomePage/HomePage";
// // import EarnPage from "./pages/EarnPage/EarnPage";
// // import RafflesPage from "./pages/RafflesPage/RafflesPage";
// // import BoostersPage from "./pages/BoostersPage/BoostersPage";
// // import ProfilePage from "./pages/ProfilePage/ProfilePage";
// // import "./App.css";
// // export default function App() {
// //   const [page, setPage] = useState("home");
// //   const [balance, setBalance] = useState(0);
// //   const [tapCount, setTapCount] = useState(0);

// //   const onTap = () => {
// //     setBalance((b) => b + 1);
// //     setTapCount((t) => t + 1);
// //   };

// //   const renderPage = () => {
// //     switch (page) {
// //       case "home":
// //         return <HomePage balance={balance} onTap={onTap} tapCount={tapCount} />;
// //       case "earn":
// //         return <EarnPage />;
// //       case "raffles":
// //         return <RafflesPage />;
// //       case "boosters":
// //         return <BoostersPage />;
// //       case "profile":
// //         return <ProfilePage balance={balance} />;
// //       default:
// //         return <HomePage />;
// //     }
// //   };

// //   return (
// //     <div className="parent-container">
// //       <div className="your-content">
// //       <div className="p-4 flex-1">{renderPage()}</div>

// //       <div className="menu">
// //         <button onClick={() => setPage("home")}>🏠</button>
// //         <button onClick={() => setPage("earn")}>💎</button>
// //         <button onClick={() => setPage("raffles")}>🎁</button>
// //         <button onClick={() => setPage("boosters")}>⚡</button>
// //         <button onClick={() => setPage("profile")}>👤</button>
// //       </div>
// //       </div>
// //     </div>
// //   );
// // }
// import { useState } from "react";
// // Імпортуємо ваші сторінки
// import HomePage from "./pages/HomePage/HomePage";
// import EarnPage from "./pages/EarnPage/EarnPage";
// import RafflesPage from "./pages/RafflesPage/RafflesPage";
// import BoostersPage from "./pages/BoostersPage/BoostersPage";
// import ProfilePage from "./pages/ProfilePage/ProfilePage";
// import { Routes, Route } from "react-router-dom";
// import MainLayout from "../src/components/MainLayout/MainLayout"; // Наш новий контейнер
// import { useEffect } from "react";
// // import { Routes, Route } from 'react-router-dom';
// // Імпортуємо стилі для App та навігації
// // import styles from "./App.module.css";
// // Імпортуємо іконки
// // import { FaHome, FaGem, FaGift, FaBolt, FaUser } from "react-icons/fa";

// // export default function App() {
// //   // 1. Повертаємо стейти для балансу та кліків з вашого першого файлу
// //   const [balance, setBalance] = useState(0);
// //   const [tapCount, setTapCount] = useState(0);
// //   const [currentPage, setCurrentPage] = useState("home");

// //   // 2. Повертаємо логіку для оновлення балансу при кліку
// //   const onTap = () => {
// //     setBalance((prevBalance) => prevBalance + 1);
// //     setTapCount((prevTapCount) => prevTapCount + 1);
// //   };

// //   // 3. Оновлюємо рендер сторінок, передаючи необхідні пропси
// //   const renderPage = () => {
// //     switch (currentPage) {
// //       case "home":
// //         // Передаємо всі необхідні дані в HomePage
// //         return <HomePage balance={balance} onTap={onTap} tapCount={tapCount}  />;
// //       case "earn":
// //         return <EarnPage />;
// //       case "raffles":
// //         return <RafflesPage />;
// //       case "boosters":
// //         return <BoostersPage />;
// //       case "profile":
// //         // Передаємо баланс в ProfilePage
// //         return <ProfilePage balance={balance} />;
// //       default:
// //         return <HomePage balance={balance} onTap={onTap} tapCount={tapCount} />;
// //     }
// //   };

// //   return (
    
// //     // Використовуємо контейнер зі стилями CSS Modules
// //     <div className={styles.appContainer}>
       
// //       {/* Рендеримо активну сторінку */}
// //       <main className={styles.mainContent}>{renderPage()}</main>

// //       {/* Ваша красива навігація */}
// //       <nav className={styles.bottomNav}>
// //         <button
// //           className={`${styles.navItem} ${
// //             currentPage === "home" ? styles.navItemActive : ""
// //           }`}
// //           onClick={() => setCurrentPage("home")}
// //         >
// //           <FaHome />
// //           <span>Home</span>
// //         </button>
// //         <button
// //           className={`${styles.navItem} ${
// //             currentPage === "earn" ? styles.navItemActive : ""
// //           }`}
// //           onClick={() => setCurrentPage("earn")}
// //         >
// //           <FaGem />
// //           <span>Earn</span>
// //         </button>
// //         <button
// //           className={`${styles.navItem} ${
// //             currentPage === "raffles" ? styles.navItemActive : ""
// //           }`}
// //           onClick={() => setCurrentPage("raffles")}
// //         >
// //           <FaGift />
// //           <span>Raffles</span>
// //         </button>
// //         <button
// //           className={`${styles.navItem} ${
// //             currentPage === "boosters" ? styles.navItemActive : ""
// //           }`}
// //           onClick={() => setCurrentPage("boosters")}
// //         >
// //           <FaBolt />
// //           <span>Boosters</span>
// //         </button>
// //         <button
// //           className={`${styles.navItem} ${
// //             currentPage === "profile" ? styles.navItemActive : ""
// //           }`}
// //           onClick={() => setCurrentPage("profile")}
// //         >
// //           <FaUser />
// //           <span>Profile</span>
// //         </button>
// //       </nav>
// //     </div>
// //   );
// // }
// import api from './utils/api'
// import RaffleDetail from "./pages/RaffleDetail/RaffleDetail";
// // import WheelPage from "./pages/WheelPage/WheelPage";
// import HorizontalWheel from "./pages/HorizontalWheel/HorizontalWheel";
// import { ToastContainer } from 'react-toastify';
// export default function App() {
//    const [userData, setUserData] = useState(null);
// // let userData = null;
// useEffect(() => {
//     // Функція для реєстрації
//     const registerReferral = async (referrerId) => {
//       try {
//         // Викликаємо ваш бекенд-ендпоінт
//         await api.post('/api/user/referral/register', { referrerId });
//         console.log('Referral registered successfully!');
//       } catch (err) {
//         // Ми не показуємо помилку користувачу (B),
//         // тому що "ви не можете запросити самі себе" або "вже зареєстровані"
//         // не є критичними помилками для нього.
//         console.warn('Referral registration failed (this is often OK):', err.response?.data?.message);
//       }
//     };

//     // Перевіряємо, чи є start_param
//     const startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param;

//     if (startParam) {
//       // Якщо параметр є, викликаємо реєстрацію
//       registerReferral(startParam);
//     }
//   }, []);
// useEffect(() => {
//   const tg = window.Telegram.WebApp;
//   tg.ready();

//   const waitForInitData = async () => {
//     // Очікуємо, поки Telegram передасть initData
//     let attempts = 0;
//     while (!tg.initData && attempts < 10) {
//       await new Promise(res => setTimeout(res, 300)); // чекати 0.3 сек
//       attempts++;
//     }

//     if (!tg.initData) {
//       console.error("❌ Не знайдено initData навіть після очікування");
//       setUserData({ error: true });
//       return;
//     }

//     try {
//     console.log("📤 Відправляємо initData:", tg.initData);

//     // axios.post приймає URL, потім тіло запиту (data), а потім конфігурацію
//     const res = await api.post(
//       "/api/auth",
//       { initData: tg.initData } // 👈 Тіло запиту передається як об'єкт
//     );

//     // ✅ Дані вже в res.data, перевірка res.ok не потрібна
//     console.log("✅ Отримано userData:", res.data);
//     localStorage.setItem("authToken", res.data.token);
//     setUserData(res.data);

//   } catch (err) {
//     // ❌ Axios автоматично переходить сюди при помилці (статус не 2xx)
//     const errorMessage = err.response ? err.response.data.message : "Помилка автентифікації";
//     console.error("❌ Помилка під час авторизації:", errorMessage);
//     setUserData({ error: true });
//   }
// };

//   waitForInitData();
// }, []); // Пустий масив залежностей означає, що код виконається 1 раз
// if (userData === null) {
//   return <div>Завантаження...</div>;
// }

// if (userData?.error) {
//   return <div>Запустіть додаток через Telegram для авторизації</div>;
// }
//   return (
//     <div>
//     <Routes>
//       {/* Всі сторінки тепер знаходяться всередині MainLayout */}
//       <Route path="/" element={<MainLayout />}>
//         {/* "index" означає, що це сторінка за замовчуванням для "/" */}
//         <Route index element={<HomePage />} />
//         <Route path="earn" element={<EarnPage />} />
//         <Route path="raffles" element={<RafflesPage user={userData} />} />
//         <Route path="raffles/:id" element={<RaffleDetail />} />
//         <Route path="boosters" element={<BoostersPage />} />
//         <Route path="profile" element={<ProfilePage user={userData} />} />
//         <Route path="/wheel" element={<HorizontalWheel />} />
//       </Route>
//     </Routes>
//     <ToastContainer
//         theme="dark"
//         position="bottom-right"
//         autoClose={3000}
//       />
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Додайте, якщо ще не додали

// Імпортуємо ваші сторінки
import HomePage from "./pages/HomePage/HomePage";
import EarnPage from "./pages/EarnPage/EarnPage";
import RafflesPage from "./pages/RafflesPage/RafflesPage";
import RaffleDetail from "./pages/RaffleDetail/RaffleDetail";
import BoostersPage from "./pages/BoostersPage/BoostersPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import HorizontalWheel from "./pages/HorizontalWheel/HorizontalWheel";
import MainLayout from "../src/components/MainLayout/MainLayout";
import api from './utils/api';

export default function App() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    // Функція для реєстрації реферала
    const registerReferral = async (referrerId) => {
      try {
        // Цей запит тепер буде мати правильний 'authToken'
        await api.post('/api/user/referral/register', { referrerId });
        console.log('✅ Referral registered successfully!');
      } catch (err) {
        console.warn('Referral registration failed (this is often OK):', err.response?.data?.message);
      }
    };

    const waitForInitData = async () => {
      let attempts = 0;
      while (!tg.initData && attempts < 10) {
        await new Promise(res => setTimeout(res, 300));
        attempts++;
      }

      if (!tg.initData) {
        console.error("❌ Не знайдено initData навіть після очікування");
        setUserData({ error: true });
        return;
      }

      try {
        console.log("📤 Відправляємо initData:", tg.initData);

        // 1. АВТЕНТИФІКАЦІЯ
        const res = await api.post(
          "/api/auth",
          { initData: tg.initData }
        );
        
        console.log("✅ Отримано userData:", res.data);
        localStorage.setItem("authToken", res.data.token);
        // Важливо: переконайтеся, що ваш 'api' wrapper автоматично підхоплює
        // 'authToken' з localStorage для всіх наступних запитів.
        
        // 2. ❗️ РЕЄСТРАЦІЯ РЕФЕРАЛА (ТІЛЬКИ ПІСЛЯ АВТЕНТИФІКАЦІЇ)
        const startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param;

        // --- ❗️ ДОДАНО ДІАГНОСТИЧНИЙ ЛОГ ❗️ ---
        // Цей лог покаже, чи отримав додаток ID реферера
        console.log('Перевірка start_param (ID реферера):', startParam || 'НЕ ЗНАЙДЕНО');
        // --- Кінець діагностики ---

        if (startParam) {
          await registerReferral(startParam);
        }

        // 3. ВСТАНОВЛЕННЯ ДАНИХ
        setUserData(res.data);

      } catch (err) {
        const errorMessage = err.response ? err.response.data.message : "Помилка автентифікації";
        console.error("❌ Помилка під час авторизації:", errorMessage);
        setUserData({ error: true });
      }
    };

    waitForInitData();
  }, []); // Пустий масив гарантує, що це виконається один раз

  if (userData === null) {
    return <div>Завантаження...</div>; // Або ваш компонент завантажувача
  }

  if (userData?.error) {
    return <div>Запустіть додаток через Telegram для авторизації</div>;
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="earn" element={<EarnPage />} />
          <Route path="raffles" element={<RafflesPage user={userData} />} />
          <Route path="raffles/:id" element={<RaffleDetail />} />
          <Route path="boosters" element={<BoostersPage />} />
          {/* Передаємо userData в ProfilePage */}
          <Route path="profile" element={<ProfilePage user={userData} />} />
          <Route path="/wheel" element={<HorizontalWheel />} />
        </Route>
      </Routes>
      <ToastContainer
        theme="dark"
        position="bottom-right"
        autoClose={3000}
      />
    </div>
  );
}