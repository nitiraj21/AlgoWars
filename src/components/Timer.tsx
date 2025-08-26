'use client';

import { useState, useEffect } from 'react';

type TimerProps = {
  endTime: string;
  onTimerEnd: () => void;
};

export default function Timer({ endTime, onTimerEnd }: TimerProps) {
  const getRemainingSeconds = () => {
    const endDate = new Date(endTime).getTime();
    const now = Date.now();
    const difference = Math.floor((endDate - now) / 1000);
    return difference > 0 ? difference : 0;
  };

 
  const [remainingSeconds, setRemainingSeconds] = useState(getRemainingSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(interval);
          onTimerEnd(); 
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, onTimerEnd]);

  const formatTime = () => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="text-2xl font-mono bg-slate-700 text-white px-4 py-1 rounded-lg">
      <span>{formatTime()}</span>
    </div>
  );
}
