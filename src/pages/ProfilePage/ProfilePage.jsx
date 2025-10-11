import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  return (
    <div className={styles.Container}>
      <div className={styles.Card}>
        <div className={styles.Avatar}></div>
        <h2 className={styles.Name}>CryptoUser</h2>
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
        </div>
      </div>
    </div>
  );
}
