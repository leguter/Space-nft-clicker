import { useState } from "react";
import HomePage from "./pages/HomePage/HomePage";
import EarnPage from "./pages/EarnPage/EarnPage";
import RafflesPage from "./pages/RafflesPage/RafflesPage";
import BoostersPage from "./pages/BoostersPage/BoostersPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import "./App.css";
export default function App() {
  const [page, setPage] = useState("home");
  const [balance, setBalance] = useState(0);
  const [tapCount, setTapCount] = useState(0);

  const onTap = () => {
    setBalance((b) => b + 1);
    setTapCount((t) => t + 1);
  };

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage balance={balance} onTap={onTap} tapCount={tapCount} />;
      case "earn":
        return <EarnPage />;
      case "raffles":
        return <RafflesPage />;
      case "boosters":
        return <BoostersPage />;
      case "profile":
        return <ProfilePage balance={balance} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="parent-container">
      <div className="your-content">
      <div className="p-4 flex-1">{renderPage()}</div>

      <div className="menu">
        <button onClick={() => setPage("home")}>🏠</button>
        <button onClick={() => setPage("earn")}>💎</button>
        <button onClick={() => setPage("raffles")}>🎁</button>
        <button onClick={() => setPage("boosters")}>⚡</button>
        <button onClick={() => setPage("profile")}>👤</button>
      </div>
      </div>
    </div>
  );
}
