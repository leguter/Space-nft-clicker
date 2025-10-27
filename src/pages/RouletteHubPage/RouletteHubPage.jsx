import { useNavigate } from "react-router-dom";
import styles from "./RouletteHubPage.module.css";

export default function RouletteHubPage() {
  const navigate = useNavigate();

  const wheels = [
    {
      title: "Standard Wheel",
      desc: "Крути за зірки 🌟",
      path: "/wheel/standard",
      color: "linear-gradient(135deg, #007bff, #00e1ff)",
    },
    {
      title: "Referral Wheel",
      desc: "Один спін за кожного друга 👥",
      path: "/wheel/referral",
      color: "linear-gradient(135deg, #ff8a00, #ff2d55)",
    },
    {
      title: "Daily Wheel",
      desc: "1 спін кожні 24 години ⏰",
      path: "/wheel/daily",
      color: "linear-gradient(135deg, #00ff88, #008f4c)",
    },
  ];

  return (
    <div className={styles.Container}>
      <h2 className={styles.Title}>🎰 Обери свою рулетку</h2>

      <div className={styles.WheelList}>
        {wheels.map((wheel) => (
          <div
            key={wheel.title}
            className={styles.Card}
            style={{ background: wheel.color }}
            onClick={() => navigate(wheel.path)}
          >
            <h3>{wheel.title}</h3>
            <p>{wheel.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
