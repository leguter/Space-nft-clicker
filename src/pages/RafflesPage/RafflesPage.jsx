// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import styles from "./RafflesPage.module.css";

export default function RafflesPage() {
  return (
    <div className={styles.Container}>
      <div className={styles.Card}>
        <h2 className={styles.Title}>NFT Raffles</h2>
        <p className={styles.Subtitle}>Join raffles and win exclusive NFT rewards!</p>

        <div className={styles.RaffleList}>
          <div className={styles.RaffleItem}>
            <h3>Rare Crypto Cat 🐱</h3>
            <p>Entry cost: 25⭐</p>
            <motion.button whileTap={{ scale: 0.9 }} className={styles.BtnJoin}>
              JOIN
            </motion.button>
          </div>
          <div className={styles.RaffleItem}>
            <h3>Legendary Hamster 🐹</h3>
            <p>Entry cost: 100⭐</p>
            <motion.button whileTap={{ scale: 0.9 }} className={styles.BtnJoin}>
              JOIN
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
