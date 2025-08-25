"use client";
import { motion } from "framer-motion";


export default function Winner({ winner }: any) {
  if (!winner) {
    return (
      <div className="text-center mt-5 text-2xl text-white animate-pulse font-mono">
        🧠 Match Finished! Calculating results...
      </div>
    );
  }
  const name = winner.user.username;
  const score = winner.score;

  return (
    <div className="mt-5 text-center">
    <div className="inline-block">
      <div className="text-gray-500 text-sm font-light tracking-wider mb-2">
        CHAMPION
      </div>
      <div className="text-4xl font-light tracking-wider text-yellow-400 mb-2">
        {name}
      </div>
      <div className="text-2xl font-light tracking-wider text-gray-400">
        Score : {score} 
      </div>
      <div className="w-32 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent mt-4 mx-auto"></div>
    </div>
  </div>
  );
}
