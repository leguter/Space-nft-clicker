

// import  { Component } from "react";
// import RaffleCard from "../../components/RafflesCard/RaffleCard";
// import styles from "./RafflesPage.module.css";

// class RafflesPage extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       userTickets: 10, // стартові квитки
//       raffles: [
//         { id: 1, name: "Rare NFT", icon: "🌟", ticketCost: 3 },
//         { id: 2, name: "Legend NFT", icon: "🔥", ticketCost: 5 },
//         { id: 3, name: "Epic NFT", icon: "💎", ticketCost: 8 },
//       ],
//     };
//   }

//   joinRaffle = (raffle) => {
//     const { userTickets } = this.state;
//     if (userTickets >= raffle.ticketCost) {
//       this.setState({ userTickets: userTickets - raffle.ticketCost });
//       alert(`You joined the ${raffle.name} raffle!`);
//     } else {
//       alert("Not enough tickets!");
//     }
//   };

//   render() {
//     const { userTickets, raffles } = this.state;

//     return (
//       <div className={styles.container}>
//         <h2 className={styles.title}>NFT Raffles</h2>
//         <p className={styles.description}>
//           Use tickets to join raffles and win exclusive NFT rewards!
//         </p>

//         {raffles.map((r) => (
//           <RaffleCard
//             key={r.id}
//             raffle={r}
//             userTickets={userTickets}
//             onJoin={this.joinRaffle}
//           />
//         ))}

//         <div className={styles.userTickets}>
//           You have <span>{userTickets}</span> tickets
//         </div>
//       </div>
//     );
//   }
// }

// export default RafflesPage;

import { Link } from "react-router-dom";
import styles from "./RafflesPage.module.css";
import rafflesData from "../../data/rafflesData";

export default function RafflesPage() {
  const userTickets = 10;

  return (
    <div className={styles.Container}>
      <h2 className={styles.Title}>NFT Raffles</h2>
      <p className={styles.Description}>
        Join raffles and win exclusive <span className={styles.Highlight}>NFT rewards!</span>
      </p>

      <div className={styles.RafflesList}>
        {rafflesData.map((raffle) => (
          <div
            key={raffle.id}
            className={styles.Card}
            style={{ borderImage: `${raffle.gradient} 1` }}
          >
            <div className={styles.CardHeader}>
              <h3>{raffle.title}</h3>
              <p className={styles.TicketsCost}>{raffle.cost} 🎟</p>
            </div>
            <Link
              to={`/raffles/${raffle.id}`}
              className={styles.JoinButton}
              style={{ background: raffle.gradient }}
            >
              JOIN
            </Link>
          </div>
        ))}
      </div>

      <p className={styles.Tickets}>
        You have <span>{userTickets}</span> tickets
      </p>
    </div>
  );
}
