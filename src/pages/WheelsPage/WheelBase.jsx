import { useState } from "react";
import { motion } from "framer-motion";
import api from "../../utils/api";
import styles from "./WheelsPage.module.css";

export default function WheelBase({ title, segments, apiEndpoint }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);

  const spinSound = new Audio("https://actions.google.com/sounds/v1/foley/spinning_coin.ogg");
  const winSound = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");

  const getSegmentIndex = (type) => {
    const index = segments.findIndex((s) => s.type === type);
    return index !== -1 ? index : 0;
  };

  const spin = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    try {
      const res = await api.post(apiEndpoint);
      const data = res.data;

      const degreesPerSegment = 360 / segments.length;
      const prizeIndex = getSegmentIndex(data.result.type);
      const prizeAngle = prizeIndex * degreesPerSegment + degreesPerSegment / 2;
      const stopRotation = 5 * 360 + prizeAngle;

      setRotation(stopRotation);

      spinSound.play();
      setTimeout(() => {
        winSound.play();
        setResult(data.result);
        setSpinning(false);
      }, 4200);
    } catch (err) {
      console.error(err);
      alert("Spin error");
      setSpinning(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.wheelWrapper}>
        <div className={styles.pointer}></div>
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.33, 1, 0.68, 1] }}
          className={styles.wheel}
        >
          {segments.map((p, i) => {
            const angle = 360 / segments.length;
            const skew = 90 - angle;
            return (
              <div
                key={i}
                className={styles.segment}
                style={{
                  transform: `rotate(${i * angle}deg) skewY(-${skew}deg)`,
                  background: p.color,
                }}
              >
                <span
                  className={styles.segmentSpan}
                  style={{
                    transform: `skewY(${skew}deg) rotate(${angle / 2 + 180}deg)`,
                  }}
                >
                  {p.label}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>

      <button onClick={spin} disabled={spinning} className={styles.spinButton}>
        {spinning ? "Крутиться..." : "Крутить"}
      </button>

      {result && <p className={styles.resultBox}>🎉 Ви виграли: {result.label}</p>}
    </div>
  );
}
