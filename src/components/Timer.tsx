'use client';

import { useState, useEffect } from "react";
type TimerProp = {
    startTime : string;
}
export default function Timer({startTime} : TimerProp){
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(()=>{
        const startDate = new Date(startTime).getTime();
        const now = Date.now();
        const initialDifference = Math.floor((now - startDate) / 1000);
        setElapsedSeconds(initialDifference > 0 ? initialDifference : 0);


        const interval = setInterval(() => {
            setElapsedSeconds((prev) => prev + 1);
          }, 1000);

        return ()=> clearInterval(interval);

        
    },[startTime])

    const formatTime = () => {
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      };
    

      return (
        <div className="text-2xl font-mono bg-gray-800 text-white px-4 py-2 rounded-lg">
            <span>{formatTime()}</span>
        </div>
      )
}