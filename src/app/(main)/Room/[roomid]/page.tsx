'use client'

import { useParams } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { getSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import { Room, Participant, RoomStatus  } from '@/src/types/global';
import ParticipantList from "@/src/components/ParticipantList";
import Button from "@/src/components/button";
import Questions from "@/src/components/Questions";
import { Editor } from "@monaco-editor/react";


export default function RoomPage() {
  const params = useParams();
  const [roomid, setRoomid] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const socketRef = useRef<Socket | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [currentQuestionIndex, setQuestionIndex] = useState(0);

  // Callback to fetch initial room data
  const fetchRoom = useCallback(async (currentRoomId: string) => {
    try {
      const res = await fetch(`/api/findroom/${currentRoomId}`);
      const data = await res.json();
      if (data.error) {
        setRoom(null);
        return;
      }
  
      setRoom(data); 
    } catch (err) {
      setRoom(null);
    }
  }, []);

  // Get session data once on component mount
  useEffect(() => {
    const retrieveSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };
    retrieveSession();
  }, []);

  // Get room ID from URL parameters
  useEffect(() => {
    const resolveRoomId = async () => {
      const resolved = await params;
      const roomId = resolved.roomid as string;
      setRoomid(roomId);
    };
    resolveRoomId();
  }, [params]);

  // Trigger initial room data fetch when roomid is available
  useEffect(() => {
    if (roomid) {
      fetchRoom(roomid);
    }
  }, [roomid, fetchRoom]);

  // Socket connection and event listeners
  useEffect(() => {
    if (!roomid || !session?.user?.name) {
      return; // Do not connect socket until roomid and session are available
    }

    let currentSocket = socketRef.current;

    // Initialize or re-use socket instance
    if (!currentSocket || !currentSocket.connected) {
      if (currentSocket) {
        currentSocket.removeAllListeners(); // Clean up old listeners
        currentSocket.disconnect(); // Disconnect if existing but not connected
      }
      currentSocket = io("http://localhost:5000", {
        transports: ['websocket'],
        timeout: 20000,
      });
      socketRef.current = currentSocket;
    } else {
      // If already connected, just ensure join-room is emitted in case of re-renders
      currentSocket.emit("join-room", roomid, session.user.name);
      return; // Exit to avoid re-registering listeners on an active socket
    }

    // Event: Socket connected
    currentSocket.on("connect", () => {
      // Once connected, immediately join the room on the server
      currentSocket?.emit("join-room", roomid, session.user.name);
    });

    // Event: Room user list updated by server
    currentSocket.on("room-users-updated", (usernames: string[]) => {
      setRoom(prevRoom => {
        if (!prevRoom) {
          return prevRoom; // Room data not available yet, wait for initial fetch
        }

        // Map usernames from socket event to Participant objects, preserving existing roles/ids
        const newParticipants = usernames.map(username => {
          const existing = prevRoom.participants.find(p => p.user.username === username);
          if (existing) {
            return existing; // Use existing participant object if found
          } else {
            // Create new participant object for a newly joined user
            return {
              id: username,
              user: { username },
              role: username === prevRoom.host.name ? "host" as const : "participant" as const 
            };
          }
        });

        // Update the room state, triggering a re-render of the participant list
        return {
          ...prevRoom,
          participants: newParticipants
        };
      });
    });

    // Event: Connection errors
    currentSocket.on("connect_error", (error) => {
      console.error("Connection error:", error); // Keeping this for critical errors
    });

    // Event: Socket disconnected
    currentSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason); // Keeping this for important status changes
    });

    // Event: Socket reconnected
    currentSocket.on("reconnect", (attemptNumber) => {
      // Re-emit join-room on reconnect to ensure server updates room membership
      if (roomid && session?.user?.name) {
        currentSocket.emit("join-room", roomid, session.user.name);
      }
    });

    // Event: Match started (if your game logic emits this)
    currentSocket.on('match-started', () => {
      setRoom(prevRoom => prevRoom ? { ...prevRoom, status: RoomStatus.IN_PROGRESS } : null);
    });

    // Cleanup function for useEffect (runs when component unmounts or dependencies change)
    return () => {
      if (currentSocket) {
        currentSocket.removeAllListeners(); // Remove all listeners to prevent memory leaks
        if (currentSocket.connected) {
          currentSocket.disconnect(); // Disconnect only if currently connected
        }
      }
      socketRef.current = null;
    };
  }, [roomid, session?.user?.name, fetchRoom]); // Dependencies for useEffect

  // Display loading state if room data is not yet available
  if (!room) return <div className="text-center mt-10">Loading room...</div>;

  const currUser = session?.user?.name;
  const currentParticipant = room.participants.find(p => p.user.username === currUser);
  const isHost = currentParticipant?.role === 'host';

  // Handler for "Start Match" button
  const handleStartMatch = () => {
    if (socketRef.current && roomid) {
      console.log("🎮 Starting match for room:", roomid); 
      socketRef.current.emit('start-match', roomid);
      ()=>{
        console.log("match started");
        
      }
    }
  };

  if(room.status == RoomStatus.WAITING){
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
  );
}

  return(
  <div>
    <div>
        <div className="flex justify-start items-center">
          <div key={room.questions[currentQuestionIndex].id}>
            <h2>{room.questions[currentQuestionIndex].title}</h2>
            <p>{room.questions[currentQuestionIndex].description}</p>
            <span>{room.questions[currentQuestionIndex].difficulty}</span>
            <br/>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(room.questions[currentQuestionIndex].testCases, null, 2)}
            </pre>
          </div>
          <div className="w-1/2">
          <div className="mb-6 mt-10 rounded-lg overflow-hidden shadow-md" style={{ height: '400px' }}>
                <Editor
                  height="100%"
                  language={"Java"} 
                  theme="vs-dark" // Or 'light' or a custom theme
                  value={"code"} // Bind editor value to the code state
                  //  // Update code state on change
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    automaticLayout: true, // Important for responsiveness
                  }}
                />
              </div>
          </div>  
        </div>
        <div>
          {currentQuestionIndex<room.questions.length-1 && 
          <button
            onClick={()=>{
              setQuestionIndex(prevIndex => prevIndex+1)
            }}
          >next</button>}
          {currentQuestionIndex>0 && (<div>
            <button
              onClick={()=>{
                setQuestionIndex(prevIndex => prevIndex-1);
              }}
            >prev</button>
          </div>)}
        </div>
    </div>
  </div>);


}
