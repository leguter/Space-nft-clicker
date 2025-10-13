
import styles from "./RaffleCard.module.css";

export default function RaffleCard({ raffle, userTickets, onJoin }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span>{raffle.name} {raffle.icon}</span>
        <span className={styles.ticketCost}>{raffle.ticketCost} 🎫</span>
      </div>
      <button
        className={styles.joinButton}
        disabled={userTickets < raffle.ticketCost}
        onClick={() => onJoin(raffle)}
      >
        JOIN
      </button>
    </div>
  );
}