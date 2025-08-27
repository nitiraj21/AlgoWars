//old frontend code

'use client';
import { useParams, useRouter } from "next/navigation";
import {RoomStatus} from '@/src/types/global';
import WaitingRoom from "@/src/components/WaitingRoom";
import InProgressRoom from "@/src/components/InProgressRoom";;
import { useRoomSocket } from "@/src/hooks/useRoomSocket";
import Winner from "@/src/components/Winner";
import Leaderboard from "@/src/components/Leaderboard";
import Button from "@/src/components/button";
import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";
import { LeaderboardWin } from "@/src/components/LeaderboardWin";



export default function RoomPage() {

  const { width, height } = useWindowSize();
  const params = useParams();
  const roomCode = params?.roomid as string | null;
  const {  room, 
    session, 
    isLoading, 
    error, 
    startMatch,
    forceFinishMatch, // For testing purposes
    socketRef, 
    winner,
    finalRankings,
    isMatchFinished,
    getCurrentUserStats,
    isCurrentUserWinner, isMatchLoading  } = useRoomSocket(roomCode); 
  console.log(winner)
  const router = useRouter()

  if (isLoading) return <div className="bg-black min-h-screen flex items-center justify-center"> <div className="animate-spin rounded-full h-16 w-16 border-5 border-white border-t-transparent mr-2"></div>;</div>

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }
  
  if (!room) {
    return <div className="text-center mt-10">Room does not exist.</div>;
  }

  const currUser = session?.user?.name;
  const currentParticipant = room.participants.find(p => p?.user?.username === currUser);
  const isHost = currentParticipant?.role === 'host';


  if(room.status == RoomStatus.WAITING){
    
  return (
      <WaitingRoom
        room = {room}
        session = {session}
        handleStartMatch = {startMatch}
        isHost = {isHost}
        isMatchLoading = {isMatchLoading}
      
      />
  );
  }
  if(room.status == RoomStatus.IN_PROGRESS){
    return(
        <InProgressRoom
          room={room}
          session={session}
          roomCode={roomCode}
          socketRef={socketRef}
          />
    );}
  //old frontend
  if(room.status == RoomStatus.FINISHED){
    const sortedParticipants = [...room.participants].sort((a, b) => b.score - a.score);
    const winnerFromLeaderboard = sortedParticipants.length > 0 ? sortedParticipants[0] : null;

    const finalWinner = winner || winnerFromLeaderboard;

    return(
      <div className="bg-[#121315] min-h-screen flex  justify-center px-4 relative overflow-hidden">
      <Confetti width={width ?? undefined} height={height ?? undefined} numberOfPieces={200} recycle={false} />
      
      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-4 my-20">
        {/* Main Winner Card - Matching room page styling */}
          
          {/* Winner Section */}
          <div className="text-center mb-8 animate-slide-up">
          <header className="text-center mb-6">
          <h1 className="text-7xl font-mono tracking-wider mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            RESULTS
          </h1>
          <div className="w-24 h-px bg-white mx-auto mb-8"></div>
          <p className="text-slate-400 font-light text-lg tracking-wide">
            Room: {room.name}
          </p>
          <p className="text-gray-500 text-md mt-2">
            {room.participants.length || 0} participants
          </p>
        </header>
            <Winner winner={finalWinner} />
          </div>

          <div className="animate-slide-up delay-100">

              <LeaderboardWin participants={room.participants}/>

          </div>
  
          <div className="flex justify-center gap-4 mt-8 animate-slide-up delay-200">
            <Button
              text="Exit to Home"
              onClick={() => router.push("/dashboard")}
              Class="bg-[#2d3138] hover:bg-[#373c45] text-white font-semibold py-3 px-8 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-lg"
            />
          </div>
      </div>
    </div>

    )
  }
}
