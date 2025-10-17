// // eslint-disable-next-line no-unused-vars
// import { motion } from "framer-motion";
// import styles from "./BoostersPage.module.css";

// export default function BoostersPage() {
//   return (
//     <div className={styles.Container}>
//       <div className={styles.Card}>
//         <h2 className={styles.Title}>Boosters</h2>
//         <p className={styles.Subtitle}>Activate boosts to multiply your earnings.</p>

//         <div className={styles.Boosters}>
//           <div className={styles.BoosterItem}>
//             <h3>x2 Speed</h3>
//             <p>Double your earning rate for 1 hour.</p>
//             <motion.button whileTap={{ scale: 0.9 }} className={styles.BtnBuy}>
//               BUY — 50⭐
//             </motion.button>
//           </div>
//           <div className={styles.BoosterItem}>
//             <h3>Auto Clicker</h3>
//             <p>Earn automatically for 30 mins.</p>
//             <motion.button whileTap={{ scale: 0.9 }} className={styles.BtnBuy}>
//               BUY — 120⭐
//             </motion.button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import styles from "./BoostersPage.module.css";
import api from "../../utils/api";

export default function BoostersPage() {
  const tg = window.Telegram?.WebApp;

  const handleBuy = async (boosterType) => {
    if (!tg) {
      alert("❌ Telegram WebApp API недоступне");
      return;
    }

    try {
      // 1️⃣ Надсилаємо запит на бекенд, щоб створити інвойс
      const res = await api.post("/api/user/create_invoice", {
        booster: boosterType, // наприклад: "speed" або "auto_clicker"
      });

      const { invoice_link } = res.data;
      if (!invoice_link) throw new Error("Invoice link не отримано з сервера");

      // 2️⃣ Відкриваємо Telegram Stars оплату
      tg.openInvoice(invoice_link, (status) => {
        if (status === "paid") {
          tg.showAlert("✅ Оплата пройшла успішно! Бустер активовано 💫");
          // 🔹 Можна зробити POST /activate_booster
          // axios.post("https://YOUR_BACKEND_URL/activate_booster", { booster: boosterType });
        } else if (status === "failed") {
          tg.showAlert("❌ Оплата не вдалася!");
        } else if (status === "cancelled") {
          tg.showAlert("🚫 Оплату скасовано.");
        }
      });
    } catch (error) {
      console.error(error);
      tg?.showAlert("⚠️ Помилка при створенні інвойсу");
    }
  };

  return (
    <div className={styles.Container}>
      <div className={styles.Card}>
        <h2 className={styles.Title}>Boosters</h2>
        <p className={styles.Subtitle}>Activate boosts to multiply your earnings.</p>

        <div className={styles.Boosters}>
          <div className={styles.BoosterItem}>
            <h3>x2 Speed</h3>
            <p>Double your earning rate for 1 hour.</p>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={styles.BtnBuy}
              onClick={() => handleBuy("speed")}
            >
              BUY — 50⭐
            </motion.button>
          </div>

          <div className={styles.BoosterItem}>
            <h3>Auto Clicker</h3>
            <p>Earn automatically for 30 mins.</p>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={styles.BtnBuy}
              onClick={() => handleBuy("auto_clicker")}
            >
              BUY — 120⭐
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

