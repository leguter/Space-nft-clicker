import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./RaffleDetail.module.css";

const raffleData = {
  rare: {
    title: "Rare NFT 🌟",
    cost: 3,
    image: "/images/rare-nft.png",
    endsAt: "2025-10-20T18:00:00",
    participants: 128,
  },
  legend: {
    title: "Legend NFT 🔥",
    cost: 5,
    image: "/images/legend-nft.png",
    endsAt: "2025-10-22T21:00:00",
    participants: 64,
  },
  epic: {
    title: "Epic NFT 💎",
    cost: 8,
    image: "/images/epic-nft.png",
    endsAt: "2025-10-25T20:00:00",
    participants: 42,
  },
};

export default function RaffleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const raffle = raffleData[id];
  const [timeLeft, setTimeLeft] = useState("");

  // 🕒 Функція обчислення залишку часу
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

  // 🔁 Оновлення таймера щосекунди
  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [raffle.endsAt]);

  if (!raffle) return <p>Raffle not found</p>;

  return (
    <div className={styles.Container}>
      <button onClick={() => navigate(-1)} className={styles.BackButton}>
        ← Back
      </button>

      <img src={raffle.image} alt={raffle.title} className={styles.Image} />
      <h2>{raffle.title}</h2>

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

      <button
        className={styles.ConfirmButton}
        disabled={timeLeft === "Raffle ended"}
      >
        {timeLeft === "Raffle ended" ? "Raffle Ended" : "Confirm Participation"}
      </button>
    </div>
  );
}
