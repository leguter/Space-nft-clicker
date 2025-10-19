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
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import styles from "./BoostersPage.module.css";
import api from "../../utils/api";

export default function BoostersPage() {
  // 🔹 Ціни у зірках (людські значення)
  const boosters = [
    { id: "speed", name: "x2 Speed", desc: "Double your earning rate for 1 hour.", price: 15 },
    { id: "auto_clicker", name: "Auto Clicker", desc: "Earn automatically for 30 mins.", price: 40 },
  ];

  const handleBuy = async (boosterId) => {
    try {
      const response = await api.post("/api/user/create_invoice", {
        booster: boosterId,
      });

      const { invoice_link } = response.data;
      if (invoice_link) {
        // 🔹 Відкриваємо вікно Telegram Stars оплати
        window.Telegram.WebApp.openInvoice(invoice_link, (status) => {
          console.log("Payment status:", status);
        });
      } else {
        alert("Failed to get invoice link");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Error creating payment");
    }
  };

  return (
    <div className={styles.Container}>
      <div className={styles.Card}>
        <h2 className={styles.Title}>Boosters</h2>
        <p className={styles.Subtitle}>Activate boosts to multiply your earnings.</p>

        <div className={styles.Boosters}>
          {boosters.map((booster) => (
            <div key={booster.id} className={styles.BoosterItem}>
              <h3>{booster.name}</h3>
              <p>{booster.desc}</p>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={styles.BtnBuy}
                onClick={() => handleBuy(booster.id)}
              >
                BUY — {booster.price}⭐
              </motion.button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
