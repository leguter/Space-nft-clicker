import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";
import styles from "./UniversalWheel.module.css";

export default function UniversalWheel({ mode = "paid" }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [balance, setBalance] = useState(0);
  const [offset, setOffset] = useState(0);
  const [transition, setTransition] = useState({ duration: 0, ease: "easeOut" });

  const navigate = useNavigate();
  const spinCost = 10;

  // 🔹 Універсальні сегменти (можна заміняти залежно від mode)
  const segments = [
    { label: "🎟 Ticket", type: "raffle_ticket", image: "/images/ticket.png" },
    { label: "NFT Calendar", type: "nft", image: "/images/calendar.jpg", stars: 1200 },
    { label: "🌟 5 Stars", type: "stars", stars: 5, image: "/images/5stars.png" },
    { label: "🚀 Boost", type: "boost", image: "/images/boost.png" },
    { label: "Swiss Watch", type: "nft", image: "/images/swisswatch.jpg", stars: 5500 },
  ];

  const segmentWidth = 160;
  const totalSegments = segments.length;
  const wheelCycleLength = totalSegments * segmentWidth;
  const centeringOffset = segmentWidth / 2;

  // === Завантаження балансу ===
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await api.get("/api/user/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setBalance(res.data?.internal_stars ?? 0);
      } catch (err) {
        console.error("❌ Balance error:", err);
        setBalance(0);
      }
    };
    fetchBalance();
  }, []);

  // === Обертання ===
  const spinToReward = (rewardType) => {
    const winningIndex = segments.findIndex((s) => s.type === rewardType);
    if (winningIndex === -1) {
      console.error("Приз не знайдено:", rewardType);
      setSpinning(false);
      return;
    }

    const targetPosition = winningIndex * -segmentWidth + centeringOffset;
    const currentOffset = offset;
    const currentBaseOffset = currentOffset % wheelCycleLength;
    const randomTurns = 4 + Math.floor(Math.random() * 3);
    const spinDistance = wheelCycleLength * randomTurns;

    const finalOffset = currentOffset + (targetPosition - currentBaseOffset) - spinDistance;

    setTransition({ duration: 4, ease: "easeOut" });
    setResult(null);
    setOffset(finalOffset);

    setTimeout(() => {
      setSpinning(false);
      setResult(segments[winningIndex]);
    }, 4500);
  };

  const handleAnimationComplete = () => {
    if (transition.duration === 0) return;
    const currentBaseOffset = offset % wheelCycleLength;
    setTransition({ duration: 0 });
    setOffset(currentBaseOffset);
  };

  const handleSpin = async () => {
    if (spinning) return;

    if (balance < spinCost) {
      navigate("/deposit");
      return;
    }

    setSpinning(true);
    setResult(null);

    try {
      const { data: spinData } = await api.post("/api/wheel/spin");
      if (!spinData.success) throw new Error(spinData.message || "Spin failed");

      if (spinData.new_internal_stars !== undefined)
        setBalance(spinData.new_internal_stars);
      else setBalance((prev) => prev - spinCost);

      spinToReward(spinData.result.type);
    } catch (err) {
      console.error("Spin error:", err);
      setSpinning(false);
    }
  };

  const goToDeposit = () => navigate("/deposit");

  return (
    <div className={styles.container}>
      <h2>🎡 Wheel of Fortune</h2>

      <div className={styles.balanceDisplay} onClick={goToDeposit}>
        Your Balance: {balance} ⭐
        <span className={styles.depositIcon}>+</span>
      </div>

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
              >
                {!seg.image && seg.label}
              </div>
            ))
          )}
        </motion.div>

        <div className={styles.marker}>▼</div>
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning}
        className={styles.spinButton}
      >
        {spinning ? "Spinning..." : `Spin for ${spinCost} ⭐`}
      </button>

      {result && (
        <div className={styles.result}>
          🎉 You won: <strong>{result.label}</strong>
        </div>
      )}

      <h2 className={styles.sectionTitle}>CASE CONTENTS</h2>
      <div className={styles.itemsGrid}>
        {segments.map((item, index) => (
          <div key={index} className={styles.itemCard}>
            <div className={styles.itemImageWrapper}>
              <img
                src={item.image || "/images/placeholder.png"}
                alt={item.label}
                className={styles.itemImage}
                width="48"
                height="48"
              />
            </div>
            <div className={styles.itemDetails}>
              <p className={styles.itemName}>{item.label}</p>
              {item.stars ? (
                <div className={styles.itemStars}>
                  {item.stars} <span className={styles.rotatingStar}>⭐️</span>
                </div>
              ) : (
                <div className={styles.itemStars}></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
