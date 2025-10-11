
import styles from "./ProfilePage.module.css";

export default function ProfilePage({user}) {
  document.getElementById('debug-output').textContent = JSON.stringify(user,null, 2);
  return (
    user ? (
<div className={styles.Container}>
      <div className={styles.Card}>
        <div className={styles.Avatar}></div>
        <h2 className={styles.Name}>{user}</h2>
        <p className={styles.Id}>@username</p>

        <div className={styles.Stats}>
          <div>
            <span className={styles.StatNumber}>12</span>
            <p>Referrals</p>
          </div>
          <div>
            <span className={styles.StatNumber}>480⭐</span>
            <p>Total Earned</p>
          </div>
          <pre id="debug-output" style="word-wrap: break-word; white-space: pre-wrap; color: white;"></pre>
        </div>
      </div>
    </div>
    ) : (
      <h1>НЕ ВОРК</h1>
    )
    
  );
}
