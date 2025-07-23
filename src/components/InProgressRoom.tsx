
'use client'
import React from "react";
import { useState } from "react";
import { Room } from "../types/global";
import { Editor } from "@monaco-editor/react";

export default function InProgressRoom({room}: { room: Room }) {
    const [currentQuestionIndex, setQuestionIndex] = useState(0);
    return (
        <div>
    <div>
        <div className="flex justify-start items-center">
          <div key={room.questions[currentQuestionIndex].id}>
            <h2>{room.questions[currentQuestionIndex].title}</h2>
            <p>{room.questions[currentQuestionIndex].description}</p>
            <span>{room.questions[currentQuestionIndex].difficulty}</span>
            <br/>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(room.questions[currentQuestionIndex].testCases, null, 2)}
            </pre>
          </div>
          <div className="w-1/2">
          <div className="mb-6 mt-10 rounded-lg overflow-hidden shadow-md" style={{ height: '400px' }}>
                <Editor
                  height="100%"
                  language={"Java"} 
                  theme="vs-dark"
                  value={"code"}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    automaticLayout: true, 
                  }}
                />
              </div>
          </div>  
        </div>
        <div>
          {currentQuestionIndex<room.questions.length-1 && 
          <button
            onClick={()=>{
              setQuestionIndex(prevIndex => prevIndex+1)
            }}
          >next</button>}
          {currentQuestionIndex>0 && (<div>
            <button
              onClick={()=>{
                setQuestionIndex(prevIndex => prevIndex-1);
              }}
            >prev</button>
          </div>)}
        </div>
    </div>
  </div>
    )
}