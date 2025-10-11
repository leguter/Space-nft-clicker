// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import styles from "./BoostersPage.module.css";

export default function BoostersPage() {
  return (
    <div className={styles.Container}>
      <div className={styles.Card}>
        <h2 className={styles.Title}>Boosters</h2>
        <p className={styles.Subtitle}>Activate boosts to multiply your earnings.</p>

        <div className={styles.Boosters}>
          <div className={styles.BoosterItem}>
            <h3>x2 Speed</h3>
            <p>Double your earning rate for 1 hour.</p>
            <motion.button whileTap={{ scale: 0.9 }} className={styles.BtnBuy}>
              BUY — 50⭐
            </motion.button>
          </div>
          <div className={styles.BoosterItem}>
            <h3>Auto Clicker</h3>
            <p>Earn automatically for 30 mins.</p>
            <motion.button whileTap={{ scale: 0.9 }} className={styles.BtnBuy}>
              BUY — 120⭐
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
