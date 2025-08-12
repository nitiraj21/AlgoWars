"use client";
import { motion } from "framer-motion";


export default function Winner({ winner }: any) {
  if (!winner) {
    return (
      <div className="text-center mt-10 text-2xl text-white animate-pulse font-mono">
        🧠 Match Finished! Calculating results...
      </div>
    );
  }
  const name = winner.user.username;
  const score = winner.score;

  return (
<>
<motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-center "
    >
      {/* Match Finished Header - Matching room styling */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-200 mb-2">
          Match Finished!
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
      </div>

      {/* Winner Announcement - Clean and minimal like room page */}
      <div className="bg-[#151820] rounded-2xl border border-[#2d3138] p-8 mb-6 relative overflow-hidden">
        {/* Subtle glow effect */}
        
        <div className="relative z-10">
          <p className="text-lg text-gray-300 mb-4 font-medium">
            The winner is
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-5xl md:text-6xl font-bold text-white tracking-tight">
              {name}
            </div>
            <div className="text-4xl">🏆</div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-xl">
            <span className="text-gray-300">Score:</span>
            <span className="text-white font-bold text-2xl">{score}</span>
          </div>
        </div>
      </div>
    </motion.div>
</>
  );
}
