// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import api from "../../utils/api";
// import styles from "./RaffleDetail.module.css";

// export default function RaffleDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [raffle, setRaffle] = useState(null);
//   const [timeLeft, setTimeLeft] = useState("");
//   const [isParticipating, setIsParticipating] = useState(false);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [joining, setJoining] = useState(false);
//   const [canJoin, setCanJoin] = useState(false);

//   // ===============================
//   // Завантаження розіграшу та перевірка тікетів
//   // ===============================
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         setLoading(true);
//         const raffleRes = await api.get(`/api/raffle/${id}`);
//         const userRes = await api.get("/api/user/me");
//         const resultRes = await api.get(`/api/raffle/${id}/result`);

//         const raffleData = raffleRes.data;
//         const tickets = userRes.data.tickets || 0;
//         const status = resultRes.data.status;

//         // Тест: закінчення через 30 секунд
//         raffleData.ends_at = new Date(Date.now() + 30 * 1000).toISOString();

//         setRaffle(raffleData);
//         setIsParticipating(status === "won" || status === "lost" || status === "participating");
//         setResult(status === "won" || status === "lost" ? status : null);
//         setCanJoin(
//           tickets >= raffleData.cost && (status === "not_participated" || status === "pending")
//         );
//       } catch (err) {
//         console.error("Error loading raffle:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, [id]);

//   // ===============================
//   // Таймер до кінця розіграшу
//   // ===============================
//   useEffect(() => {
//     if (!raffle?.ends_at) return;

//     const interval = setInterval(() => {
//       const diff = new Date(raffle.ends_at).getTime() - Date.now();
//       if (diff <= 0) {
//         setTimeLeft("Raffle ended");
//         clearInterval(interval);
//         checkResult();
//       } else {
//         const minutes = Math.floor((diff / 1000 / 60) % 60);
//         const seconds = Math.floor((diff / 1000) % 60);
//         setTimeLeft(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [raffle]);

//   // ===============================
//   // Функція перевірки результату
//   // ===============================
//   const checkResult = async () => {
//     try {
//       const res = await api.get(`/api/raffle/${id}/result`);
//       const status = res.data.status;
//       setResult(status === "won" || status === "lost" ? status : null);
//       setIsParticipating(status !== "not_participated");
//       setCanJoin(false);
//     } catch (err) {
//       console.error("Error checking raffle result:", err);
//     }
//   };

//   // ===============================
//   // Оновлення учасників
//   // ===============================
//   useEffect(() => {
//     if (!raffle) return;
//     const interval = setInterval(async () => {
//       try {
//         const res = await api.get(`/api/raffle/${id}`);
//         setRaffle((prev) => ({ ...prev, participants: res.data.participants }));
//       } catch (err) {
//         console.error("Error updating participants:", err);
//       }
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [raffle, id]);

//   // ===============================
//   // Join raffle
//   // ===============================
//   const handleJoin = async () => {
//     try {
//       setJoining(true);
//       await api.post(`/api/raffle/${id}/join`);
//       setIsParticipating(true);
//       setCanJoin(false);
//       setRaffle((prev) => ({ ...prev, participants: prev.participants + 1 }));
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to join raffle");
//     } finally {
//       setJoining(false);
//     }
//   };

//   if (loading) return <p className={styles.Loading}>Loading raffle...</p>;
//   if (!raffle) return <p className={styles.Error}>Raffle not found</p>;

//   return (
//     <div className={styles.Container} style={{ borderImage: `${raffle.gradient || "linear-gradient(90deg,#00f,#0ff)"} 1` }}>
//       <button onClick={() => navigate(-1)} className={styles.BackButton}>← Back</button>

//       <img src={raffle.image} alt={raffle.title} className={styles.Image} />
//       <h2 className={styles.Title}>{raffle.title}</h2>

//       <div className={styles.Info}>
//         <p>Cost: <strong>{raffle.cost} 🎟</strong></p>
//         <p>Ends in: <strong className={timeLeft === "Raffle ended" ? styles.Ended : ""}>{timeLeft}</strong></p>
//         <p>Participants: <strong>{raffle.participants}</strong></p>
//       </div>

