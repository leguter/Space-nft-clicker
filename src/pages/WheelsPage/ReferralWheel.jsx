import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../utils/api";
import styles from "./WheelsPage.module.css";

export default function ReferralWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [canSpin, setCanSpin] = useState(false);
  const [referralsLeft, setReferralsLeft] = useState(0);

  // Отримати кількість доступних реферальних спінів
  useEffect(() => {
    async function fetchReferrals() {
      try {
        const res = await api.get("/referral/spins");
        setReferralsLeft(res.data.spins_left);
        setCanSpin(res.data.spins_left > 0);
      } catch (err) {
        console.error("Error fetching referral spins", err);
      }
    }
    fetchReferrals();
  }, []);

  async function spinWheel() {
    if (!canSpin || isSpinning) return;
    setIsSpinning(true);

    try {
      const res = await api.post("/wheel/spin/referral");
      setResult(res.data.reward);
      setReferralsLeft((r) => Math.max(0, r - 1));
      setCanSpin(false);
    } catch (err) {
      console.error("Referral spin failed", err);
    }

    setTimeout(() => setIsSpinning(false), 4000);
  }

  return (
    <div className={styles.Container}>
      <h2 className={styles.Title}>👥 Referral Wheel</h2>
      <p className={styles.Subtitle}>
        {referralsLeft > 0
          ? `Доступно ${referralsLeft} спін(ів)`
          : "Немає доступних спінів 😢"}
      </p>

      <motion.div
        animate={isSpinning ? { rotate: 1440 } : { rotate: 0 }}
        transition={{ duration: 4, ease: "easeInOut" }}
        className={styles.Wheel}
      >
        🎁
      </motion.div>

      <button
        className={styles.SpinButton}
        onClick={spinWheel}
        disabled={!canSpin || isSpinning}
      >
        {isSpinning ? "Spinning..." : "Spin for Free"}
      </button>

      {result && (
        <div className={styles.ResultBox}>
          🎉 Твій виграш: <b>{result}</b>
        </div>
      )}
    </div>
  );
}
