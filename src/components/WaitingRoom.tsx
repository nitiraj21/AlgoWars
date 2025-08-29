"use client";
import ParticipantList from "@/src/components/ParticipantList";
import Button from "@/src/components/button";
import Questions from "@/src/components/Questions";
import { Room, RoomStatus } from "../types/global";
import { Session } from "next-auth";
import { useState } from "react";
import Image from "next/image";

interface WaitingProps {
  room: Room;
  session: Session | null;
  handleStartMatch: () => void;
  isHost: boolean;
  isMatchLoading: boolean;
}

export default function WaitingRoom({ room, session, handleStartMatch, isHost, isMatchLoading }: WaitingProps) {
  const [startMatch, setStartMatch] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy room code: ', err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-white bg-[#121315] min-h-screen min-w-screen">
      {/* Room Info Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center 
                      bg-[#1c1d21] 
                      rounded-xl p-4 mb-8 shadow-lg border border-gray-700 gap-4">
        
        <div className="flex flex-col items-center lg:items-start">
          <h1 className="text-xl font-medium">
            Room: <span className="text-slate-300">{room.name}</span>
          </h1>
        </div>

        <div className="flex flex-col items-center">
          <h1 className="text-xl font-medium flex items-center gap-2">
            Room Code: <span className="text-slate-300 text-md">{room.code}</span>
            <button
              onClick={handleCopyCode}
              className="hover:bg-gray-600/20 rounded p-1 transition-colors cursor-pointer"
              title="Copy room code"
            >
              <img 
                src={'/cpy.png'} 
                height={25} 
                width={25} 
                alt="Copy"
                className="transition-all duration-200"
              />
            </button>
          </h1>
        </div>

        <div className="flex flex-col items-center">
          <h1 className="text-xl font-medium">
            Status: 
            <span className={`ml-2 px-2 py-1 rounded-lg text-sm 
                              ${room?.status === RoomStatus.WAITING 
                                ? "bg-green-600/20 text-green-400 border border-green-500/40" 
                                : "bg-yellow-600/20 text-yellow-400 border border-yellow-500/40"}`}>
              {room.status}
            </span>
          </h1>
        </div>

        <div className="flex flex-col items-center lg:items-end">
                            <div className='flex flex-col justify-between items-center'>  
                              <div className="rounded-3xl overflow-hidden mb-1">
                              <Image 
                                src={session?.user?.image || "/Profile.jpeg"} 
                                width={35} 
                                height={35} 
                                alt="profile"
                            /></div>
                            <div className="text-gray-300">{session?.user?.name}</div></div>
            
        </div>
      </div>

      {/* Participants & Questions */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-[#1c1d21] rounded-xl p-6 shadow-md border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-center">Participants</h2>
          <ParticipantList
            participants={room.participants}
            hostName={room.host.name}
            currentUserUsername={session?.user?.name}
          />
        </div>

        <div className="bg-[#1c1d21] rounded-xl p-6 shadow-md border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-center">Questions</h2>
          <Questions questions={room.questions} />
        </div>
      </div>

      {/* Host Controls */}
      <div className="flex justify-center">
        {isHost && (
          <button
            onClick={handleStartMatch}
            disabled={isMatchLoading}
            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white cursor-pointer 
                       font-semibold py-3 px-8 rounded-lg 
                       hover:from-gray-600 hover:to-gray-700 
                       transition-all duration-200 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isMatchLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Starting Match...
              </div>
            ) : (
              "Start Match"
            )}
          </button>
        )}
      </div>
    </div>
  );
}