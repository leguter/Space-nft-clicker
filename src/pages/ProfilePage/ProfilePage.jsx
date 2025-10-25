
// import { useState } from "react";
// import styles from "./ProfilePage.module.css";
// import { useOutletContext } from "react-router-dom";
// export default function ProfilePage({ user }) {
//   const [isCopied, setIsCopied] = useState(false);
//  const { referrals } = useOutletContext();
//   // Припускаємо, що назва вашого телеграм-бота "your_bot_name". Замініть на актуальну.
//   const botUrl = "https://t.me/Durovu_bot";
//   // Припускаємо, що посилання для підписки на телеграм-канал "your_channel_name". Замініть на актуальну.
//   const telegramChannelUrl = "https://t.me/SpaceClicker";

//   const handleCopyLink = () => {
//     // Створюємо реферальне посилання
//     const referralLink = `${botUrl}?start=${user.user.telegramId}`; // Використовуйте telegram_id, це надійніше

//     // --- ПОЧАТОК НОВОЇ ЛОГІКИ КОПІЮВАННЯ ---

//     // 1. Створюємо тимчасовий елемент <textarea>
//     const textArea = document.createElement("textarea");
//     textArea.value = referralLink;

//     // 2. Ховаємо його, щоб користувач не бачив
//     textArea.style.position = "fixed";
//     textArea.style.top = "0";
//     textArea.style.left = "0";
//     textArea.style.width = "2em";
//     textArea.style.height = "2em";
//     textArea.style.padding = "0";
//     textArea.style.border = "none";
//     textArea.style.outline = "none";
//     textArea.style.boxShadow = "none";
//     textArea.style.background = "transparent";

//     // 3. Додаємо елемент на сторінку
//     document.body.appendChild(textArea);
//     textArea.focus();
//     textArea.select();

//     try {
//       // 4. Намагаємось скопіювати текст
//       const successful = document.execCommand('copy');
//       if (successful) {
//         setIsCopied(true); // Показуємо "Copied!"
//         setTimeout(() => setIsCopied(false), 2000);
//       } else {
//         // Якщо не вдалося, можна показати помилку
//         console.error('Fallback: Oops, unable to copy');
//       }
//     } catch (err) {
//       console.error('Fallback: Oops, unable to copy', err);
//     }

//     // 5. Видаляємо тимчасовий елемент
//     document.body.removeChild(textArea);

//     // --- КІНЕЦЬ НОВОЇ ЛОГІКИ КОПІЮВАННЯ ---
//   };


//   // console.log(user);

//   return user ? (
//     <div className={styles.Container}>
//       <div className={styles.Card}>
//         {user.user.photoUrl ? (
//           <img src={user.user.photoUrl} className={styles.Photo} alt="User" />
//         ) : (
//           <div className={styles.Avatar}></div>
//         )}
//         <h2 className={styles.Name}>{user.user.firstName || "Space User"}</h2>
//         <p className={styles.Id}>@{user.user.username}</p>

//         <div className={styles.Stats}>
//           <div>
//             {/* Припускаємо, що кількість рефералів приходить з бекенду в user.user.referralsCount */}
//             <span className={styles.StatNumber}>{referrals || 0}</span>
//             <p>Referrals</p>
//           </div>
//           <div>
//             <span className={styles.StatNumber}>{user.user.balance}⭐</span>
//             <p>Total Earned</p>
//           </div>
//           <div>
//             {/* Припускаємо, що кількість тікетів приходить з бекенду в user.user.ticketsCount */}
//             <span className={styles.StatNumber}>{user.user.tickets || 0}🎫</span>
//             <p>Tickets</p>
//           </div>
//         </div>

//         <div className={styles.ReferralSection}>
//           <h3>Your Referral Link</h3>
//           <p>Invite a friend and get 3 tickets for the draw!</p>
//           <div className={styles.ReferralLinkBox}>
//             <input type="text" value={`${botUrl}?start=${user.user.telegramId}`} readOnly />
//             <button onClick={handleCopyLink} className={styles.CopyButton}>
//               {isCopied ? "Copied!" : "Copy"}
//             </button>
//           </div>
//         </div>

//         <div className={styles.TelegramSection}>
//             <a href={telegramChannelUrl} target="_blank" rel="noopener noreferrer" className={styles.TelegramButton}>
//                 Subscribe to Telegram
//             </a>
//             <p>Subscribe to our channel to receive bonuses!</p>
//         </div>
//       </div>
//     </div>
//   ) : (
//     <h1>НЕ ВОРК</h1>
//   );
// }

import { useState } from "react";
import styles from "./ProfilePage.module.css";
import { useOutletContext } from "react-router-dom";
import api from "../../utils/api"; // твій api helper

export default function ProfilePage({ user }) {
  const [isCopied, setIsCopied] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const { referrals } = useOutletContext();

  const botUrl = "https://t.me/Durovu_bot";
  const telegramChannelUrl = "https://t.me/SpaceClicker";

  const handleCopyLink = () => {
    const referralLink = `${botUrl}?start=${user.user.telegramId}`;
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDeposit = async (amount) => {
    try {
      const res = await api.post("/deposit/create_invoice", { amount });
      if (res.data?.invoice_link) {
        window.open(res.data.invoice_link, "_blank");
      }
    } catch (err) {
      console.error("Deposit error:", err);
      alert("Failed to create invoice.");
    }
  };

  if (!user) return <h1>НЕ ВОРК</h1>;

  return (
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
            <span className={styles.StatNumber}>{referrals || 0}</span>
            <p>Referrals</p>
          </div>

          <div>
            <span className={styles.StatNumber}>
              {user.user.balance}⭐
            </span>
            <p>Total Clicked</p>
          </div>

          <div>
            <span className={styles.StatNumber}>
              {user.user.internal_stars || 0}💫
              <button
                className={styles.PlusButton}
                onClick={() => setShowDeposit(true)}
              >
                +
              </button>
            </span>
            <p>Internal Stars</p>
          </div>
        </div>

        <div className={styles.ReferralSection}>
          <h3>Your Referral Link</h3>
          <p>Invite a friend and get 3 tickets for the draw!</p>
          <div className={styles.ReferralLinkBox}>
            <input
              type="text"
              value={`${botUrl}?start=${user.user.telegramId}`}
              readOnly
            />
            <button onClick={handleCopyLink} className={styles.CopyButton}>
              {isCopied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className={styles.TelegramSection}>
          <a
            href={telegramChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.TelegramButton}
          >
            Subscribe to Telegram
          </a>
          <p>Subscribe to our channel to receive bonuses!</p>
        </div>
      </div>

      {showDeposit && (
        <div className={styles.ModalOverlay} onClick={() => setShowDeposit(false)}>
          <div
            className={styles.DepositModal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Deposit Internal Stars</h3>
            <p>Select amount to deposit:</p>
            <div className={styles.AmountGrid}>
              {[10, 50, 100, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  className={styles.AmountButton}
                  onClick={() => handleDeposit(amount)}
                >
                  {amount} ⭐
                </button>
              ))}
            </div>
            <button
              className={styles.CloseButton}
              onClick={() => setShowDeposit(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
