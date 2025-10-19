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
  const [canJoin, setCanJoin] = useState(false);

  // ======================================================
  // 📦 Завантаження даних розіграшу + перевірка тікетів користувача
  // ======================================================
  useEffect(() => {
    async function fetchRaffle() {
      try {
        setLoading(true);

        const res = await api.get(`/api/raffle/${id}`);
        setRaffle(res.data);

        // Перевірка кількості тікетів користувача
        const userRes = await api.get("/api/user/me");
        const userTickets = userRes.data.tickets || 0;

        // Перевірка статусу участі
        const resultRes = await api.get(`/api/raffle/${id}/result`);
        const status = resultRes.data.status;
        if (status === "not_participated" || status === "pending") {
          setIsParticipating(false);
          setResult(null);
          setCanJoin(userTickets >= res.data.cost);
        } else {
          setIsParticipating(true);
          setResult(status);
          setCanJoin(false);
        }
      } catch (err) {
        console.error("Error loading raffle:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRaffle();
  }, [id]);

  // ======================================================
  // 🕒 Вираховуємо час до кінця і авто-перевірка результату
  // ======================================================
  useEffect(() => {
    if (!raffle?.ends_at) return;

    const interval = setInterval(async () => {
      const end = new Date(raffle.ends_at).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Raffle ended");

        // Перевіряємо результат після завершення
        try {
          const res = await api.get(`/api/raffle/${id}/result`);
          const status = res.data.status;
          if (status === "won" || status === "lost") setResult(status);
          if (status !== "not_participated") setIsParticipating(true);
        } catch (err) {
          console.error("Error checking raffle result:", err);
        }

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
  }, [raffle, id]);

  // ======================================================
  // 🔄 Авто-оновлення кількості учасників
  // ======================================================
  useEffect(() => {
    if (!raffle) return;
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/api/raffle/${id}`);
        setRaffle((prev) => ({
          ...prev,
          participants: res.data.participants,
        }));
      } catch (err) {
        console.error("Error updating participants:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [raffle, id]);

  // ======================================================
  // 🎟 Приєднатися до розіграшу
  // ======================================================
  const handleJoin = async () => {
    try {
      setJoining(true);
      await api.post(`/api/raffle/${id}/join`);
      setIsParticipating(true);
      setCanJoin(false);
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
          disabled={!canJoin || joining}
        >
          {joining
            ? "Joining..."
            : canJoin
            ? "Confirm Participation"
            : "Not enough tickets"}
        </button>
      )}
    </div>
  );
}
