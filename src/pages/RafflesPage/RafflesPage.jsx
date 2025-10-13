// // eslint-disable-next-line no-unused-vars
// import { motion } from "framer-motion";
// import styles from "./RafflesPage.module.css";

// export default function RafflesPage() {
//   return (
//     <div className={styles.Container}>
//       <div className={styles.Card}>
//         <h2 className={styles.Title}>NFT Raffles</h2>
//         <p className={styles.Subtitle}>Join raffles and win exclusive NFT rewards!</p>

//         <div className={styles.RaffleList}>
//           <div className={styles.RaffleItem}>
//             <h3>Rare Crypto Cat 🐱</h3>
//             <p>Entry cost: 25⭐</p>
//             <motion.button whileTap={{ scale: 0.9 }} className={styles.BtnJoin}>
//               JOIN
//             </motion.button>
//           </div>
//           <div className={styles.RaffleItem}>
//             <h3>Legendary Hamster 🐹</h3>
//             <p>Entry cost: 100⭐</p>
//             <motion.button whileTap={{ scale: 0.9 }} className={styles.BtnJoin}>
//               JOIN
//             </motion.button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import  { Component } from "react";
import RaffleCard from "../../components/RafflesCard/RafflesCard";
import styles from "./Raffles.module.css";

class RafflesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userTickets: 10, // стартові квитки
      raffles: [
        { id: 1, name: "Rare NFT", icon: "🌟", ticketCost: 3 },
        { id: 2, name: "Legend NFT", icon: "🔥", ticketCost: 5 },
        { id: 3, name: "Epic NFT", icon: "💎", ticketCost: 8 },
      ],
    };
  }

  joinRaffle = (raffle) => {
    const { userTickets } = this.state;
    if (userTickets >= raffle.ticketCost) {
      this.setState({ userTickets: userTickets - raffle.ticketCost });
      alert(`You joined the ${raffle.name} raffle!`);
    } else {
      alert("Not enough tickets!");
    }
  };

  render() {
    const { userTickets, raffles } = this.state;

    return (
      <div className={styles.container}>
        <h2 className={styles.title}>NFT Raffles</h2>
        <p className={styles.description}>
          Use tickets to join raffles and win exclusive NFT rewards!
        </p>

        {raffles.map((r) => (
          <RaffleCard
            key={r.id}
            raffle={r}
            userTickets={userTickets}
            onJoin={this.joinRaffle}
          />
        ))}

        <div className={styles.userTickets}>
          You have <span>{userTickets}</span> tickets
        </div>
      </div>
    );
  }
}

export default RafflesPage;
