import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const getLeaderboard = async () => {
  const res = await API.get('/leaderboard');
  return res.data;
};

export const submitScore = async (initials: string, time: number) => {
    try {
      const res = await axios.post('http://localhost:3001/api/leaderboard', {
        initials,
        time
      });
      return res.data;
    } catch (err) {
      console.error('[API] Score submission failed:', err);
      throw err;
    }
  };
  
