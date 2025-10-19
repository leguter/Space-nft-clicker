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
  const [tickets, setTickets] = useState(0);

  // ===========================
  // Завантаження даних
  // ===========================
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const raffleRes = await api.get(`/api/raffle/${id}`);
        const userRes = await api.get("/api/user/me");
        const raffleData = raffleRes.data;

        // Тест: закінчення через 30 секунд
        raffleData.ends_at = new Date(Date.now() + 30 * 1000).toISOString();

        setRaffle(raffleData);
        setTickets(userRes.data.tickets || 0);

        // Кнопка Join активна лише якщо є тікети
        setCanJoin((userRes.data.tickets || 0) >= raffleData.cost);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // ===========================
  // Таймер
  // ===========================
  useEffect(() => {
    if (!raffle?.ends_at) return;

    const interval = setInterval(async () => {
      const diff = new Date(raffle.ends_at).getTime() - Date.now();

      if (diff <= 0) {
        setTimeLeft("Raffle ended");
        clearInterval(interval);

        // Перевіряємо результат після закінчення
        try {
          const res = await api.get(`/api/raffle/${id}/result`);
          const status = res.data.status;
          setResult(status === "won" || status === "lost" ? status : null);
          setIsParticipating(status !== "not_participated");
          setCanJoin(false);
        } catch (err) {
          console.error(err);
        }
      } else {
        const seconds = Math.floor(diff / 1000);
        setTimeLeft(`00:${seconds.toString().padStart(2, "0")}`);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [raffle, id]);

  // ===========================
  // Join
  // ===========================
  const handleJoin = async () => {
    if (!raffle) return;
    if (tickets < raffle.cost) return;

    try {
      setJoining(true);
      await api.post(`/api/raffle/${id}/join`);
      setIsParticipating(true);
      setCanJoin(false);
      setTickets((prev) => prev - raffle.cost);
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
        <p>Your tickets: <strong>{tickets}</strong></p>
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
