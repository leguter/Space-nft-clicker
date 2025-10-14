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
import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./EarnPage.module.css";
import api from "../../utils/api"; // Припустимо, у вас є налаштований екземпляр axios

export default function EarnPage() {
  const [isClaiming, setIsClaiming] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false); // Стан для виконаного завдання
  const [error, setError] = useState(null);

  // TODO: При завантаженні сторінки потрібно перевіряти,
  // чи це завдання вже було виконано раніше.
  // Це можна зробити, додавши відповідний роут на бекенд.

  const handleClaim = async () => {
    setIsClaiming(true);
    setError(null);
    try {
      // Робимо запит на наш новий ендпоінт
      const response = await api.post("/api/user/claim/subscription", {});
      
      console.log("Success:", response.data.message);
      setIsCompleted(true); // Позначаємо як виконане

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Something went wrong.";
      console.error("Claim error:", errorMessage);
      setError(errorMessage);
      // Можна показати помилку користувачу через 2-3 секунди
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsClaiming(false);
    }
  };

  const getButtonText = () => {
    if (isCompleted) return "COMPLETED";
    if (isClaiming) return "CHECKING...";
    if (error) return "TRY AGAIN";
    return "CLAIM";
  };

  return (
    <div className={styles.Container}>
      <div className={styles.card}>
        <h2 className={styles.Title}>Earn Rewards</h2>
        <p className={styles.Description}>
          Complete simple missions and get awesome rewards!
        </p>

        <div className={styles.TaskList}>
          <div className={styles.TaskItem}>
            <div>
              <p>Follow our Telegram Channel</p>
              {/* Показуємо помилку, якщо вона є */}
              {error && <p className={styles.ErrorText}>{error}</p>}
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`${styles.BtnClaim} ${isCompleted ? styles.BtnCompleted : ''}`}
              onClick={handleClaim}
              disabled={isClaiming || isCompleted} // Блокуємо кнопку
            >
              {getButtonText()}
            </motion.button>
          </div>
          {/* ... інші завдання ... */}
        </div>
      </div>
    </div>
  );
}
