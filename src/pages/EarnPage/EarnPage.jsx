// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import styles from "./EarnPage.module.css";

export default function EarnPage({ onEarn }) {
  return (
    <div className={styles.Container}>
      <div className={styles.Card}>
        <h2 className={styles.Title}>Earn Rewards</h2>
        <p className={styles.Description}>
          Complete simple missions and get <span className={styles.Highlight}>Telegram Stars</span>.
        </p>

        <div className={styles.TaskList}>
          <div className={styles.TaskItem}>
            <p>Follow our Telegram Channel</p>
            <motion.button whileTap={{ scale: 0.9 }} className={styles.BtnClaim}>
              CLAIM
            </motion.button>
          </div>
          <div className={styles.TaskItem}>
            <p>Invite a Friend</p>
            <motion.button whileTap={{ scale: 0.9 }} className={styles.BtnClaim}>
              CLAIM
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
