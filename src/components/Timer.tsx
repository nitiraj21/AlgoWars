'use client';

import { useState, useEffect, useRef } from 'react';

type TimerProps = {
  endTime: string;
  onTimerEnd: () => void;
};

export default function Timer({ endTime, onTimerEnd }: TimerProps) {
  const getRemainingSeconds = () => {
    if (!endTime) return 0;
    
    const endDate = new Date(endTime).getTime();
    const now = Date.now();
    const difference = Math.floor((endDate - now) / 1000);
    return Math.max(0, difference); // Ensure never negative
  };

  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasEndedRef = useRef(false);

  // Reset timer when endTime changes
  useEffect(() => {
    if (endTime) {
      const initialSeconds = getRemainingSeconds();
      setRemainingSeconds(initialSeconds);
      hasEndedRef.current = false;
      
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Only start interval if there's time remaining
      if (initialSeconds > 0) {
        intervalRef.current = setInterval(() => {
          setRemainingSeconds(prevSeconds => {
            const newSeconds = Math.max(0, prevSeconds - 1);
            
            if (newSeconds === 0 && !hasEndedRef.current) {
              hasEndedRef.current = true;
              onTimerEnd();
            }
            
            return newSeconds;
          });
        }, 1000);
      } else if (!hasEndedRef.current) {
        // Timer already expired
        hasEndedRef.current = true;
        onTimerEnd();
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [endTime, onTimerEnd]);

  const formatTime = () => {
    // Ensure we never display negative values
    const safeSeconds = Math.max(0, remainingSeconds);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Don't render if no endTime provided
  if (!endTime) {
    return (
      <div className="text-2xl font-mono bg-slate-700 text-white px-4 py-1 rounded-lg">
        <span>--:--</span>
      </div>
    );
  }

  return (
    <div className="text-2xl font-mono bg-slate-700 text-white px-4 py-1 rounded-lg">
      <span>{formatTime()}</span>
    </div>
  );
}