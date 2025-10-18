
import { useState } from "react";
import styles from "./ProfilePage.module.css";

export default function ProfilePage({ user }) {
  const [isCopied, setIsCopied] = useState(false);

  // Припускаємо, що назва вашого телеграм-бота "your_bot_name". Замініть на актуальну.
  const botUrl = "https://t.me/Durovu_bot";
  // Припускаємо, що посилання для підписки на телеграм-канал "your_channel_name". Замініть на актуальну.
  const telegramChannelUrl = "https://t.me/SpaceClicker";

  const handleCopyLink = () => {
    // Створюємо реферальне посилання
    const referralLink = `${botUrl}?start=${user.user.telegramId}`; // Використовуйте telegram_id, це надійніше

    // --- ПОЧАТОК НОВОЇ ЛОГІКИ КОПІЮВАННЯ ---

    // 1. Створюємо тимчасовий елемент <textarea>
    const textArea = document.createElement("textarea");
    textArea.value = referralLink;

    // 2. Ховаємо його, щоб користувач не бачив
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";

    // 3. Додаємо елемент на сторінку
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      // 4. Намагаємось скопіювати текст
      const successful = document.execCommand('copy');
      if (successful) {
        setIsCopied(true); // Показуємо "Copied!"
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        // Якщо не вдалося, можна показати помилку
        console.error('Fallback: Oops, unable to copy');
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    // 5. Видаляємо тимчасовий елемент
    document.body.removeChild(textArea);

    // --- КІНЕЦЬ НОВОЇ ЛОГІКИ КОПІЮВАННЯ ---
  };


  // console.log(user);

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
            <input type="text" value={`${botUrl}?start=${user.user.telegramId}`} readOnly />
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

// import { useState } from "react";
// import styles from "./ProfilePage.module.css";

// export default function ProfilePage({ user }) {
// const [isCopied, setIsCopied] = useState(false);

// // 🔗 Посилання на бота та канал — заміни на свої реальні
// const botUrl = "https://t.me/Durovu_bot";
// const telegramChannelUrl = "https://t.me/SpaceClicker";

// // ✅ Генерація реферального посилання
// const referralLink = `${botUrl}?start=${user.user?.telegram_id}`;

// // 📋 Копіювання лінка
// const handleCopyLink = async () => {
// try {
// await navigator.clipboard.writeText(referralLink);
// setIsCopied(true);
// setTimeout(() => setIsCopied(false), 2000);
// } catch (err) {
// console.error("Помилка копіювання:", err);
// }
// };

// if (!user) return <h1>НЕ ВОРК</h1>;

// return ( <div className={styles.Container}> <div className={styles.Card}>
// {user.user.photo_url ? ( <img src={user.user.photo_url} className={styles.Photo} alt="User" />
// ) : ( <div className={styles.Avatar}></div>
// )}
//     <h2 className={styles.Name}>{user.user.first_name || "Space User"}</h2>
//     <p className={styles.Id}>@{user.user.username}</p>

//     <div className={styles.Stats}>
//       <div>
//         <span className={styles.StatNumber}>{user.user.referrals || 0}</span>
//         <p>Referrals</p>
//       </div>
//       <div>
//         <span className={styles.StatNumber}>{user.user.balance}⭐</span>
//         <p>Total Earned</p>
//       </div>
//       <div>
//         <span className={styles.StatNumber}>{user.user.tickets || 0}🎫</span>
//         <p>Tickets</p>
//       </div>
//     </div>

//     <div className={styles.ReferralSection}>
//       <h3>Your Referral Link</h3>
//       <p>Invite a friend and get 3 tickets for the draw!</p>

//       <div className={styles.ReferralLinkBox}>
//         <input type="text" value={referralLink} readOnly />
//         <button onClick={handleCopyLink} className={styles.CopyButton}>
//           {isCopied ? "Copied!" : "Copy"}
//         </button>
//       </div>
//     </div>

//     <div className={styles.TelegramSection}>
//       <a
//         href={telegramChannelUrl}
//         target="_blank"
//         rel="noopener noreferrer"
//         className={styles.TelegramButton}
//       >
//         Subscribe to Telegram
//       </a>
//       <p>Subscribe to our channel to receive bonuses!</p>
//     </div>
//   </div>
// </div>

// );
// }


