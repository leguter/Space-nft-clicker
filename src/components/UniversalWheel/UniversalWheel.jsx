import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";
import styles from "./UniversalWheel.module.css";

// Функція для уникнення кешу
const noCache = () => `?_=${new Date().getTime()}`;

export default function UniversalWheel({ mode = "paid" }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [balance, setBalance] = useState(0);
  const [availableSpins, setAvailableSpins] = useState(0);
  const [canSpin, setCanSpin] = useState(true);
  const [nextSpinTime, setNextSpinTime] = useState(null);
  const [offset, setOffset] = useState(0);
  const [transition, setTransition] = useState({ duration: 0, ease: "easeOut" });

  const navigate = useNavigate();
  const spinCost = 10;

  // === Сегменти (без змін) ===
  const getSegments = () => {
    // ... (ваш код сегментів без змін) ...
    if (mode === "paid") {
      return [
        { label: "🎟 Ticket", type: "raffle_ticket", image: "/images/ticket.png" },
        { label: "Calendar", type: "nft", image: "/images/calendar.jpg", stars: 1200 },
        { label: "🎟 Ticket", type: "raffle_ticket", image: "/images/ticket.png" },
        { label: "🌟 5 Stars", type: "stars", stars: 5, image: "/images/5stars.png" },
        { label: "🚀 Boost", type: "boost", image: "/images/boost.png" },
        { label: "Swiss Watch", type: "nft", image: "/images/swisswatch.jpg", stars: 5500 },
      ];
    }
    if (mode === "daily") {
      return [
        { label: "🎟 Ticket", type: "raffle_ticket", image: "/images/ticket.png" },
        { label: "🌟 3 Stars", type: "stars", stars: 3, image: "/images/3stars.png" },
        { label: "🧧 Bonus Box", type: "nft", image: "/images/bonusbox.jpg", stars: 200 },
        { label: "🚀 Boost", type: "boost", image: "/images/boost.png" },
      ];
    }
    if (mode === "referral") {
      return [
        { label: "🎟 Ticket", type: "raffle_ticket", image: "/images/ticket.png" },
        { label: "Calendar", type: "nft", image: "/images/calendar.jpg", stars: 1200 },
        { label: "🎟 Ticket", type: "raffle_ticket", image: "/images/ticket.png" },
        { label: "🌟 5 Stars", type: "stars", stars: 5, image: "/images/5stars.png" },
        { label: "🚀 Boost", type: "boost", image: "/images/boost.png" },
        { label: "Swiss Watch", type: "nft", image: "/images/swisswatch.jpg", stars: 5500 },
      ];
    }
    return [];
  };

  const segments = getSegments();
  const segmentWidth = 160;
  const totalSegments = segments.length;
  const wheelCycleLength = totalSegments * segmentWidth;
  const centeringOffset = segmentWidth / 2;

  // === Ініціалізація балансу (для 'paid') ===
  useEffect(() => {
    if (mode === "paid") {
      (async () => {
        try {
          const res = await api.get("/api/user/me", {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          });
          setBalance(res.data.internal_stars || 0);
        } catch (err) {
          console.error("Paid balance fetch error:", err);
        }
      })();
    }
  }, [mode]);

  // === Опитування статусу (для 'daily' та 'referral') ===
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found, wheel polling stopped.");
      return;
    }
    
    // ❗️❗️❗️ ОСЬ КЛЮЧОВЕ ВИПРАВЛЕННЯ ❗️❗️❗️
    // Створюємо конфігурацію з токеном
    const headersConfig = {
      headers: { Authorization: `Bearer ${token}` },
    };
    // ❗️❗️❗️ КІНЕЦЬ ВИПРАВЛЕННЯ ❗️❗️❗️

    const fetchWheelStatus = async () => {
      try {
        if (mode === "daily") {
          // ❗️ ВИПРАВЛЕНО: Додано headersConfig
          const res = await api.get(`/api/wheel/daily_status${noCache()}`, headersConfig);
          setCanSpin(res.data.daily_available);
          setNextSpinTime(res.data.next_spin_time || null);
        }
        if (mode === "referral") {
          // ❗️ ВИПРАВЛЕНО: Додано headersConfig
          const res = await api.get(`/api/wheel/referral_status${noCache()}`, headersConfig);
          setAvailableSpins(res.data.referral_spins || 0);
        }
      } catch (err) {
        // Додаємо .response?.data, щоб побачити помилку 401
        console.error("Wheel status update error:", err.response?.data || err.message);
      }
    };

    fetchWheelStatus(); // Запускаємо одразу
    const interval = setInterval(fetchWheelStatus, 5000); // І кожні 5 сек
    return () => clearInterval(interval);
    
  }, [mode]); // Залежність тільки від 'mode'

  // === Обертання колеса (без змін) ===
  const spinToReward = (rewardType) => {
    const winningIndex = segments.findIndex((s) => s.type === rewardType);
    if (winningIndex === -1) {
       console.error(`Could not find segment with type: ${rewardType}`);
       setSpinning(false); 
       return;
    }
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

  // === Обробка спіну ===
  const handleSpin = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    // ❗️❗️❗️ ОСЬ КЛЮЧОВЕ ВИПРАВЛЕННЯ ❗️❗️❗️
    const token = localStorage.getItem("authToken");
    if (!token) {
        console.error("Cannot spin, no auth token found");
        setSpinning(false);
        return;
    }
    const headersConfig = {
      headers: { Authorization: `Bearer ${token}` },
    };
    // ❗️❗️❗️ КІНЕЦЬ ВИПРАВЛЕННЯ ❗️❗️❗️

    try {
      let data;

      if (mode === "paid") {
        if (balance < spinCost) {
          navigate("/deposit");
          setSpinning(false);
          return;
        }
        // ❗️ ВИПРАВЛЕНО: Додано headersConfig
        // api.post(url, data, config)
        const res = await api.post("/api/wheel/spin", {}, headersConfig); 
        data = res.data;
        if (data.new_internal_stars !== undefined) {
            setBalance(data.new_internal_stars);
        }
      }

      if (mode === "daily") {
        // ❗️ ВИПРАВЛЕНО: Додано headersConfig
        const res = await api.post("/api/wheel/daily_spin", {}, headersConfig);
        data = res.data;
        setCanSpin(false);
        setNextSpinTime(data.next_spin_time || null);
      }

      if (mode === "referral") {
        // ❗️ ВИПРАВЛЕНО: Додано headersConfig
        const res = await api.post("/api/wheel/referral_spin", {}, headersConfig);
        data = res.data;
        
        // Ця логіка правильна - ми беремо дані з відповіді
        if (data.referral_spins !== undefined) {
          setAvailableSpins(data.referral_spins);
        } else {
          // Аварійний варіант
          setAvailableSpins((prev) => Math.max(prev - 1, 0));
        }
      }

      if (!data.success) {
        throw new Error(data.message || "Spin request failed");
      }
      
      if (data.result && data.result.type) {
        spinToReward(data.result.type);
      } else {
        setSpinning(false);
      }

    } catch (err) {
      console.error("Spin error:", err.response?.data || err.message);
      setSpinning(false);
    }
  };

  // === Анімація завершена (без змін) ===
  const handleAnimationComplete = () => {
    if (transition.duration === 0) return;
    const currentBaseOffset = offset % wheelCycleLength;
    setTransition({ duration: 0 });
    setOffset(currentBaseOffset);
  };

  // === Текст кнопки спіну (без змін) ===
  const renderSpinButton = () => {
    if (mode === "paid") return spinning ? "Spinning..." : `Spin for ${spinCost} ⭐`;
    if (mode === "daily")
      return spinning
        ? "Spinning..."
        : canSpin
        ? "Spin Free"
        : `Next spin: ${nextSpinTime ? new Date(nextSpinTime).toLocaleTimeString() : "—"}`;
    if (mode === "referral")
      return spinning ? "Spinning..." : availableSpins > 0 ? `Spin (${availableSpins})` : "No spins left";
  };

  // === Заголовок (без змін) ===
  const getTitle = () => {
    if (mode === "paid") return "🎡 Paid Wheel";
    if (mode === "daily") return "🎁 Daily Wheel";
    if (mode === "referral") return "🤝 Referral Wheel";
  };

  // === JSX (без змін) ===
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
                  background: seg.image ? `url(${seg.image}) center/cover no-repeat` : seg.color,
                }}
              ></div>
            ))
          )}
        </motion.div>
        <div className={styles.marker}>▼</div>
      </div>

      <button
        onClick={handleSpin}
        disabled={
          spinning ||
          (mode === "daily" && !canSpin) ||
          (mode === "referral" && availableSpins <= 0)
        }
        className={styles.spinButton}
      >
        {renderSpinButton()}
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