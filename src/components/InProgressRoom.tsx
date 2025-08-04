'use client'
import React from "react";
import { useState, useEffect } from "react";
import { Room } from "../types/global";
import { Editor } from "@monaco-editor/react";
import Timer from "./Timer";
import Button from "./button";
import { Session } from "next-auth";
import { RoomStatus } from "@prisma/client";
import Leaderboard from "./Leaderboard";

// SubmissionResult component ke liye prop types define karein
interface SubmissionResultProps {
    result: {
        status?: string;
        overallStatus?: string;
        passedTests?: number;
        totalTests?: number;
        details?: any[];
    };
}

// Ek alag component jo results ko aache se display karega
const SubmissionResult = ({ result }: SubmissionResultProps) => {
    if (!result || !result.overallStatus) {
        return <pre className="whitespace-pre-wrap text-gray-400">{result?.status || 'Submit your code to see the result.'}</pre>;
    }

    const isAccepted = result.overallStatus === 'Accepted';

    return (
        <div>
            <p className="mb-2">
                <span className="font-semibold">Overall Status:</span> 
                <span className={`ml-2 font-bold ${isAccepted ? 'text-green-400' : 'text-red-400'}`}>
                    {result.overallStatus}
                </span>
            </p>
            <p>
                <span className="font-semibold">Tests Passed:</span> {result.passedTests} / {result.totalTests}
            </p>
            
            {!isAccepted && result.details && result.details.find(d => !d.passed) && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                    <h4 className="font-bold mb-2 text-yellow-400">Failed on Test Case #{result.details.findIndex(d => !d.passed) + 1}</h4>
                    {(() => {
                        const failedCase = result.details.find(d => !d.passed);
                        if (!failedCase) return null;
                        return (
                            <div>
                                <p className="font-semibold">Input:</p>
                                <pre className="bg-gray-800 p-2 rounded text-sm my-1">{failedCase.input}</pre>
                                <p className="mt-2 font-semibold">Expected Output:</p>
                                <pre className="bg-gray-800 p-2 rounded text-sm my-1 text-green-400">{failedCase.expectedOutput}</pre>
                                <p className="mt-2 font-semibold">Your Output:</p>
                                <pre className="bg-gray-800 p-2 rounded text-sm my-1 text-red-400">{failedCase.actualOutput}</pre>
                                {failedCase.stderr && (
                                    <>
                                        <p className="mt-2 font-semibold">Error (stderr):</p>
                                        <pre className="bg-gray-800 p-2 rounded text-sm my-1 text-red-500">{failedCase.stderr}</pre>
                                    </>
                                )}
                            </div>
                        );
                    })()}
                </div>
            )}
        </div>
    );
};

// Language selector ke liye ek alag component\
//@ts-ignore
const LanguageSelector = ({ selectedLanguage, onSelect }) => {
    const languages = ['javascript', 'python', 'java', 'cpp'];
    return (
        <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
            {languages.map(lang => (
                <button
                    key={lang}
                    onClick={() => onSelect(lang)}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                        selectedLanguage === lang 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
            ))}
        </div>
    );
};


export default function InProgressRoom({room, session, roomCode, socketRef}: any) {

    if ( !room.questions || room.questions.length === 0) {
        return <div className="text-center mt-10">Loading question...</div>;
    }
    
    const [currentQuestionIndex, setQuestionIndex] = useState(0);
    const [language, setLanguage] = useState('javascript'); 
    const [code, setCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [output, setOutput] = useState<any>(null);

    useEffect(() => {
      const currentQuestion = room.questions[currentQuestionIndex];
      if (currentQuestion.starterCode && typeof currentQuestion.starterCode === 'object') {
          const starter = (currentQuestion.starterCode as any)[language];
          setCode(starter || `// No starter code available for ${language}.`);
      } else {
          setCode('// Starter code not found.');
      }
    }, [currentQuestionIndex, language, room.questions]); 

    const handleSubmit = async() => {
      setIsSubmitting(true);
      setOutput({ status: 'Executing...' });

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
        setOutput(data);

        if(data.overallStatus === 'Accepted'){
          socketRef.current?.emit('correct-submission', {
            roomCode: roomCode,
            userEmail: session?.user?.email,
            points: 5 
          });
        }
      }
      catch(err){
        setOutput({ status: 'An unexpected error occurred.' });
      }
      finally{
        setIsSubmitting(false);
      }
    }    
    
    const currentQuestion = room.questions[currentQuestionIndex];
    const displayTestCases = Array.isArray(currentQuestion.testCases) ? currentQuestion.testCases[0] : currentQuestion.testCases;

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
          <header className="flex justify-between items-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">CodeClash Arena</h1>
            {room.matchEndedAt && <Timer endTime={room.matchEndedAt} onTimerEnd={()=>{if(room) room.status = RoomStatus.FINISHED}}/>}
          </header>

          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Left Panel: Problem Description */}
            <div className="lg:w-1/3 bg-white p-6 border rounded-xl shadow-sm">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900">{currentQuestion.title}</h2>
              <p className="mb-4 text-gray-600">{currentQuestion.description}</p>
              <span className="text-sm font-medium bg-gray-200 text-gray-800 px-3 py-1 rounded-full">{currentQuestion.difficulty}</span>
              <h3 className="font-semibold mt-6 mb-2 text-gray-800">Test Case Example:</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700">
                {`Input: ${JSON.stringify(displayTestCases.Input)}\nOutput: ${JSON.stringify(displayTestCases.Output)}`}
              </pre>
            </div>

            {/* Center Panel: Editor & Output */}
            <div className="lg:w-2/3 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <LanguageSelector selectedLanguage={language} onSelect={setLanguage} />
                    <Button
                      onClick={handleSubmit}
                      text={isSubmitting ? 'Submitting...' : 'Submit Code'}
  
                    />
                </div>
                <div className="border rounded-xl overflow-hidden shadow-lg"> 
                    <Editor
                      height="60vh"
                      language={language} 
                      theme="vs-dark"
                      value={code}
                      onChange={(value) => setCode(value || '')}
                      options={{ minimap: { enabled: false }, fontSize: 14 }}
                    />
                </div>
                <div className="p-4 bg-gray-900 text-white rounded-xl font-mono min-h-[150px] shadow-lg">
                    <h3 className="font-bold text-gray-400 mb-2">Output</h3>
                    <SubmissionResult result={output} />
                </div>
            </div>

            {/* Right Panel: Leaderboard (Optional, can be merged or kept separate) */}
            <div className="lg:w-1/4 bg-white p-6 border rounded-xl shadow-sm">
              <h3 className="font-bold text-xl mb-4 text-gray-900">Leaderboard</h3>
              <div className="space-y-3">
                <Leaderboard
                  participants={room.participants}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mt-6">
            {currentQuestionIndex > 0 && (
              <Button onClick={() => setQuestionIndex(prev => prev - 1)} text="&larr; Previous" />
            )}
            {currentQuestionIndex < room.questions.length - 1 && 
              <Button onClick={() => setQuestionIndex(prev => prev + 1)} text="Next &rarr;" />
            }
          </div>
        </div>
    )
}