import express from 'express';
import cors from 'cors';
import leaderboardRoutes from './routes/leaderboardRoutes';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/leaderboard', leaderboardRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
