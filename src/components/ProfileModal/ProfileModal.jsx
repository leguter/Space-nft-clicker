// src/components/ProfileModal.jsx
import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/api";
import styles from "./ProfileModal.module.css";

export default function ProfileModal({ isOpen, onClose }) {
  const [profile, setProfile] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem("lang") || "ua");

  useEffect(() => {
    if (isOpen) fetchProfile();
  }, [isOpen]);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/user/me");
      setProfile(res.data);
    } catch (err) {
      console.error("Помилка при завантаженні профілю:", err);
    }
  };

  const handleLanguageChange = () => {
    const newLang = language === "ua" ? "en" : "ua";
    setLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  const handleWithdraw = async () => {
    alert("Функція виводу зірок ще в розробці 🌟");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.modal}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 80 }}
          >
            <div className={styles.header}>
              <h2>👤 Профіль</h2>
              <button className={styles.closeBtn} onClick={onClose}>✖</button>
            </div>

            {profile ? (
              <div className={styles.content}>
                <div className={styles.infoBlock}>
                  <p><strong>ID:</strong> {profile.telegramId}</p>
                  <p><strong>Ім'я:</strong> {profile.username}</p>
                  <p><strong>Зірки:</strong> ⭐ {profile.stars}</p>
                  <p><strong>Тікети:</strong> 🎟 {profile.tickets}</p>
                </div>

                <div className={styles.section}>
                  <h3>NFT 🎁</h3>
                  {profile.user.nfts?.length ? (
                    <div className={styles.nftGrid}>
                      {profile.nfts.map((nft, i) => (
                        <div key={i} className={styles.nftCard}>
                          <img src={nft.image} alt={nft.name} />
                          <p>{nft.name}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Поки що NFT не знайдено 😢</p>
                  )}
                </div>

                <div className={styles.buttons}>
                  <button onClick={handleLanguageChange}>
                    🌐 Мова: {language.toUpperCase()}
                  </button>
                  <button onClick={handleWithdraw}>💸 Вивести зірки</button>
                </div>
              </div>
            ) : (
              <p>Завантаження...</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
