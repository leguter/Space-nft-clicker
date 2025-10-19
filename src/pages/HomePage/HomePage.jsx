import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import styles from "./HomePage.module.css";
import { FaUserCircle } from "react-icons/fa";
import { FiZap } from "react-icons/fi";
import TapButton from "../../components/TapButton/TapButton";
import api from "../../utils/api";

export default function HomePage() {
  const { balance, isTapped, handleTap, tapPower } = useOutletContext();

  const [floatingNumbers, setFloatingNumbers] = useState([]);
  const [localProgress, setLocalProgress] = useState(0);
  const [clicks, setClicks] = useState(0);

  // 🧠 Отримати прогрес при вході
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/user/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        // 🟢 Виправлено: беремо click_progress, а не progress
        setLocalProgress(res.data.click_progress || 0);
      } catch (err) {
        console.error("❌ Failed to load user progress:", err);
      }
    };
    fetchUser();
  }, []);

  // ⚡ Обробник кліку (анімація + оновлення бекенду)
  const handleTapWithAnimation = async (e) => {
    handleTap();

    // створюємо ефект "літаючого числа"
    const newNumber = {
      id: Date.now(),
      value: tapPower,
      x: e.clientX,
      y: e.clientY,
    };
    setFloatingNumbers((curr) => [...curr, newNumber]);
    setTimeout(() => {
      setFloatingNumbers((curr) => curr.filter((num) => num.id !== newNumber.id));
    }, 1000);

    // локально оновлюємо
    setClicks((prev) => prev + 1);
    setLocalProgress((prev) => Math.min(prev + 0.001, 1));

    // оновлення на бекенді
    try {
      const res = await api.post(
        "/api/user/update-clicks",
        { progress: 0.001 },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );

      // 🟢 синхронізація після відповіді
      setLocalProgress(res.data.progress);
    } catch (err) {
      console.error("❌ update-clicks error:", err.response?.data?.message || err.message);
    }
  };

  // 🎟 Отримати квиток (100%)
  const handleClaimTicket = async () => {
    try {
      const res = await api.post(
        "/api/user/claim-ticket",
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );

      alert(`🎟 Ticket claimed! You now have ${res.data.tickets} tickets.`);
      setLocalProgress(0);
      setClicks(0);
    } catch (err) {
      alert(err.response?.data?.message || "Error claiming ticket");
    }
  };

  const progressColor =
    localProgress < 0.7
      ? "#00eaff"
      : localProgress < 0.95
      ? "#00ff99"
      : "#ff00ff";

  return (
    <div className={styles.container}>
      <div className={styles.Card}>
        <header className={styles.header}>
          <h1 className={styles.title}>SPACE CLICKER</h1>
          <FaUserCircle className={styles.userIcon} />
        </header>

        <div className={styles.balance}>{balance.toLocaleString("en-US")} ★</div>

        <TapButton isTapped={isTapped} onClick={handleTapWithAnimation} />

        <div
          className={styles.progressSection}
          onClick={() => localProgress >= 1 && handleClaimTicket()}
          style={{ cursor: localProgress >= 1 ? "pointer" : "default" }}
        >
          <span className={styles.progressLabel}>PROGRESS</span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${Math.min(localProgress * 100, 100)}%`,
                backgroundColor: progressColor,
                boxShadow:
                  localProgress >= 0.95
                    ? `0 0 20px ${progressColor}, 0 0 40px ${progressColor}`
                    : "none",
                transition: "all 0.3s ease-in-out",
              }}
            ></div>
          </div>
        </div>

        <Link to="/boosters" className={styles.boostersButton}>
          <FiZap /> Boosters
        </Link>
      </div>

      {floatingNumbers.map((num) => (
        <div
          key={num.id}
          className={styles.floatingNumber}
          style={{ left: `${num.x}px`, top: `${num.y}px` }}
        >
          +{num.value}
        </div>
      ))}
    </div>
  );
}
