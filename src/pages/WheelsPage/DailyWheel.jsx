import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../utils/api";
import styles from "./WheelsPage.module.css";

export default function DailyWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [canSpin, setCanSpin] = useState(false);
  const [nextSpinTime, setNextSpinTime] = useState(null);

  // Отримати інформацію про останній спін
  useEffect(() => {
    async function fetchDaily() {
      try {
        const res = await api.get("/daily/status");
        setCanSpin(res.data.can_spin);
        setNextSpinTime(res.data.next_spin_time);
      } catch (err) {
        console.error("Error fetching daily status", err);
      }
    }
    fetchDaily();
  }, []);

  async function spinWheel() {
    if (!canSpin || isSpinning) return;
    setIsSpinning(true);

    try {
      const res = await api.post("/wheel/spin/daily");
      setResult(res.data.reward);
      setCanSpin(false);
      setNextSpinTime(res.data.next_spin_time);
    } catch (err) {
      console.error("Daily spin failed", err);
    }

    setTimeout(() => setIsSpinning(false), 4000);
  }

  return (
    <div className={styles.Container}>
      <h2 className={styles.Title}>⏰ Daily Wheel</h2>
      <p className={styles.Subtitle}>
        {canSpin
          ? "Можна крутити зараз!"
          : nextSpinTime
          ? `Наступний спін: ${new Date(nextSpinTime).toLocaleString()}`
          : "Завантаження..."}
      </p>

      <motion.div
        animate={isSpinning ? { rotate: 1440 } : { rotate: 0 }}
        transition={{ duration: 4, ease: "easeInOut" }}
        className={styles.Wheel}
      >
        💫
      </motion.div>

      <button
        className={styles.SpinButton}
        onClick={spinWheel}
        disabled={!canSpin || isSpinning}
      >
        {isSpinning ? "Spinning..." : "Spin Now"}
      </button>

      {result && (
        <div className={styles.ResultBox}>
          🎉 Твій виграш: <b>{result}</b>
        </div>
      )}
    </div>
  );
}
