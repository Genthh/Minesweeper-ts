import { useState } from 'react';
import styles from './Leaderboard.module.css';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import Navigation from '../Navigation/Navigation';
export default function Leaderboard() {
  const [isOpen, setIsOpen] = useState(false);
  const { leaderboard, loading, error } = useLeaderboard(isOpen ? undefined : undefined); 

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div style={{ textAlign: 'center' }}>
    <Navigation onOpenLeaderboard={openModal} />
      {isOpen && (
        <div className={styles.backdrop}>
          <div className={styles.modal}>
            <div className={styles.header}>
              <h2 className={styles.title}>🏆 Top 10 Fastest Wins</h2>
              <button onClick={closeModal} className={styles.close}>✖</button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>Failed to load leaderboard: {error.message}</p>}

            {!loading && !error && (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Initials</th>
                    <th>Time (s)</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.slice(0, 10).map((entry, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{entry.initials}</td>
                      <td>{entry.time}</td>
                      <td>{new Date(entry.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
