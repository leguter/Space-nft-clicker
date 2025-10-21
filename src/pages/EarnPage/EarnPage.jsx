// // eslint-disable-next-line no-unused-vars
// import { motion } from "framer-motion";
// import styles from "./EarnPage.module.css";

// export default function EarnPage() {
//   return (
//     <div className={styles.Container}>
//       <div className={styles.card}>
//         <h2 className={styles.Title}>Earn Rewards</h2>
//         <p className={styles.Description}>
//           Complete simple missions and get <span className={styles.Highlight}>Telegram Stars</span>.
//         </p>

//         <div className={styles.TaskList}>
//           <div className={styles.TaskItem}>
//             <p>Follow our Telegram Channel</p>
//             <motion.button whileTap={{ scale: 0.9 }} className={styles.BtnClaim}>
//               CLAIM
//             </motion.button>
//           </div>
//           <div className={styles.TaskItem}>
//             <p>Invite a Friend</p>
//             <motion.button whileTap={{ scale: 0.9 }} className={styles.BtnClaim}>
//               CLAIM
//             </motion.button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// EarnPage.js
// EarnPage.js
import { useState, useEffect } from "react"; // 👈 Додайте useEffect
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import styles from "./EarnPage.module.css";
import api from "../../utils/api";
const TELEGRAM_CHANNEL_URL = "https://t.me/SpaceClicker";

export default function EarnPage() {
  const [isClaiming, setIsClaiming] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState(null);

  // ✨ КРОК 2: ДОДАЄМО useEffect ДЛЯ ПЕРЕВІРКИ СТАТУСУ ПРИ ЗАВАНТАЖЕННІ
  useEffect(() => {
    const fetchTaskStatus = async () => {
      try {
        const response = await api.get("/api/user/tasks");
        const { completedTasks } = response.data;
        
        // Перевіряємо, чи є наше завдання у списку виконаних
        if (completedTasks.includes("follow_telegram_channel")) {
          setIsCompleted(true);
        }
      } catch (err) {
        console.error("Failed to fetch task statuses:", err);
      }
    };

    fetchTaskStatus();
  }, []); // 👈 Порожній масив означає, що ефект виконається лише раз при монтуванні

const handleClaim = async () => {
  // 1️⃣ Відкриваємо канал у новій вкладці Telegram
  window.open(TELEGRAM_CHANNEL_URL, "_blank");

  // 2️⃣ Чекаємо кілька секунд, щоб користувач устиг підписатись
  setIsClaiming(true);
  setError(null);

  setTimeout(async () => {
    try {
      // 3️⃣ Перевіряємо підписку через бекенд
      const response = await api.post("/api/user/claim/subscription", {});
      console.log("Success:", response.data.message);
      setIsCompleted(true);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Something went wrong.";
      console.error("Claim error:", errorMessage);
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsClaiming(false);
    }
  }, 3000); // можна збільшити до 5 секунд, якщо потрібно
};

  const getButtonText = () => {
    if (isCompleted) return "COMPLETED";
    if (isClaiming) return "CHECKING...";
    if (error) return "TRY AGAIN";
    return "CLAIM";
  };

  return (
    <div className={styles.Container}>
      {/* ... ваша JSX розмітка залишається без змін ... */}
      <div className={styles.card}>
        <h2 className={styles.Title}>Earn Rewards</h2>
        <p className={styles.Description}>
          Complete simple missions and get awesome rewards!
        </p>

        <div className={styles.TaskList}>
          <div className={styles.TaskItem}>
            <div>
              <p>Follow our Telegram Channel</p>
              {error && <p className={styles.ErrorText}>{error}</p>}
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`${styles.BtnClaim} ${isCompleted ? styles.BtnCompleted : ''}`}
              onClick={handleClaim}
              disabled={isClaiming || isCompleted}
            >
              {getButtonText()}
            </motion.button>
          </div>
          <div className={styles.TaskItem}>
              <p>Try your luck</p>
              {error && <p className={styles.ErrorText}>{error}</p>}
          
            <Link to="/wheel">
           <motion.button
              whileTap={{ scale: 0.9 }}
              className={`${styles.BtnClaim}`}
              // onClick={1}
              disabled={isClaiming || isCompleted}
            >
              🎡 Wheel
            </motion.button>
            </Link>
          
</div>
        </div>
      </div>
    </div>
  );
}
