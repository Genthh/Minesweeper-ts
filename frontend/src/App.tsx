import { useEffect, useState } from 'react';
import Leaderboard from './component/Leaderboard/Leaderboard';
import Game from './component/Game/Game';
import Login from './component/Login/Login';

function App() {
  const [playerInitials, setPlayerInitials] = useState<string | null>(null);

  useEffect(() => {
    const storedInitials = localStorage.getItem('minesweeperInitials');
    if (storedInitials && storedInitials.length === 3) {
      setPlayerInitials(storedInitials);
    }
  }, []);

  const handleLogin = (initials: string) => {
    const clean = initials.trim().toUpperCase();
    if (clean.length === 3) {
      localStorage.setItem('minesweeperInitials', clean);
      setPlayerInitials(clean);
    }
  };

  return (
    <div>
      {playerInitials ? (
        <>
          <Leaderboard />
          <Game />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
