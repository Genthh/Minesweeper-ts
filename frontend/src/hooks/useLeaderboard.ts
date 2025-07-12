import { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/api';

export type LeaderboardEntry = {
  initials: string;
  time: number;
  date: string;
};

type UseLeaderboardResult = {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: Error | null;
};

export function useLeaderboard(initialsFilter?: string): UseLeaderboardResult {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: LeaderboardEntry[] = await getLeaderboard();
        const sorted = data.sort((a, b) => a.time - b.time); 

        const filtered = initialsFilter
          ? sorted.filter(entry => entry.initials === initialsFilter.toUpperCase())
          : sorted;

        setLeaderboard(filtered);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialsFilter]);

  return { leaderboard, loading, error };
}
