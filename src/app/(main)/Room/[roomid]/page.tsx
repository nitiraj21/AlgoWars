'use client'

import { useParams } from "next/navigation";
import { useEffect, useRef, useState, useCallback }
 from "react";
import { getSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";

export default function RoomPage() {
  const params = useParams();
  const [roomid, setRoomid] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const socketRef = useRef<Socket | null>(null);
  const [socketStatus, setSocketStatus] = useState<string>('Disconnected');
  const [lastUpdate, setLastUpdate] = useState<string>('Never');

  interface Participant {
    id: string;
    user: { username: string };
    role: string;
  }

  interface Room {
    name: string;
    host: { name: string };
    participants: Participant[];
    questions: {
      id: string;
      title: string;
      description?: string;
      difficulty?: string;
    }[];
  }

  const [room, setRoom] = useState<Room | null>(null);

  const latestSocketParticipants = useRef<string[] | null>(null);

  // Callback to fetch room data (memoized)
  const fetchRoom = useCallback(async (currentRoomId: string) => {
    console.log("📡 Fetching room data for:", currentRoomId);
    try {
      const res = await fetch(`/api/findroom/${currentRoomId}`);
      const data = await res.json();
      if (data.error) {
        console.error("❌ Room not found:", data.error);
        setRoom(null);
        return;
      }
      console.log("✅ Room data fetched:", data);

      const initialParticipants = data.participants;
      let finalParticipants = initialParticipants;

      if (latestSocketParticipants.current) {
          console.log("Merging initial participants with latest socket participants:", latestSocketParticipants.current);
          const socketUsernames = new Set(latestSocketParticipants.current);
          const mergedParticipants: Participant[] = [];

          initialParticipants.forEach((p: Participant) => {
              if (socketUsernames.has(p.user.username)) {
                  mergedParticipants.push(p);
                  socketUsernames.delete(p.user.username);
              }
          });

          socketUsernames.forEach(username => {
              mergedParticipants.push({
                  id: username,
                  user: { username },
                  role: username === data.host.name ? "host" : "participant"
              });
          });

          finalParticipants = mergedParticipants;
      }
      
      setRoom({ ...data, participants: finalParticipants });

    } catch (err) {
      console.error("❌ Failed to fetch room:", err);
      setRoom(null);
    }
  }, []);

  // Get session data once
  useEffect(() => {
    const retrieveSession = async () => {
      console.log("🔍 Fetching session...");
      const sessionData = await getSession();
      console.log("📋 Session data:", sessionData);
      setSession(sessionData);
    };
    retrieveSession();
  }, []);

  // Get room ID from params
  useEffect(() => {
    const resolvedParams = async () => {
      const resolved = await params;
      const roomId = resolved.roomid as string;
      console.log("🏠 Room ID from params:", roomId);
      setRoomid(roomId);
    };
    resolvedParams();
  }, [params]);

  // Trigger initial fetch of room data when roomid is available
  useEffect(() => {
    if (roomid) {
      fetchRoom(roomid);
    }
  }, [roomid, fetchRoom]);

  // Socket connection
  useEffect(() => {
    console.log("🔄 Socket effect triggered");
    console.log("- roomid:", roomid);
    console.log("- session user:", session?.user?.name);

    if (!roomid || !session?.user?.name) {
      console.log("⏳ Waiting for roomid and session to connect socket...");
      return;
    }

    console.log("🚀 Starting socket connection...");
    setSocketStatus('Connecting...');

    // MODIFIED: Only create a new socket if one doesn't exist or is disconnected
    // This addresses the `socket = io(...)` from previous thought
    let currentSocket = socketRef.current;
    if (!currentSocket || !currentSocket.connected) {
      console.log("🆕 Creating new socket instance or reconnecting...");
      if (currentSocket) { // If it exists but is not connected, clean up listeners first
        currentSocket.removeAllListeners();
        currentSocket.disconnect();
      }
      currentSocket = io("http://localhost:5000", {
        transports: ['websocket'],
        timeout: 20000,
      });
      socketRef.current = currentSocket;
    } else {
      console.log("✅ Socket already connected, re-registering listeners if needed.");
      // If the socket is already connected, just ensure listeners are re-registered
      // and re-emit join-room to confirm membership if component re-renders
      currentSocket.emit("join-room", roomid, session.user.name);
      return; // Exit as socket is already managed
    }


    // ADDED: General Socket Event Listeners (for debugging)
    // Log all incoming events
    currentSocket.onAny((event, ...args) => {
        console.log(`🔍 Received socket event: ${event}`, args);
    });
    // Log all outgoing events
    currentSocket.onAnyOutgoing((event, ...args) => {
        console.log(`📤 Emitting socket event: ${event}`, args);
    });


    currentSocket.on("connect", () => {
      console.log("✅ Socket connected with ID:", currentSocket?.id);
      setSocketStatus('Connected');
      console.log(`🚪 Emitting join-room: ${roomid}, ${session.user.name}`);
      currentSocket?.emit("join-room", roomid, session.user.name);
      console.log("DEBUG: After emitting join-room. Socket ID for this client:", currentSocket?.id);
    });
    
    currentSocket.on("room-users-updated", (usernames: string[]) => {
      const timestamp = new Date().toLocaleTimeString();
      console.log(`👥 [${timestamp}] Received room-users-updated:`, usernames);
      setLastUpdate(timestamp);
    
      latestSocketParticipants.current = usernames;
    
      setRoom(prevRoom => {
        if (!prevRoom) {
          console.warn("⚠️ room-users-updated received but room data is not yet available, waiting for initial fetch. Current prevRoom:", prevRoom);
          return prevRoom;
        }
    
        console.log("DEBUG: Updating room participants from socket event.");
        const newParticipants = usernames.map(username => {
          const existing = prevRoom.participants.find(p => p.user.username === username);
          if (existing) {
            return existing;
          } else {
            return {
              id: username,
              user: { username },
              role: username === prevRoom.host.name ? "host" : "participant"
            };
          }
        });
    
        const updatedRoom = {
          ...prevRoom,
          participants: newParticipants
        };
    
        console.log("✅ Successfully updated room participants via socket event.");
        return updatedRoom;
      });
    });
    
    currentSocket.on("connect_error", (error) => {
      console.error("❌ Connection error:", error);
      setSocketStatus('Connection Error');
      console.log("DEBUG: connect_error fired for socket ID:", currentSocket?.id);
    });
    
    currentSocket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setSocketStatus('Disconnected');
      console.log("DEBUG: disconnect fired for socket ID:", currentSocket?.id, "Reason:", reason);
    });
    
    currentSocket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Reconnected after", attemptNumber, "attempts");
      setSocketStatus('Reconnected');
      if (roomid && session?.user?.name) {
        console.log("DEBUG: Re-emitting join-room on reconnect for socket ID:", currentSocket?.id);
        currentSocket.emit("join-room", roomid, session.user.name);
      }
    });

    // ADDED: Listener for 'match-started' if your server emits it
    currentSocket.on('match-started', () => {
      console.log('🎮 Match started received from socket.');
      setRoom(prevRoom => prevRoom ? { ...prevRoom, status: 'STARTED' } : null);
    });


    // Cleanup
    return () => {
      console.log(`🧹 Socket effect cleanup for ID: ${currentSocket?.id}`); // MODIFIED log
      if (currentSocket) { // Ensure socket exists before attempting to remove listeners/disconnect
        currentSocket.offAny(); // Remove onAny listener
        currentSocket.offAnyOutgoing(); // Remove onAnyOutgoing listener
        currentSocket.off("connect");
        currentSocket.off("room-users-updated");
        currentSocket.off("connect_error");
        currentSocket.off("disconnect");
        currentSocket.off("reconnect");
        currentSocket.off("match-started"); // ADDED: Cleanup for new listener
        
        // MODIFIED: Only disconnect if it's currently connected to avoid errors on already disconnected sockets
        if (currentSocket.connected) {
          currentSocket.disconnect();
        }
      }
      socketRef.current = null;
      setSocketStatus('Disconnected');
      console.log(`✅ Socket disconnected and cleaned up for ID: ${currentSocket?.id}`); // ADDED log
    };
  }, [roomid, session?.user?.name, fetchRoom]); // Added fetchRoom to dependencies

  if (!room) return <div className="text-center mt-10">Loading room...</div>;

  const currUser = session?.user?.name;
  const currentParticipant = room.participants.find(p => p.user.username === currUser);
  const isHost = currentParticipant?.role === 'host';

  const handleStartMatch = () => {
    if (socketRef.current && roomid) {
      console.log("🎮 Starting match for room:", roomid);
      socketRef.current.emit('start-match', roomid);
    }
  };

  const forceReconnect = () => {
    console.log("🔄 Force reconnecting...");
    if (socketRef.current) {
      socketRef.current.disconnect(); // Disconnects and triggers auto-reconnect due to default Socket.IO behavior
    } else {
      // If socket is not initialized, trigger a re-render to re-run the effect
      console.log("Socket not initialized, forcing re-render to connect.");
      setSocketStatus('Attempting Reconnect...'); // Just to show a status update
      // A more robust way might be to change a key on the component or similar,
      // but for debugging, a full page reload might be quicker if nothing else works.
      window.location.reload(); 
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Room: {room.name}</h1>
        <h1 className="text-xl">User: {session?.user?.name}</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-bold text-lg mb-3">Participants ({room.participants.length}):</h2>
          <div className="space-y-2">
            {room.participants.map(p => (
              <div key={p.id || p.user.username} className="p-2 bg-gray-100 rounded flex justify-between items-center">
                <span>{p.user.username}</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  p.role === 'host' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
                }`}>
                  {p.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-3">Questions ({room.questions.length}):</h2>
          <div className="space-y-2">
            {room.questions.map(q => (
              <div key={q.id} className="p-2 bg-gray-100 rounded">
                <div className="font-medium">{q.title}</div>
                {q.difficulty && (
                  <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                    q.difficulty === 'easy' ? 'bg-green-200 text-green-800' :
                    q.difficulty === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {q.difficulty}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        {isHost && (
          <button 
            onClick={handleStartMatch}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Start Match
          </button>
        )}
        
        <button 
          onClick={forceReconnect}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm"
        >
          Force Reconnect
        </button>
      </div>

      {/* Enhanced Debug Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded text-sm space-y-2">
        <div className="font-bold">Debug Information:</div>
        <div>Socket Status: 
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            socketStatus === 'Connected' ? 'bg-green-200 text-green-800' : 
            socketStatus === 'Connecting...' ? 'bg-yellow-200 text-yellow-800' :
            'bg-red-200 text-red-800'
          }`}>
            {socketStatus}
          </span>
        </div>
        <div>Socket ID: {socketRef.current?.id || 'None'}</div>
        <div>Room ID: {roomid}</div>
        <div>Current User: {currUser}</div>
        <div>Is Host: {isHost ? 'Yes' : 'No'}</div>
        <div>Last Update: {lastUpdate}</div>
        <div>Participants Count: {room.participants.length}</div>
        <div>Session Available: {session ? 'Yes' : 'No'}</div>
        <div>Room Data Available: {room ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
}