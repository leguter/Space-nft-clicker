import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import styles from "./UniversalWheel.module.css";

export default function UniversalWheel({ mode = "paid" }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [balance, setBalance] = useState(0);
  const [canSpin, setCanSpin] = useState(true);
  const [availableSpins, setAvailableSpins] = useState(0);
  const [nextSpinTime, setNextSpinTime] = useState(null);

  const navigate = useNavigate();
  const segments = [
    { label: "🎟 Ticket", type: "raffle_ticket", image: "/images/ticket.png" },
    { label: "🌟 5 Stars", type: "stars", stars: 5, image: "/images/5stars.png" },
    { label: "🚀 Boost", type: "boost", image: "/images/boost.png" },
    { label: "🎁 NFT Box", type: "nft", image: "/images/nftbox.jpg", stars: 500 },
  ];
  const segmentWidth = 160;
  const totalSegments = segments.length;
  const wheelCycleLength = totalSegments * segmentWidth;
  const centeringOffset = segmentWidth / 2;

  const [offset, setOffset] = useState(0);
  const [transition, setTransition] = useState({ duration: 0, ease: "easeOut" });

  const spinCost = 10;

  // 🔹 Сегменти (однакові для всіх)


  // === 🧩 1. Ініціалізація за типом рулетки ===
  useEffect(() => {
    (async () => {
      try {
        if (mode === "paid") {
          const res = await api.get("/api/user/me", {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          });
          setBalance(res.data.internal_stars || 0);
        }

        if (mode === "daily") {
          const res = await api.get("/api/wheel/daily_status");
          setCanSpin(res.data.can_spin);
          setNextSpinTime(res.data.next_spin_time);
        }

        if (mode === "referral") {
          const res = await api.get("/api/wheel/referral_status");
          setAvailableSpins(res.data.available_spins || 0);
        }
      } catch (err) {
        console.error("Init error:", err);
      }
    })();
  }, [mode]);

  // === 🌀 Анімація обертання ===
  const spinToReward = (rewardType) => {
    const winningIndex = segments.findIndex((s) => s.type === rewardType);
    if (winningIndex === -1) return;

    const targetPosition = winningIndex * -segmentWidth + centeringOffset;
    const currentBaseOffset = offset % wheelCycleLength;
    const randomTurns = 4 + Math.floor(Math.random() * 3);
    const finalOffset = offset + (targetPosition - currentBaseOffset) - wheelCycleLength * randomTurns;

    setTransition({ duration: 4, ease: "easeOut" });
    setResult(null);
    setOffset(finalOffset);

    setTimeout(() => {
      setSpinning(false);
      setResult(segments[winningIndex]);
    }, 4500);
  };

  // === 🎯 2. Обробка спіну залежно від типу ===
  const handleSpin = async () => {
    if (spinning) return;

    // --- PAID ---
    if (mode === "paid") {
      if (balance < spinCost) return navigate("/deposit");

      setSpinning(true);
      try {
        const { data } = await api.post("/api/wheel/spin");
        if (!data.success) throw new Error(data.message);

        if (data.new_internal_stars !== undefined) setBalance(data.new_internal_stars);
        else setBalance((b) => b - spinCost);

        spinToReward(data.result.type);
      } catch (err) {
        console.error("Paid spin error:", err);
        setSpinning(false);
      }
    }

    // --- DAILY ---
    if (mode === "daily") {
      if (!canSpin) return;
      setSpinning(true);
      try {
        const { data } = await api.post("/api/wheel/daily_spin");
        if (!data.success) throw new Error(data.message);
        spinToReward(data.result.type);
        setCanSpin(false);
        setNextSpinTime(data.next_spin_time);
      } catch (err) {
        console.error("Daily spin error:", err);
        setSpinning(false);
      }
    }

    // --- REFERRAL ---
    if (mode === "referral") {
      if (availableSpins <= 0) return;
      setSpinning(true);
      try {
        const { data } = await api.post("/api/wheel/referral_spin");
        if (!data.success) throw new Error(data.message);
        spinToReward(data.result.type);
        setAvailableSpins((prev) => prev - 1);
      } catch (err) {
        console.error("Referral spin error:", err);
        setSpinning(false);
      }
    }
  };

  // === 🧠 Обробка завершення анімації (для безкінечного скролу) ===
  const handleAnimationComplete = () => {
    if (transition.duration === 0) return;
    const currentBaseOffset = offset % wheelCycleLength;
    setTransition({ duration: 0 });
    setOffset(currentBaseOffset);
  };

  // === 🧩 Рендер кнопки залежно від типу ===
  const renderSpinButton = () => {
    if (mode === "paid")
      return `${spinning ? "Spinning..." : `Spin for ${spinCost} ⭐`}`;

    if (mode === "daily")
      return spinning
        ? "Spinning..."
        : canSpin
        ? "Spin Free"
        : `Next spin: ${nextSpinTime ? new Date(nextSpinTime).toLocaleTimeString() : "—"}`;

    if (mode === "referral")
      return spinning
        ? "Spinning..."
        : availableSpins > 0
        ? `Spin (${availableSpins})`
        : "No spins left";
  };

  // === 🧩 Рендер назви ===
  const getTitle = () => {
    if (mode === "paid") return "🎡 Paid Wheel";
    if (mode === "daily") return "🎁 Daily Free Wheel";
    if (mode === "referral") return "🤝 Referral Wheel";
  };

  return (
    <div className={styles.container}>
      <h2>{getTitle()}</h2>

      {mode === "paid" && (
        <div className={styles.balanceDisplay} onClick={() => navigate("/deposit")}>
          Your Balance: {balance} ⭐ <span className={styles.depositIcon}>+</span>
        </div>
      )}

      <div className={styles.wheelWrapper}>
        <motion.div
          className={styles.wheel}
          animate={{ x: offset }}
          transition={transition}
          onAnimationComplete={handleAnimationComplete}
        >
          {[...Array(8)].flatMap((_, i) =>
            segments.map((seg, idx) => (
              <div
                key={`${i}-${idx}`}
                className={styles.segment}
                style={{
                  background: seg.image
                    ? `url(${seg.image}) center/cover no-repeat`
                    : seg.color,
                }}
              ></div>
            ))
          )}
        </motion.div>
        <div className={styles.marker}>▼</div>
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning || (mode === "daily" && !canSpin) || (mode === "referral" && availableSpins <= 0)}
        className={styles.spinButton}
      >
        {renderSpinButton()}
      </button>

      {result && (
        <div className={styles.result}>
          🎉 You won: <strong>{result.label}</strong>
        </div>
      )}
    </div>
  );
}
