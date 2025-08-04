'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { getSession, } from 'next-auth/react';
import { Session } from 'next-auth';
import { Room, RoomStatus } from '@/src/types/global';

interface Winner {
  user: {
      username: string;
  };
  score: number;
}

export function useRoomSocket(roomCode: string | null) {
const [room, setRoom] = useState<Room | null>(null);
const [session, setSession] = useState<Session | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const socketRef = useRef<Socket | null>(null);
const [winner, setWinner] = useState<Winner | null>(null);

const fetchRoom = useCallback(async (currentRoomCode: string) => {
  try {
    const res = await fetch(`/api/findroom/${currentRoomCode}`);
    if (!res.ok) throw new Error('Room not found');
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    setRoom(data);
  } catch (err: any) {
    setError(err.message);
    setRoom(null);
  } finally {
    setIsLoading(false);
  }
}, []);

useEffect(() => {
  if (!roomCode) {
    setIsLoading(false);
    return;
  }

  let isMounted = true;
  let socket: Socket | null = null;

  const connectAndFetch = async () => {
    try {
      const sessionData = await getSession();
      if (isMounted) setSession(sessionData);

      // Initial data fetch
      await fetchRoom(roomCode);

      if (!sessionData?.user?.name) return;

      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
      socket = io(socketUrl, { transports: ['websocket'] });
      socketRef.current = socket;

      socket.on('connect', () => {
        if (sessionData?.user?.name) {
          socket?.emit('join-room', roomCode, sessionData.user.name);
        }
      });

      // room-users-updated aur room-participants-updated aek hi kaam karte hain, isliye aek hi rakhein
      socket.on('room-participants-updated', (data: { participants: any[] }) => {
        if (isMounted) {
          setRoom(prevRoom => {
            if (!prevRoom) return null;
            return { ...prevRoom, participants: data.participants };
          });
        }
      });

      socket.on('match-started', () => {
        if (isMounted) fetchRoom(roomCode);
      });

      socket.on('winner-announced', (data: { winner: Winner }) => {
          if (isMounted) {
              console.log("Winner announced event received:", data);
              setWinner(data.winner);
              // Room ka status bhi update karein taaki UI badal jaaye
              setRoom(prevRoom => prevRoom ? { ...prevRoom, status: RoomStatus.FINISHED } : null);
          }
      });

    } catch (err) {
      if (isMounted) setError('Failed to connect or fetch room.');
    }
  };

  connectAndFetch();

  return () => {
    isMounted = false;
    if (socket) {
      socket.disconnect();
      socketRef.current = null;
    }
  };
  
}, [roomCode, fetchRoom]);

const startMatch = useCallback(() => {
  if (socketRef.current && roomCode) {
    socketRef.current.emit('start-match', roomCode);
  }
}, [roomCode]);

return { room, session, isLoading, error, startMatch, socketRef, winner };
}
