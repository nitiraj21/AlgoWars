import React from "react";
import { difficulty } from "../types/global";
type Question=  {
    id: string;
    constraints : string,
    title: string;
    description?: string;
    difficulty?: difficulty;
    testCases : {
      Input : string,
      Output : string,
      target? : string
    }
  };

  type QuestionsList = {
    questions : Question[]
  }


export default function Questions( {questions}: QuestionsList){
    return (
<div className="bg-[#1c1d21] rounded-xl p-6 shadow-md border border-gray-700">
  <h2 className="text-xl font-semibold mb-4">
    Questions <span className="text-gray-400">({questions.length})</span>
  </h2>
  <div className="space-y-3">
    {questions.map((q) => (
      <div
        key={q.id}
        className="p-4 bg-[#2a2b31] rounded-lg border border-gray-700 
                   hover:bg-[#34363c] transition-colors"
      >
        <div className="font-medium mb-1">{q.title}</div>
        {q.difficulty && (
          <span
            className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border
              ${
                q.difficulty === "EASY"
                  ? "bg-green-600/20 text-green-400 border-green-500/40"
                  : q.difficulty === "MEDIUM"
                  ? "bg-yellow-600/20 text-yellow-400 border-yellow-500/40"
                  : "bg-red-600/20 text-red-400 border-red-500/40"
              }`}
          >
            {q.difficulty}
          </span>
        )}
      </div>
    ))}
  </div>
</div>)
}