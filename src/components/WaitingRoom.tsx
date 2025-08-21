
import ParticipantList from "@/src/components/ParticipantList";
import Button from "@/src/components/button";
import Questions from "@/src/components/Questions";
import { Room, RoomStatus } from "../types/global";
import { Session } from "next-auth";
interface WaitingProps {
    room : Room;
    session : Session | null;
    handleStartMatch : ()=>void;
    isHost : boolean;

}

export default function WaitingRoom({room, session, handleStartMatch, isHost}: WaitingProps){

    return (
<div className="p-6 max-w-5xl mx-auto text-white bg-[#121315] min-h-screen min-w-screen">
  {/* Room Info Header */}
  <div className="flex flex-col md:flex-row justify-between items-center 
                  bg-[#1c1d21] 
                  rounded-xl p-6 mb-8 shadow-lg border border-gray-700">
    <h1 className="text-2xl font-bold">Room: <span className="text-slate-300">{room.name}</span></h1>
    <h1 className="text-2xl font-bold ">Status: 
      <span className={`ml-2 px-3 py-1 rounded-lg text-sm 
                        ${room?.status === RoomStatus.WAITING 
                          ? "bg-green-600/20 text-green-400 border border-green-500/40" 
                          : "bg-yellow-600/20 text-yellow-400 border border-yellow-500/40"}`}>
        {room.status}
      </span>
    </h1>
    <h1 className="text-xl font-medium">User: <span className="text-gray-300">{session?.user?.name}</span></h1>
  </div>

  {/* Participants & Questions */}
  <div className="grid md:grid-cols-2 gap-8">
    <div className="bg-[#1c1d21] rounded-xl p-6 shadow-md border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Participants</h2>
      <ParticipantList
        participants={room.participants}
        hostName={room.host.name}
        currentUserUsername={session?.user?.name}
      />
    </div>

    <div className="bg-[#1c1d21] rounded-xl p-6 shadow-md border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Questions</h2>
      <Questions questions={room.questions} />
    </div>
  </div>

  {/* Host Controls */}
  <div className="flex justify-center mt-10">
    {isHost && (
      <Button
        onClick={handleStartMatch}
        Class={" text-lg backdrop-blur-xl bg-[#1c1d21]  mt-3 mr-3 hover:bg-gradient-to-r from-gray-500/15 to-gray-500/15"}
      
        text= {"Start Match"}
      />
    )}
  </div>
</div>

    )
}