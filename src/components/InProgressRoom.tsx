'use client'
import React from "react";
import { useState, useEffect } from "react";
import { Room } from "../types/global";
import { Editor } from "@monaco-editor/react";
import Timer from "./Timer";
import Button from "./button";

export default function InProgressRoom({room}: { room: Room }) {
    // --- FIX: ADD THIS GUARD CLAUSE ---
    // If the room has no questions yet, show a loading state and stop.
    if ( room.questions.length === 0) {
        return <div className="text-center mt-10">Loading question...</div>;
    }
    // --- END OF FIX ---

    const [currentQuestionIndex, setQuestionIndex] = useState(0);
    const [language, setLanguage] = useState('javascript'); 
    const [code, setCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [output, setOutput] = useState('');
    
    useEffect(() => {
      const currentQuestion = room.questions[currentQuestionIndex];
      
      if (currentQuestion.StarterCode && typeof currentQuestion.StarterCode === 'object') {
          // Use the 'language' state as a key to get the correct starter code.
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
            functionName : room.questions[currentQuestionIndex].functionName
          })
        });

        const data = await res.json();

        if(res.ok){
          setOutput(`Status: ${data.status.description}` )
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
          <div className="grid md:grid-cols-2 gap-8">
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
              <div  className="border rounded-lg"> 
              <Editor
                height="60vh"
                
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
