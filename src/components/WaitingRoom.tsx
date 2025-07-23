
import ParticipantList from "@/src/components/ParticipantList";
import Button from "@/src/components/button";
import Questions from "@/src/components/Questions";
import { Room } from "../types/global";
import { Session } from "next-auth";
interface WaitingProps {
    room : Room;
    session : Session | null;
    handleStartMatch : ()=>void;
    isHost : boolean;

}

export default function WaitingRoom({room, session, handleStartMatch, isHost}: WaitingProps){

    return (
          <div className="p-6 max-w-4xl mx-auto">
              <div className="flex justify-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">Room: {room.name}</h1>
                <h1 className="text-2xl font-bold">Status: {room.status}</h1>
                <h1 className="text-2xl">User: {session?.user?.name}</h1>
              </div>
        
              <div className="grid md:grid-cols-2 gap-6">
                <ParticipantList
                  participants={room.participants}
                  hostName= {room.host.name}
                  currentUserUsername= {session?.user?.name}
        
                />
        
                <Questions
                  questions={room.questions}
                 />
              </div>
        
              <div className="flex justify-center gap-4 mt-8">
                {isHost && (
                  <Button
                  onClick={handleStartMatch}
                  text = "Start Match"
                  />
                )}
              </div>
            </div>
    )
}