import React from 'react';
import styles from './Navigation.module.css';

type NavigationProps = {
  onOpenLeaderboard: () => void;
};

const Navigation: React.FC<NavigationProps> = ({ onOpenLeaderboard }) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.gameName}>Minesweeper</h1>
      <button onClick={onOpenLeaderboard} className={styles.openButton}>
        🏆 Leaderboard
      </button>
    </div>
  );
};

export default Navigation;
