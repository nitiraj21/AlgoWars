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
        <div>
          <h2 className="font-bold text-lg mb-3">Questions ({questions.length}):</h2>
          <div className="space-y-2">
            {questions.map(q => (
              <div key={q.id} className="p-2 bg-gray-100 rounded">
                <div className="font-medium">{q.title}</div>
                {q.difficulty && (
                  <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                    q.difficulty === 'EASY' ? 'bg-green-200 text-green-800' :
                    q.difficulty === 'MEDIUM' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {q.difficulty}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>)
}