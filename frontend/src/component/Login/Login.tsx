import { useState } from 'react';
import styles from './Login.module.css';

type LoginProps = {
  onLogin: (initials: string) => void;
};

const Login = ({ onLogin }: LoginProps) => {
  const [initials, setInitials] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanInitials = initials.trim().toUpperCase();
    if (cleanInitials.length !== 3) {
      alert('Initials must be exactly 3 characters.');
      return;
    }

    onLogin(cleanInitials);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Enter Your Initials</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          value={initials}
          maxLength={3}
          onChange={(e) => setInitials(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Start Game
        </button>
      </form>
    </div>
  );
};

export default Login;
