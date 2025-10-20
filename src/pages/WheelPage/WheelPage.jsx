import { useState } from "react";
import styles from "./WheelPage.module.css";
import api from "../../utils/api";

export default function WheelPage() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [balance, setBalance] = useState(null);

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

const spinWheel = async () => {
  if (spinning) return;
  setSpinning(true);
  setResult(null);

  try {
    // 1️⃣ Отримати інвойс від бекенду через POST
    const invoiceRes = await api.post("/api/wheel/create_invoice");
    if (!invoiceRes.data.success) throw new Error("Invoice failed");

    const invoice = invoiceRes.data.invoice; // або invoiceRes.data, якщо бекенд повертає root об'єкт

    // 2️⃣ Відкрити Telegram оплату
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openInvoice(invoice);

      const onPayment = async (payload) => {
        if (payload.status === "paid" || payload.success) {
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
    <div className={styles.container}>
      <h2 className={styles.title}>Wheel of Fortune</h2>

      <div className={styles.wheelContainer}>
        <div
          className={`${styles.wheel} ${spinning ? styles.spinning : ""}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {segments.map((seg, i) => (
            <div
              key={i}
              className={styles.segment}
              style={{
                transform: `rotate(${(360 / segments.length) * i}deg) skewY(-45deg)`,
              }}
            >
              <span>{seg}</span>
            </div>
          ))}
        </div>
        <div className={styles.pointer}></div>
      </div>

      <button
        className={styles.spinButton}
        onClick={spinWheel}
        disabled={spinning}
      >
        {spinning ? "Spinning..." : "Spin (10⭐)"}
      </button>

      {result && (
        <div className={styles.resultBox}>
          🎉 You won:{" "}
          {result.type === "raffle_ticket"
            ? "🎟 1 Ticket"
            : result.type === "stars"
            ? "🌟 5 Stars"
            : "🎁 NFT Mystery Box"}
        </div>
      )}

      {balance !== null && (
        <div className={styles.balance}>⭐ Balance: {balance}</div>
      )}
    </div>
  );
}
