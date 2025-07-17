'use client'

import authOptions from "@/src/lib/auth";
import { getSession, useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RoomPage() {
  const params = useParams();
  const [roomid, setRoomid] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };

    fetchSession();
  }, []);
  
  interface Room {
    name: string;
    host: { name: string };
    participants: { id: string; user: { username: string }; role: string }[];
    questions: {
      id: string;
      title: string;
      description?: string;
      difficulty?: string;
    }[];
  }

  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setRoomid(resolvedParams.roomid as string);
    };
    
    resolveParams();
  }, [params]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`/api/findroom/${roomid}`);
        const data = await res.json();
        
        if (data.error) {
          console.error("Room not found:", data.error);
          return;
        }
        
        setRoom(data);
      } catch (err) {
        console.error("Failed to fetch room:", err);
      }
    };

    if (roomid) fetchRoom();
  }, [roomid]);

  if (!room) return <div className="text-center mt-10">Loading room...</div>;
  const currUser = session?.user?.name;
  const currentParticipant = room.participants.find(p => p.user.username === currUser);
  const isHost = currentParticipant?.role === 'host';


  return  (
    <div  >
        <div className="flex justify-center">
            <h1>Room: {room.name}</h1>
            <h1>Room: {session?.user?.name}</h1>
        </div>
        <div>
            <ul>
                {room.participants.map(p => (
                <li key={p.id}>{p.user.username} ({p.role})</li>
                ))}
            </ul>
            <ul>
                {room.questions.map(q => (
                <li key={q.id}>{q.title}</li>
                ))}
            </ul>
        </div>
        <div className="flex justify-center">
             {isHost && <button className="cursor-pointer">Start Match</button>}
        </div>
    </div>
  )}
  