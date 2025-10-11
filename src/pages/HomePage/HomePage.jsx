// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import styles from "./HomePage.module.css";

export default function HomePage({ balance = 1232, onTap, tapCount = 0 }) {
  return (
    <div className={styles.Container}>
      <div className={styles.Card}>
        <h2 className={styles.Title}>Dashboard</h2>

        <div className={styles.ProfileWrapper}>
          <div className={styles.Avatar}></div>
          <div className={styles.BalanceBlock}>
            <p className={styles.BalanceLabel}>Balance</p>
            <p className={styles.BalanceValue}>{balance.toLocaleString()}</p>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onTap}
          className={styles.BtnTap}
        >
          TAP TO EARN
        </motion.button>

        <p className={styles.ProgressLabel}>DAILY PROGRESS</p>

        <motion.button whileTap={{ scale: 0.95 }} className={styles.BtnBonus}>
          CLAIM DAILY BONUS
        </motion.button>
      </div>
    </div>
  );
}
