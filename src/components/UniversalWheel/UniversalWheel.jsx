import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";
import styles from "./UniversalWheel.module.css";

// ❗️ НОВА ФУНКЦІЯ: Генерує "cache buster" (унікальний параметр),
// щоб запити GET не кешувалися
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

  // ❗️ РЕФАКТОР: Окремий useEffect для завантаження балансу (запускається 1 раз)
  useEffect(() => {
    if (mode === "paid") {
      (async () => {
        try {
          // Використовуємо той самий 'api.get'
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

  // ❗️ РЕФАКТОР: Об'єднаний useEffect для опитування (polling)
  useEffect(() => {
    // Функція, яка завантажує статус
    const fetchWheelStatus = async () => {
      try {
        if (mode === "daily") {
          const res = await api.get(`/api/wheel/daily_status${noCache()}`);
          setCanSpin(res.data.daily_available);
          setNextSpinTime(res.data.next_spin_time || null);
        }
        if (mode === "referral") {
          const res = await api.get(`/api/wheel/referral_status${noCache()}`);
          setAvailableSpins(res.data.referral_spins || 0);
        }
      } catch (err) {
        console.error("Wheel status update error:", err);
      }
    };

    // 1. Викликаємо одразу при завантаженні компонента
    fetchWheelStatus();

    // 2. Встановлюємо інтервал
    const interval = setInterval(fetchWheelStatus, 5000);

    // 3. Очищуємо інтервал при виході
    return () => clearInterval(interval);
    
  }, [mode]); // Цей ефект перезапуститься, якщо 'mode' зміниться

  // === Обертання колеса (без змін) ===
  const spinToReward = (rewardType) => {
    // Знаходимо *перший* індекс, що збігається. Це важливо.
    const winningIndex = segments.findIndex((s) => s.type === rewardType);
    if (winningIndex === -1) {
       console.error(`Could not find segment with type: ${rewardType}`);
       // Аварійна зупинка, щоб користувач не застряг
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

  // ❗️ РЕФАКТОР: Обробка спіну тепер коректно оновлює стан
  const handleSpin = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null); // Завжди очищуємо результат перед спіном

    try {
      let data;

      if (mode === "paid") {
        if (balance < spinCost) {
          navigate("/deposit");
          setSpinning(false);
          return;
        }
        const res = await api.post("/api/wheel/spin");
        data = res.data;
        // Оновлюємо баланс з відповіді сервера (це у вас було)
        if (data.new_internal_stars !== undefined) {
            setBalance(data.new_internal_stars);
        }
      }

      if (mode === "daily") {
        const res = await api.post("/api/wheel/daily_spin");
        data = res.data;
        // Оновлюємо стан з відповіді сервера (це у вас було)
        setCanSpin(false);
        setNextSpinTime(data.next_spin_time || null);
      }

      if (mode === "referral") {
        const res = await api.post("/api/wheel/referral_spin");
        data = res.data;
        
        // ❗️ ОСЬ ТУТ ВИПРАВЛЕННЯ:
        // Ми беремо нове значення спінів з відповіді сервера,
        // а не просто віднімаємо 1.
        if (data.referral_spins !== undefined) {
          setAvailableSpins(data.referral_spins);
        } else {
          // Аварійний варіант, якщо сервер раптом не повернув
          setAvailableSpins((prev) => Math.max(prev - 1, 0));
        }
      }

      // Загальна обробка результату
      if (!data.success) {
        // Якщо сервер повернув { success: false, message: "..." }
        throw new Error(data.message || "Spin request failed");
      }
      
      if (data.result && data.result.type) {
        spinToReward(data.result.type);
      } else {
        // Якщо спін не вдався (напр, 'no spins left' обійшов 'disabled')
        setSpinning(false);
      }

    } catch (err) {
      console.error("Spin error:", err);
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