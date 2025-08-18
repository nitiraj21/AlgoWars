"use client";

import React from "react";


const ComparisonTable = () => {
  const features = [
    {
      feature: "Room Creation",
      codeclash: "✅ Randomized questions to ensure fairness",
      others: "❌ Host selects questions (possible bias)",
    },
    {
      feature: "Question Settings",
      codeclash: "✅ Choose number of questions, difficulty, and timer",
      others: "❌ Limited or no control",
    },
    {
      feature: "Real-Time Multiplayer",
      codeclash: "✅ Built-in real-time competition",
      others: "⚠️ Partial / Limited",
    },
    {
      feature: "Leaderboard & Rankings",
      codeclash: "✅ Live leaderboard updates",
      others: "⚠️ Not always live / delayed",
    },
    {
      feature: "Gamified Experience",
      codeclash: "✅ Competitive & engaging",
      others: "⚠️ Minimal / Lacking",
    },
    {
      feature: "Customization for Players",
      codeclash: "✅ Difficulty & time controls for balance",
      others: "❌ Very limited",
    },
    {
      feature: "Focus on Practice + Fun",
      codeclash: "✅ Designed for both skill growth & fun",
      others: "❌ More formal / practice-only",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-25 mb-28 mx-5 rounded-2xl shadow-lg border-2 border-slate-600 py-5 overflow-hidden z-50
     bg-gradient-to-r from-gray-700/15 to-gray-500/15 backdrop-blur-xl cursor-pointer
     transform hover:scale-103 transition-transform duration-400 ease-in-out hover:shadow-[0_0_40px_10px_rgba(80,120,200,0.2)]
     ">
        <div className="">
            <h1 className="text-2xl md:text-5xl mt-4 mb-5 font-xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                Why Choose AlgoWars?
            </h1>
        </div>
        <div>
            <table>
                <thead>
                <tr >
                    <th className="text-xl md:text-3xl font-medium py-3 px-4 text-left bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                        Features
                    </th>
                    <th className="text-xl md:text-3xl font-medium py-3 px-4 text-left bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                        AlgoWars
                    </th>
                    <th className="text-xl md:text-3xl font-medium py-3 px-4 text-left bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                        Other Platforms
                    </th>
                </tr>
                </thead>
                <tbody>
                    {features.map((row, idx)=>(
                        <tr
                            className=""
                            key={idx}>
                                <td className="py-3 px-4 text-slate-200 text-sm font-small md:text-lg md:font-medium ">{row.feature}</td>
                                <td className="py-3 px-4 text-slate-200 text-sm font-small md:text-lg md:font-medium">{row.codeclash}</td>
                                <td className="py-3 px-4 text-slate-200 text-sm font-small md:text-lg md:font-medium">{row.others}</td>
                            </tr>
                    ))}
                </tbody>
            </table>
        </div>
    
    </div>

  );
};

export default ComparisonTable;
