import { useEffect, useRef, useState } from 'react';

export function useTimer() {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0); 
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    if (startTime !== null) return;

    const now = Date.now();
    setStartTime(now);

    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - now);
    }, 50); // Update every 50ms
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const finalElapsed = Date.now() - (startTime || 0);
    return finalElapsed / 1000;
  };

  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStartTime(null);
    setElapsed(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formattedElapsed = (elapsed / 1000).toFixed(2); 

  return {
    start,
    stop,
    reset,
    elapsedSeconds: parseFloat(formattedElapsed),
    isRunning: startTime !== null,
  };
}
