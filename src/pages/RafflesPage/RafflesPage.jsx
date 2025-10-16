

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

export default function RafflesPage() {
  const raffles = [
    { id: "rare", name: "Rare NFT 🌟", cost: 3 },
    { id: "legend", name: "Legend NFT 🔥", cost: 5 },
    { id: "epic", name: "Epic NFT 💎", cost: 8 },
  ];

  return (
    <div className={styles.Container}>
      <h2 className={styles.Title}>NFT Raffles</h2>
      <p className={styles.Description}>
        Use tickets to join raffles and win exclusive NFT rewards!
      </p>

      {raffles.map((raffle) => (
        <div key={raffle.id} className={styles.Card}>
          <h3>{raffle.name}</h3>
          <p>{raffle.cost} 🎟</p>
          <Link to={`/raffles/${raffle.id}`} className={styles.JoinButton}>
            JOIN
          </Link>
        </div>
      ))}

      <p className={styles.Tickets}>You have <span>10</span> tickets</p>
    </div>
  );
}