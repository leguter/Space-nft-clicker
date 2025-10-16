import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import rafflesData from "../../data/rafflesData";
import styles from "./RaffleDetail.module.css";

export default function RaffleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const raffle = rafflesData.find((r) => r.id === id);
  const [timeLeft, setTimeLeft] = useState("");
 useEffect(() => {
    setTimeLeft(getTimeLeft());
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, [raffle.endsAt]);
  if (!raffle) return <p>Raffle not found</p>;

  const getTimeLeft = () => {
    const end = new Date(raffle.endsAt).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    if (diff <= 0) return "Raffle ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

 

  return (
    <div
      className={styles.Container}
      style={{ borderImage: `${raffle.gradient} 1`, borderColor: raffle.gradient }}
    >
      <button onClick={() => navigate(-1)} className={styles.BackButton}>
        ← Back
      </button>

      <img src={raffle.image} alt={raffle.title} className={styles.Image} />

      <h2 style={{ color: "white", textShadow: "0 0 10px rgba(255,255,255,0.4)" }}>
        {raffle.title}
      </h2>

      <div className={styles.Info}>
        <p>Cost: <strong>{raffle.cost} 🎟</strong></p>
        <p>
          Ends in:{" "}
          <strong className={timeLeft === "Raffle ended" ? styles.Ended : ""}>
            {timeLeft}
          </strong>
        </p>
        <p>Participants: <strong>{raffle.participants}</strong></p>
      </div>

      <button
        className={styles.ConfirmButton}
        style={{ background: raffle.gradient }}
        disabled={timeLeft === "Raffle ended"}
      >
        {timeLeft === "Raffle ended" ? "Raffle Ended" : "Confirm Participation"}
      </button>
    </div>
  );
}
