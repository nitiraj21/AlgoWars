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



export default function RoomPage() {

  const { width, height } = useWindowSize();
  const params = useParams();
  const roomCode = params?.roomid as string | null;
  const { room, session, isLoading, error, startMatch, socketRef, winner  } = useRoomSocket(roomCode); 
  console.log(winner)
  const router = useRouter()

  if (isLoading) return <div className="text-center mt-10">Loading room...</div>;

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
      
      />
  );
  }

  if(room.status == RoomStatus.FINISHED){
    const sortedParticipants = [...room.participants].sort((a, b) => b.score - a.score);
    const winnerFromLeaderboard = sortedParticipants.length > 0 ? sortedParticipants[0] : null;

    const finalWinner = winner || winnerFromLeaderboard;

    return(
      <div className="bg-[#0a0f1a] min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient overlay matching room theme */}
      <div className="absolute inset-0 opacity-90"></div>
      
  
      <Confetti width={width} height={height} numberOfPieces={200} recycle={false} />
      
      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-4">
        {/* Main Winner Card - Matching room page styling */}
        <div className="bg-[#212429] rounded-2xl border border-[#2d3138] shadow-2xl p-8 backdrop-blur-sm">
          
          {/* Winner Section */}
          <div className="text-center mb-8 animate-slide-up">
            <Winner winner={finalWinner} />
          </div>
  
          <div className="animate-slide-up delay-100">
            <div className="bg-[#151820] rounded-xl border border-[#2d3138] p-6">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Final Standings</h2>
              <Leaderboard participants={room.participants} />
            </div>
          </div>
  
          <div className="flex justify-center gap-4 mt-8 animate-slide-up delay-200">
            <Button
              text="Exit to Home"
              onClick={() => router.push("/")}
              Class="bg-[#2d3138] hover:bg-[#373c45] text-white font-semibold py-3 px-8 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-lg border border-[#3d4248]"
            />
          </div>
        </div>
      </div>
    </div>

    )
  }
  return(
      <InProgressRoom
        room={room}
        session={session}
        roomCode={roomCode}
        socketRef={socketRef}
        />
  );
}
