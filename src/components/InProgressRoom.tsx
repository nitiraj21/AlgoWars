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
import {
  PanelGroup, Panel, PanelResizeHandle,} from "react-resizable-panels";
import TestResultDisplay from "./TestResult";
import { useRouter } from "next/navigation";

//@ts-ignore
const LanguageSelector = ({ selectedLanguage, onSelect }) => {
    const languages = ['javascript', 'python', 'java', 'cpp'];
    return (
        <div className="flex space-x-2  bg-gradient-to-r from-gray-500/15 to-gray-500/15 backdrop-blur-xl p-2 rounded-lg shadow-sm ">
            {languages.map(lang => (
                <button
                    key={lang}
                    onClick={() => onSelect(lang)}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                        selectedLanguage === lang 
                        ? 'bg-slate-700 text-white' 
                        : ' bg-gradient-to-r from-gray-500/15 to-gray-500/15 backdrop-blur-xl text-gray-300 hover:bg-gray-800 cursor-pointer'
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
    const currentQuestion = room.questions[currentQuestionIndex];
    console.log(currentQuestion);
    const Description = currentQuestion.description
    const router  = useRouter();
    const [similarQuestion, setSimilarQuestion] = useState(-1);
    //@ts-ignore
    const newDesc = Description.split(".").map(s => s.trim()).filter(Boolean);
    useEffect(() => {
      

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
        let points = 15;
        if(currentQuestion.difficulty === 'EASY'){
          points = 5;
        }
        else if(currentQuestion.difficulty === 'MEDIUM'){
          points = 10;
        }
        if(data.overallStatus === 'Accepted' && currentQuestionIndex != similarQuestion){
          setSimilarQuestion(currentQuestionIndex);
          socketRef.current?.emit('correct-submission', {
            roomCode: roomCode,
            userEmail: session?.user?.email,
            points: points 
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
    
    const displayTestCases = Array.isArray(currentQuestion.testCases) ? currentQuestion.testCases[0] : currentQuestion.testCases;
   

    return (
        <div className="sm:h-full w-full p-3 mr-3  bg-[#121315] md:pt-1 pl-6 mr-6 min-h-screen ">

            <div className="w-auto grid grid-row justify-center items-center m-10 lg:mr-60 sm:grid grid-row-3 lg:flex justify-center items-center gap-6 my-8 lg:ml-60 md:pl-10">
                    <LanguageSelector selectedLanguage={language} onSelect={setLanguage} />
                    <Button
                      onClick={handleSubmit}
                      text={isSubmitting ? 'Submitting...' : 'Submit Code'}
                      Class = {"bg-slate-700 text-white hover:bg-slate-500"}
  
                    />
                     <header className="flex justify-center items-center ">
                      {room.matchEndedAt && <Timer endTime={room.matchEndedAt} onTimerEnd={()=>{if(room) room.status = RoomStatus.FINISHED}}/>}
                    </header>
                    <div className="flex justify-center gap-4 ">
                    <Button
  onClick={() => {
    setQuestionIndex(prev => prev - 1);
    setOutput("");
  }}
  text="&larr;"
  Class="bg-slate-700 text-white hover:bg-slate-500 text-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
  disabled={currentQuestionIndex === 0}
/>

<Button
  onClick={() => setQuestionIndex(prev => prev + 1)}
  text="&rarr;"
  Class="bg-slate-700 text-white hover:bg-slate-500 text-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
  disabled={currentQuestionIndex === room.questions.length - 1}
/>
<Button
            text="Exit Room"
            Class="px-3 py-2 bg-slate-700 text-white hover:bg-slate-500 couror-pointer"
            onClick={()=>{router.push("/dashboard")}}
            />

                    </div>
                </div>

          <div className="flex flex-col lg:flex-row gap-6 h-xl">
            <div className="sm:w-md mr-3 md:w-auto lg:w-3xl 
                p-6  
                overflow-y-auto
                bg-gradient-to-r from-gray-500/15 to-gray-500/15 
                backdrop-blur-xl border-2 border-slate-600 
                rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-3 text-white">{currentQuestion.title}</h2>
              <span className= {`text-sm  shadow-md ${currentQuestion.difficulty === 'EASY' ? 'bg-green-200 text-green-800' : currentQuestion.difficulty === 'MEDIUM' ? 'bg-yellow-400 text-yellow-800' : 'bg-red-200 text-red-800'} px-3 py-1 rounded-full`}>{currentQuestion.difficulty}</span>
              {currentQuestion.difficulty === 'EASY' && (<span className="px-3 py-1 ml-2 rounded-full bg-gray-200 text-sm">5 Points</span>)}
              {currentQuestion.difficulty === 'MEDIUM' && (<span className="px-3 py-1 ml-2 rounded-full bg-gray-200 text-sm">10 Points</span>)}
              {currentQuestion.difficulty === 'HARD' && (<span className="px-3 py-1 ml-2 rounded-full bg-gray-200 text-sm">15 Points</span>)}
              <div className="text-white">
      
                {newDesc.map((newDesc: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined , idx: React.Key | null | undefined) => (
                <span key={idx} className="block py-2 text-md font-fina ">{newDesc}.</span>
                ))}
              </div>
              <h3 className="font-semibold mt-6 mb-2 text-white">Test Case Example:</h3>
              <span className="p-4 rounded-lg text-md font-lg text-white mb-3">
                {`Input: ${JSON.stringify(displayTestCases.Input)}`}
              </span>
              <br></br>
              <br></br>
              <span className="p-4 rounded-lg text-md font-lg text-white">
                    {` Output: ${JSON.stringify(displayTestCases.Output)}`}
              </span>
              <div className="text-white">
                <h3 className="font-semibold mt-6 mb-2 text-white">Constraints</h3>
                <div className=" bg-[#212429] border  border-slate-600 rounded-lg">
                <p className="p-2 text-neutral-500">{currentQuestion.constraints}</p>
                </div>
              </div>
            </div>

            {/* Center Panel: Editor & Output */}
            <div className="mr-3 lg:w-2/3 flex flex-col gap-4">
              
                <div className="md : border-2 border-slate-600 rounded-xl overflow-hidden bg-[#2b2e33] shadow-lg"> 
                  <div className="bg-[#1e1e1e]"><span className="text-[#1e1e1e]">Editor</span></div>
                    <Editor
                      height="60vh"
                      language={language} 
                      theme="vs-dark"
                      value={code}
                      onChange={(value) => setCode(value || '')}
                      options={{ minimap: { enabled: false }, fontSize: 16 }}
                    />
                </div>
                <div className="p-4  bg-gradient-to-r from-gray-500/15 to-gray-500/15 backdrop-blur-xl text-white border-2 border-slate-600 rounded-xl  font-mono min-h-[150px] shadow-md">
                    <h3 className="font-bold text-gray-400 mb-2">Output</h3>
                    <TestResultDisplay result={ output } />
                </div>
            </div>

            {/* Right Panel: Leaderboard (Optional, can be merged or kept separate) */}
            <div className="sm : mr-3 lg:w-1/3  bg-gradient-to-r from-gray-500/15 to-gray-500/15 backdrop-blur-xl p-6 border-2 border-slate-600 rounded-xl shadow-md">
              <h3 className="font-bold text-xl mb-4 text-slate-200">Leaderboard</h3>
              <div className="space-y-3">
                <Leaderboard
                  participants={room.participants}
                />
              </div>
            </div>
          </div>
          
          
        </div>
    )
}