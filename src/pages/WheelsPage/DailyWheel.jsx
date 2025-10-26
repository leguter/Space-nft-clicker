import WheelBase from "./WheelBase";

const segments = [
  { label: "⭐ 2 Stars", type: "stars_2", color: "linear-gradient(135deg, #ffcc00, #ff8800)" },
  { label: "💰 1 USDT", type: "usdt", color: "linear-gradient(135deg, #00ffcc, #0088ff)" },
  { label: "🎟 Ticket", type: "raffle_ticket", color: "linear-gradient(135deg, #2266ff, #22ccff)" },
  { label: "🔥 Boost 10%", type: "boost_small", color: "linear-gradient(135deg, #ff3366, #ff0066)" },
];

export default function DailyWheel() {
  return <WheelBase title="DAILY WHEEL" segments={segments} apiEndpoint="/api/wheel/spin_daily" />;
}
