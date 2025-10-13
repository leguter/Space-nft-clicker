
import styles from "./ProfilePage.module.css";

export default function ProfilePage({user}) {
  console.log(user)
  return (
    user ? (
<div className={styles.Container}>
      <div className={styles.Card}>
       {user.user.photoUrl ? <img src={user.user.photoUrl} className={styles.Photo}></img> : (<div className={styles.Avatar}></div>)} 
        <h2 className={styles.Name}>{user.user.firstName || "Space User"}</h2>
        <p className={styles.Id}>@{user.user.username}</p>

        <div className={styles.Stats}>
          <div>
            <span className={styles.StatNumber}>12</span>
            <p>Referrals</p>
          </div>
          <div>
            <span className={styles.StatNumber}>{user.user.balance}⭐</span>
            <p>Total Earned</p>
          </div>
        </div>
      </div>
    </div>
    ) : (
      <h1>НЕ ВОРК</h1>
    )
    
  );
}