//       {timeLeft === "Raffle ended" ? (
//         <button className={styles.EndedButton} disabled>
//           {result ? (result === "won" ? "🎉 You Won!" : "😢 You Lost") : "Raffle Ended"}
//         </button>
//       ) : isParticipating ? (
//         <button className={styles.JoinedButton} disabled>✅ You’re Participating</button>
//       ) : (
//         <button className={styles.ConfirmButton} style={{ background: raffle.gradient }} onClick={handleJoin} disabled={!canJoin || joining}>
//           {joining ? "Joining..." : canJoin ? "Confirm Participation" : "Not enough tickets"}
//         </button>
//       )}
//     </div>
//   );
// }

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
  const [userTickets, setUserTickets] = useState(0);

  // ======================================================
  // 📦 Завантаження розіграшу та кількості тікетів
  // ======================================================
  useEffect(() => {
    async function fetchRaffle() {
      try {
        setLoading(true);

        const raffleRes = await api.get(`/api/raffle/${id}`);
        const raffleData = raffleRes.data;

        const userRes = await api.get("/api/user/me");
        const tickets = Number(userRes.data.tickets) || 0;
        setUserTickets(tickets);

        // Користувач ще не приєднався на цьому етапі
        setRaffle(raffleData);
        setIsParticipating(false);
        setResult(null);
        setCanJoin(tickets >= Number(raffleData.cost));
      } catch (err) {
        console.error("Error loading raffle:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRaffle();
  }, [id]);

  // ======================================================
  // 🕒 Таймер до кінця розіграшу
  // ======================================================
  useEffect(() => {
    if (!raffle?.ends_at) return;

    const interval = setInterval(async () => {
      const end = new Date(raffle.ends_at).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Raffle ended");
        clearInterval(interval);

        if (isParticipating) {
          try {
            const res = await api.get(`/api/raffle/${id}/result`);
            const status = res.data.status;
            setResult(status === "won" || status === "lost" ? status : null);
          } catch (err) {
            console.error("Error fetching raffle result:", err);
          }
        }

        setCanJoin(false);
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
  }, [raffle, id, isParticipating]);

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
  // 🎟 Кнопка приєднання до розіграшу
  // ======================================================
  const handleJoin = async () => {
    if (!canJoin) return;

    try {
      setJoining(true);
      await api.post(`/api/raffle/${id}/join`);
      setIsParticipating(true);
      setCanJoin(false);

      setRaffle((prev) => ({
        ...prev,
        participants: prev.participants + 1,
      }));
      setUserTickets((prev) => prev - Number(raffle.cost));
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
          Ends in: <strong className={timeLeft === "Raffle ended" ? styles.Ended : ""}>{timeLeft}</strong>
        </p>
        <p>
          Participants: <strong>{raffle.participants}</strong>
        </p>
        <p>
          Your tickets: <strong>{userTickets}</strong>
        </p>
      </div>

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

// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../utils/api";
// import styles from "./RaffleDetail.module.css";

// export default function RaffleDetail() {
//   const navigate = useNavigate();

//   const [raffle, setRaffle] = useState(null);
//   const [timeLeft, setTimeLeft] = useState("");
//   const [isParticipating, setIsParticipating] = useState(false);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [joining, setJoining] = useState(false);
//   const [canJoin, setCanJoin] = useState(false);
//   const [userTickets, setUserTickets] = useState(0);

//   const timerRef = useRef(null);

//   // ===============================
//   // 📦 Завантаження активного розіграшу та тікетів
//   // ===============================
//   const fetchActiveRaffle = async () => {
//     try {
//       setLoading(true);
//       // Беремо останній активний розіграш
//       const raffleRes = await api.get("/api/raffle/active");
//       const raffleData = raffleRes.data;

//       const userRes = await api.get("/api/user/me");
//       const tickets = Number(userRes.data.tickets) || 0;
//       setUserTickets(tickets);

//       setRaffle(raffleData);
//       setIsParticipating(false);
//       setResult(null);
//       setCanJoin(tickets >= Number(raffleData.cost));
//     } catch (err) {
//       console.error("Error loading raffle:", err);
//       setRaffle(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchActiveRaffle();
//   }, []);

//   // ===============================
//   // 🕒 Таймер до кінця розіграшу
//   // ===============================
//   useEffect(() => {
//     if (!raffle?.ends_at) return;

//     // Чистимо попередній таймер
//     if (timerRef.current) clearInterval(timerRef.current);

//     timerRef.current = setInterval(async () => {
//       const diff = new Date(raffle.ends_at).getTime() - Date.now();

//       if (diff <= 0) {
//         setTimeLeft("Raffle ended");
//         clearInterval(timerRef.current);

//         // Перевіряємо результат
//         try {
//           const res = await api.get(`/api/raffle/${raffle.id}/result`);
//           const status = res.data.status;
//           setResult(status === "won" || status === "lost" ? status : null);
//           setIsParticipating(status !== "not_participated");

//           // Якщо розіграш завершився, підвантажуємо новий
//           fetchActiveRaffle();
//         } catch (err) {
//           console.error("Error fetching raffle result:", err);
//         }

//         setCanJoin(false);
//       } else {
//         const hours = Math.floor(diff / (1000 * 60 * 60));
//         const minutes = Math.floor((diff / (1000 * 60)) % 60);
//         const seconds = Math.floor((diff / 1000) % 60);
//         setTimeLeft(
//           `${hours.toString().padStart(2, "0")}:${minutes
//             .toString()
//             .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
//         );
//       }
//     }, 1000);

//     return () => clearInterval(timerRef.current);
//   }, [raffle]);

//   // ===============================
//   // 🔄 Авто-оновлення кількості учасників
//   // ===============================
//   useEffect(() => {
//     if (!raffle) return;

//     const interval = setInterval(async () => {
//       try {
//         const res = await api.get(`/api/raffle/${raffle.id}`);
//         setRaffle((prev) => ({ ...prev, participants: res.data.participants }));
//       } catch (err) {
//         console.error("Error updating participants:", err);
//       }
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [raffle]);

//   // ===============================
//   // 🎟 Join
//   // ===============================
//   const handleJoin = async () => {
//     if (!canJoin) return;

//     try {
//       setJoining(true);
//       await api.post(`/api/raffle/${raffle.id}/join`);
//       setIsParticipating(true);
//       setCanJoin(false);
//       setRaffle((prev) => ({ ...prev, participants: prev.participants + 1 }));
//       setUserTickets((prev) => prev - Number(raffle.cost));
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to join raffle");
//     } finally {
//       setJoining(false);
//     }
//   };

//   // ===============================
//   // 💬 Відображення
//   // ===============================
//   if (loading) return <p className={styles.Loading}>Loading raffle...</p>;
//   if (!raffle) return <p className={styles.Error}>No active raffle</p>;

//   return (
//     <div
//       className={styles.Container}
//       style={{ borderImage: `${raffle.gradient || "linear-gradient(90deg,#00f,#0ff)"} 1` }}
//     >
//       <button onClick={() => navigate(-1)} className={styles.BackButton}>
//         ← Back
//       </button>

//       <img src={raffle.image} alt={raffle.title} className={styles.Image} />
//       <h2 className={styles.Title}>{raffle.title}</h2>

//       <div className={styles.Info}>
//         <p>Cost: <strong>{raffle.cost} 🎟</strong></p>
//         <p>Ends in: <strong className={timeLeft === "Raffle ended" ? styles.Ended : ""}>{timeLeft}</strong></p>
//         <p>Participants: <strong>{raffle.participants}</strong></p>
//         <p>Your tickets: <strong>{userTickets}</strong></p>
//       </div>

//       {timeLeft === "Raffle ended" ? (
//         <button className={styles.EndedButton} disabled>
//           {result
//             ? result === "won"
//               ? "🎉 You Won!"
//               : "😢 You Lost"
//             : "Raffle Ended"}
//         </button>
//       ) : isParticipating ? (
//         <button className={styles.JoinedButton} disabled>✅ You’re Participating</button>
//       ) : (
//         <button
//           className={styles.ConfirmButton}
//           style={{ background: raffle.gradient }}
//           onClick={handleJoin}
//           disabled={!canJoin || joining}
//         >
//           {joining ? "Joining..." : canJoin ? "Confirm Participation" : "Not enough tickets"}
//         </button>
//       )}
//     </div>
//   );
// }
