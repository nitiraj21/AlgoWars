'use client';

import { useState, useEffect } from 'react';

type TimerProps = {
  endTime: string; // Database se aane wala ISO string timestamp
  onTimerEnd: () => void; // Timer 0 hone par chalne wala function
};

export default function Timer({ endTime, onTimerEnd }: TimerProps) {
  // Helper function jo shuruaati bache hue seconds calculate karta hai
  const getRemainingSeconds = () => {
    const endDate = new Date(endTime).getTime();
    const now = Date.now();
    // FIX: Milliseconds ko seconds mein badalne ke liye 1000 se divide karein.
    const difference = Math.floor((endDate - now) / 1000);
    return difference > 0 ? difference : 0;
  };

  // State ko sahi initial calculation se shuru karein
  const [remainingSeconds, setRemainingSeconds] = useState(getRemainingSeconds);

  useEffect(() => {
    // Yeh interval har second, bache hue time ko 1 se ghatata hai.
    // Yeh baar-baar calculate karne se behtar hai aur smooth chalta hai.
    const interval = setInterval(() => {
      setRemainingSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(interval);
          onTimerEnd(); // Timer khatam hone par callback call karein
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    // Cleanup function: Component unmount hone par interval ko saaf karein
    return () => clearInterval(interval);
  }, [endTime, onTimerEnd]);

  const formatTime = () => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="text-2xl font-mono bg-gray-800 text-white px-4 py-2 rounded-lg">
      <span>{formatTime()}</span>
    </div>
  );
}
