// // // src/utils/api.js
// // export async function apiFetch(endpoint, options = {}) {
// //   const token = localStorage.getItem("authToken");

// //   if (!token) {
// //     console.error("❌ No JWT token in localStorage");
// //     throw new Error("User not authenticated");
// //   }

// //   const headers = {
// //     "Content-Type": "application/json",
// //     Authorization: `Bearer ${token}`, // ✅ ТЕПЕР ПРАВИЛЬНО
// //     ...options.headers,
// //   };

// //   const response = await fetch(`https://back-space-clicker-1.onrender.com${endpoint}`, {
// //     ...options,
// //     headers,
// //   });

// //   const data = await response.json().catch(() => ({}));

// //   if (!response.ok) {
// //     console.error("❌ API error:", data);
// //     throw new Error(data.message || "API request failed");
// //   }

// //   return data;
// // }
// import axios from 'axios';

// // Створюємо екземпляр axios
// const api = axios.create({
//   baseURL: 'https://back-space-clicker-1.onrender.com' // Ваш базовий URL
// });

// // ✨ Ось магія: створюємо перехоплювач запитів
// api.interceptors.request.use(
//   (config) => {
//     // Перед кожним запитом отримуємо токен з localStorage
//     const token = localStorage.getItem('authToken');

//     // Якщо токен існує, додаємо його в заголовок Authorization
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // Повертаємо оновлену конфігурацію
//     return config;
//   },
//   (error) => {
//     // Робимо щось із помилкою запиту
//     return Promise.reject(error);
//   }
// );

// export default api;
// src/pages/RaffleDetail/RaffleDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import styles from "./RaffleDetail.module.css";

export default function RaffleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [raffle, setRaffle] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [isParticipating, setIsParticipating] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  // ======================================================
  // 📦 Завантаження даних розіграшу
  // ======================================================
  useEffect(() => {
    async function fetchRaffle() {
      try {
        setLoading(true);
        const res = await api.get(`/api/raffle/${id}`);
        setRaffle(res.data);
      } catch (err) {
        console.error("Error loading raffle:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRaffle();
  }, [id]);

  // ======================================================
  // 🕒 Вираховуємо час до кінця
  // ======================================================
  useEffect(() => {
    if (!raffle?.ends_at) return;

    const interval = setInterval(() => {
      const end = new Date(raffle.ends_at).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Raffle ended");
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [raffle]);

  // ======================================================
  // ✅ Перевірка участі (чи вже в розіграші)
  // ======================================================
  useEffect(() => {
    if (!raffle) return;
    checkResult(); // при кожному оновленні raffle перевіряємо статус
  }, [raffle]);

  const checkResult = async () => {
    try {
      const res = await api.get(`/api/raffle/${id}/result`);
      if (res.data.status === "not_participated") {
        setIsParticipating(false);
      } else {
        setIsParticipating(true);
      }
      if (res.data.status === "won" || res.data.status === "lost") {
        setResult(res.data.status);
      }
    } catch (err) {
      console.error("Error checking raffle result:", err);
    }
  };

  // ======================================================
  // 🎟 Приєднатися до розіграшу
  // ======================================================
  const handleJoin = async () => {
    try {
      setJoining(true);
      await api.post(`/api/raffle/${id}/join`);
      setIsParticipating(true);
      setRaffle((prev) => ({
        ...prev,
        participants: prev.participants + 1,
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to join raffle");
    } finally {
      setJoining(false);
    }
  };

  // ======================================================
  // 💬 Відображення
  // ======================================================
  if (loading) return <p className={styles.Loading}>Loading raffle...</p>;
  if (!raffle) return <p className={styles.Error}>Raffle not found</p>;

  return (
    <div
      className={styles.Container}
      style={{
        borderImage: `${raffle.gradient || "linear-gradient(90deg,#00f,#0ff)"} 1`,
      }}
    >
      <button onClick={() => navigate(-1)} className={styles.BackButton}>
        ← Back
      </button>

      <img src={raffle.image} alt={raffle.title} className={styles.Image} />
      <h2 className={styles.Title}>{raffle.title}</h2>

      <div className={styles.Info}>
        <p>
          Cost: <strong>{raffle.cost} 🎟</strong>
        </p>
        <p>
          Ends in:{" "}
          <strong className={timeLeft === "Raffle ended" ? styles.Ended : ""}>
            {timeLeft}
          </strong>
        </p>
        <p>
          Participants: <strong>{raffle.participants}</strong>
        </p>
      </div>

      {/* ==== Логіка кнопки ==== */}
      {timeLeft === "Raffle ended" ? (
        <button className={styles.EndedButton} disabled>
          {result
            ? result === "won"
              ? "🎉 You Won!"
              : "😢 You Lost"
            : "Raffle Ended"}
        </button>
      ) : isParticipating ? (
        <button className={styles.JoinedButton} disabled>
          ✅ You’re Participating
        </button>
      ) : (
        <button
          className={styles.ConfirmButton}
          style={{ background: raffle.gradient }}
          onClick={handleJoin}
          disabled={joining}
        >
          {joining ? "Joining..." : "Confirm Participation"}
        </button>
      )}
    </div>
  );
}
