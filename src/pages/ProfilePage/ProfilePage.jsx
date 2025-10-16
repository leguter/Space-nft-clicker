
// import styles from "./ProfilePage.module.css";

// export default function ProfilePage({user}) {
//   console.log(user)
//   return (
//     user ? (
// <div className={styles.Container}>
//       <div className={styles.Card}>
//        {user.user.photoUrl ? <img src={user.user.photoUrl} className={styles.Photo}></img> : (<div className={styles.Avatar}></div>)} 
//         <h2 className={styles.Name}>{user.user.firstName || "Space User"}</h2>
//         <p className={styles.Id}>@{user.user.username}</p>

//         <div className={styles.Stats}>
//           <div>
//             <span className={styles.StatNumber}>12</span>
//             <p>Referrals</p>
//           </div>
//           <div>
//             <span className={styles.StatNumber}>{user.user.balance}⭐</span>
//             <p>Total Earned</p>
//           </div>
//         </div>
//       </div>
//     </div>
//     ) : (
//       <h1>НЕ ВОРК</h1>
//     )
    
//   );
// }
import { useState } from "react";
import styles from "./ProfilePage.module.css";

export default function ProfilePage({ user }) {
  const [isCopied, setIsCopied] = useState(false);

  // Припускаємо, що назва вашого телеграм-бота "your_bot_name". Замініть на актуальну.
  const botUrl = "https://t.me/@Durovu_bot";
  // Припускаємо, що посилання для підписки на телеграм-канал "your_channel_name". Замініть на актуальну.
  const telegramChannelUrl = "https://t.me/SpaceClicker";

  const handleCopyLink = () => {
    // Створюємо унікальне реферальне посилання для користувача
    const referralLink = `${botUrl}?start=${user.user.username}`;
    navigator.clipboard.writeText(referralLink).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000); // Скидаємо стан "Скопійовано" через 2 секунди
    });
  };

  console.log(user);

  return user ? (
    <div className={styles.Container}>
      <div className={styles.Card}>
        {user.user.photoUrl ? (
          <img src={user.user.photoUrl} className={styles.Photo} alt="User" />
        ) : (
          <div className={styles.Avatar}></div>
        )}
        <h2 className={styles.Name}>{user.user.firstName || "Space User"}</h2>
        <p className={styles.Id}>@{user.user.username}</p>

        <div className={styles.Stats}>
          <div>
            {/* Припускаємо, що кількість рефералів приходить з бекенду в user.user.referralsCount */}
            <span className={styles.StatNumber}>{user.user.referralsCount || 0}</span>
            <p>Referrals</p>
          </div>
          <div>
            <span className={styles.StatNumber}>{user.user.balance}⭐</span>
            <p>Total Earned</p>
          </div>
          <div>
            {/* Припускаємо, що кількість тікетів приходить з бекенду в user.user.ticketsCount */}
            <span className={styles.StatNumber}>{user.user.tickets || 0}🎫</span>
            <p>Tickets</p>
          </div>
        </div>

        <div className={styles.ReferralSection}>
          <h3>Your Referral Link</h3>
          <p>Invite a friend and get 3 tickets for the draw!</p>
          <div className={styles.ReferralLinkBox}>
            <input type="text" value={`${botUrl}?start=${user.user.username}`} readOnly />
            <button onClick={handleCopyLink} className={styles.CopyButton}>
              {isCopied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className={styles.TelegramSection}>
            <a href={telegramChannelUrl} target="_blank" rel="noopener noreferrer" className={styles.TelegramButton}>
                Subscribe to Telegram
            </a>
            <p>Subscribe to our channel to receive bonuses!</p>
        </div>
      </div>
    </div>
  ) : (
    <h1>НЕ ВОРК</h1>
  );
}
