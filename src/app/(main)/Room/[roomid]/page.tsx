'use client';
import { useParams } from "next/navigation";
import {RoomStatus} from '@/src/types/global';
import WaitingRoom from "@/src/components/WaitingRoom";
import InProgressRoom from "@/src/components/InProgressRoom";;
import { useRoomSocket } from "@/src/hooks/useRoomSocket";
import Winner from "@/src/components/Winner";
import Leaderboard from "@/src/components/Leaderboard";


export default function RoomPage() {
  const params = useParams();
  const roomCode = params?.roomid as string | null;
  const { room, session, isLoading, error, startMatch, socketRef, winner  } = useRoomSocket(roomCode); 
  console.log(winner)

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

    // Use the real-time winner if it exists, otherwise use the derived one.
    const finalWinner = winner || winnerFromLeaderboard;

    return(
      <div>
            <div>
                <Winner winner = {finalWinner}/>
            </div>
            <div className="max-w-64">
                <Leaderboard 
                    participants={room.participants}
                />
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
