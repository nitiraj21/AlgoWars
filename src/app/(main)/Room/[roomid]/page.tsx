'use client';
import { useParams } from "next/navigation";
import {RoomStatus} from '@/src/types/global';
import WaitingRoom from "@/src/components/WaitingRoom";
import InProgressRoom from "@/src/components/InProgressRoom";;
import { useRoomSocket } from "@/src/hooks/useRoomSocket";


export default function RoomPage() {
  const params = useParams();
  const roomCode = params?.roomid as string | null;
  const { room, session, isLoading, error, startMatch, socketRef } = useRoomSocket(roomCode); 
  console.log("ROOM OBJECT IN PAGE:", room); 

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
  return(
      <InProgressRoom
        room={room}
        session={session}
        roomCode={roomCode}
        socketRef={socketRef}
        />
  );
}
