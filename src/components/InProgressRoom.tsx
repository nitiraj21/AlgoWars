'use client'
import React from "react";
import { useState, useEffect } from "react";
import { difficulty, Room } from "../types/global";
import { Editor } from "@monaco-editor/react";
import Timer from "./Timer";
import Button from "./button";
import ParticipantList from "./ParticipantList";
import { Session } from "next-auth";

import { getSession } from "next-auth/react";
import { useRoomSocket } from "../hooks/useRoomSocket";

interface InProgressProps {
  room : Room;
  session : Session | null;
  roomCode : string | null
  socketRef: React.MutableRefObject<any>;
}

export default function InProgressRoom({room, session, roomCode, socketRef} : InProgressProps) {

    if ( room.questions.length === 0) {
        return <div className="text-center mt-10">Loading question...</div>;
    }
    
    const [currentQuestionIndex, setQuestionIndex] = useState(0);
    const [language, setLanguage] = useState('javascript'); 
    const [code, setCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [output, setOutput] = useState('');
    useEffect(() => {
      const currentQuestion = room.questions[currentQuestionIndex];
      
      if (currentQuestion.StarterCode && typeof currentQuestion.StarterCode === 'object') {
          const starter = (currentQuestion.StarterCode as any)[language];
          setCode(starter || `// No starter code available for ${language}.`);
      } else {
          setCode('// Starter code not found.');
      }
  }, [currentQuestionIndex, language, room.questions]); 

    const handleSubmit = async() => {
      setIsSubmitting(true);
      setOutput('Executing...');

      try{
        const res = await fetch('/api/submit', {
          method : 'POST',
          headers : {'Content-Type' : 'application/json'},
          body : JSON.stringify({
            code : code,
            language : language,
            questionId : room.questions[currentQuestionIndex].id,
          })
        });

        const data = await res.json();

        if(res.ok){
          setOutput(`Status: ${data.status.description}` )
          let points = 0
          if(currentQuestion.difficulty === difficulty.EASY){
             points = 5;
          }
          else if(currentQuestion.difficulty === difficulty.MEDIUM){
            points = 10;
          }
          else{
            points = 15;
          }
          if (data.status.description === 'Accepted') {
            console.log("submission sent")
            socketRef.current?.emit('correct-submission', {
              roomCode: roomCode,
              userEmail: session?.user?.email,
              points: points 
            });
          }
        }
        else{
          setOutput(`Error: ${data.error || 'Failed to submit'}`);
        }
      }
      catch(err){
        setOutput('An unexpected error occurred.');
      }
      finally{
        setIsSubmitting(false);
        room.participants.sort()
      }
    }    
    
    const currentQuestion = room.questions[currentQuestionIndex];
    const displayTestCases = Array.isArray(currentQuestion.testCases) ? currentQuestion.testCases[0] : currentQuestion.testCases;

    return (
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Match in Progress...</h1>
            {room.matchStartedAt && <Timer startTime={room.matchStartedAt} />}
          </div>
          <div className="flex md:justify-between gap-8">
            <div className="p-4 border rounded-lg" key={currentQuestion.id}>
              <h2 className="text-2xl font-semibold mb-2">{currentQuestion.title}</h2>
              <p className="mb-4">{currentQuestion.description}</p>
              <span className="text-sm font-medium bg-gray-200 text-gray-800 px-2 py-1 rounded">{currentQuestion.difficulty}</span>
              <h3 className="font-semibold mt-4 mb-2">Test Case:</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                {`Input: ${JSON.stringify(displayTestCases.Input)}\nOutput: ${JSON.stringify(displayTestCases.Output)}`}
              </pre>
            </div>
            <div>
              <div  className="border rounded-lg w-70vh" > 
              <Editor
                height="60vh"
                width= "70vh"
                
                language={language} 
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                }}
              />
              </div>
              <div className="mt-4 flex items-center gap-4">
                <Button
                  onClick={handleSubmit}
                  text={isSubmitting ? 'Submitting...' : 'Submit Code'}

                />
              </div>
              <div className="mt-4 p-4 bg-gray-900 text-white rounded-md font-mono">
                <h3 className="font-bold text-gray-400 mb-2">Output:</h3>
                <pre className="whitespace-pre-wrap">{output}</pre>
              </div>
            </div>  
            <div>
              {[...room.participants] // 1. Create a copy of the array
              .sort((a, b) => b.score - a.score) // 2. Sort by score, highest first
              .map(p => ( // 3. Now map over the sorted array
               <div key={p?.user?.username} className="p-2 bg-gray-100 rounded flex justify-between items-center mb-2">
                <span>{p?.user?.username}</span>
                <span className={`px-2 py-1 rounded text-sm`}>
                  {p.score}
                </span>
              </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-8">
            {currentQuestionIndex > 0 && (
              <Button onClick={() => setQuestionIndex(prev => prev - 1)} text="Previous" />
            )}
            {currentQuestionIndex < room.questions.length - 1 && 
              <Button onClick={() => setQuestionIndex(prev => prev + 1)} text="Next" />
            }
          </div>
        </div>
    )
}
