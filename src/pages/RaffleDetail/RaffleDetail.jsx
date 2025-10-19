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
  // 📦 Завантаження розіграшу та перевірка користувача
  // ======================================================
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const raffleRes = await api.get(`/api/raffle/${id}`);
        const userRes = await api.get("/api/user/me");
        const resultRes = await api.get(`/api/raffle/${id}/result`);

        const raffleData = raffleRes.data;
        const tickets = userRes.data.tickets || 0;
        const status = resultRes.data.status;

        // Тимчасово встановлюємо закінчення через 1 хвилину для тесту
        raffleData.ends_at = new Date(Date.now() + 60 * 1000).toISOString();

        setRaffle(raffleData);
        setIsParticipating(status !== "not_participated" && status !== "pending");
        setResult(status === "won" || status === "lost" ? status : null);
        setCanJoin(tickets >= raffleData.cost && status === "not_participated");
      } catch (err) {
        console.error("Error loading raffle:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  // ======================================================
  // 🕒 Таймер до кінця розіграшу
  // ======================================================
  useEffect(() => {
    if (!raffle?.ends_at) return;

    const interval = setInterval(async () => {
      const diff = new Date(raffle.ends_at).getTime() - Date.now();

      if (diff <= 0) {
        setTimeLeft("Raffle ended");
        clearInterval(interval);

        // Авто-перевірка результату після завершення
        try {
          const res = await api.get(`/api/raffle/${id}/result`);
          const status = res.data.status;
          setResult(status === "won" || status === "lost" ? status : null);
          setIsParticipating(status !== "not_participated");
          setCanJoin(false);
        } catch (err) {
          console.error("Error fetching result:", err);
        }
      } else {
        const minutes = Math.floor(diff / 1000 / 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(
          `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );
      }
    }, 1000);

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

  if (loading) return <p className={styles.Loading}>Loading raffle...</p>;
  if (!raffle) return <p className={styles.Error}>Raffle not found</p>;

  return (
    <div
      className={styles.Container}
      style={{ borderImage: `${raffle.gradient || "linear-gradient(90deg,#00f,#0ff)"} 1` }}
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
          Ends in: <strong className={timeLeft === "Raffle ended" ? styles.Ended : ""}>{timeLeft}</strong>
        </p>
        <p>Participants: <strong>{raffle.participants}</strong></p>
      </div>

      {timeLeft === "Raffle ended" ? (
        <button className={styles.EndedButton} disabled>
          {result ? (result === "won" ? "🎉 You Won!" : "😢 You Lost") : "Raffle Ended"}
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
          {joining ? "Joining..." : canJoin ? "Confirm Participation" : "Not enough tickets"}
        </button>
      )}
    </div>
  );
}
