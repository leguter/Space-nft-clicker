import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import styles from "./WheelPage.module.css";
import api from "../../utils/api";

export default function WheelPage() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [balance, setBalance] = useState(null);

  // 🔹 Сегменти рулетки
  const segments = [
    "🎟 Ticket",
    "🎟 Ticket",
    "🎟 Ticket",
    "🎟 Ticket",
    "🎟 Ticket",
    "🎟 Ticket",
    "🌟 5 Stars",
    "🎁 NFT Box",
  ];

  // 🔹 Ціна одного спіну у зірках
  const spinPrice = 10;

  const handleSpin = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    try {
      // 1️⃣ Створюємо інвойс через бекенд
      const response = await api.post("/api/wheel/create_invoice", { price: spinPrice });
      const { invoice } = response.data; // отримуємо об'єкт invoice для WebApp

      if (!invoice) throw new Error("Invoice not received");

      // 2️⃣ Відкриваємо меню Telegram WebApp для оплати зірками
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openInvoice(invoice);

        // Слухаємо подію закриття інвойсу (оплата підтверджена)
        const onPayment = async (payload) => {
          if (payload.status === "paid" || payload.success) {
            // 3️⃣ Виконуємо спін після успішної оплати
            const res = await api.post("/api/wheel/spin");
            const data = res.data;

            const index = getSegmentIndex(data.result.type);
            const randomExtra = Math.floor(Math.random() * 360);
            const newRotation = 360 * 5 + (360 / segments.length) * index + randomExtra;
            setRotation(rotation + newRotation);

            setTimeout(() => {
              setResult(data.result);
              setBalance(data.balance);
              setSpinning(false);
            }, 4000);
          } else {
            setSpinning(false);
          }

          window.Telegram.WebApp.offEvent("invoiceClosed", onPayment);
        };

        window.Telegram.WebApp.onEvent("invoiceClosed", onPayment);
      } else {
        alert("Telegram WebApp not available");
        setSpinning(false);
      }
    } catch (err) {
      console.error(err);
      alert("Payment or spin error");
      setSpinning(false);
    }
  };

  const getSegmentIndex = (type) => {
    switch (type) {
      case "raffle_ticket":
        return Math.floor(Math.random() * 6);
      case "stars":
        return 6;
      case "nft":
        return 7;
      default:
        return 0;
    }
  };

  return (
    <div className={styles.Container}>
      <div className={styles.Card}>
        <h2 className={styles.Title}>Wheel of Fortune</h2>
        <p className={styles.Subtitle}>Spin the wheel for awesome rewards!</p>

        <div className={styles.WheelContainer}>
          <div
            className={`${styles.Wheel} ${spinning ? styles.Spinning : ""}`}
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {segments.map((seg, i) => (
              <div
                key={i}
                className={styles.Segment}
                style={{
                  transform: `rotate(${(360 / segments.length) * i}deg) skewY(-45deg)`,
                }}
              >
                <span>{seg}</span>
              </div>
            ))}
          </div>
          <div className={styles.Pointer}></div>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          className={styles.BtnBuy}
          onClick={handleSpin}
          disabled={spinning}
        >
          {spinning ? "Spinning..." : `Spin (${spinPrice}⭐)`}
        </motion.button>

        {result && (
          <div className={styles.ResultBox}>
            🎉 You won:{" "}
            {result.type === "raffle_ticket"
              ? "🎟 1 Ticket"
              : result.type === "stars"
              ? "🌟 5 Stars"
              : "🎁 NFT Mystery Box"}
          </div>
        )}

        {balance !== null && <div className={styles.Balance}>⭐ Balance: {balance}</div>}
      </div>
    </div>
  );
}
