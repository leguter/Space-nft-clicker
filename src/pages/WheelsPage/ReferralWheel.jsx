import WheelBase from "./WheelBase";

const segments = [
  { label: "👥 Invite x2", type: "ref_boost", color: "linear-gradient(135deg, #33cc33, #00ff66)" },
  { label: "⭐ 10 Stars", type: "stars_10", color: "linear-gradient(135deg, #ffee00, #ffaa00)" },
  { label: "🎟 Ticket", type: "raffle_ticket", color: "linear-gradient(135deg, #3366ff, #00aaff)" },
  { label: "🎁 NFT Box", type: "nft", color: "linear-gradient(135deg, #ff0077, #ff55cc)" },
];

export default function ReferralWheel() {
  return <WheelBase title="REFERRAL WHEEL" segments={segments} apiEndpoint="/api/wheel/spin_referral" />;
}
