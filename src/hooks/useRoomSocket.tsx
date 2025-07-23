'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { Room, RoomStatus } from '@/src/types/global';


export function useRoomSocket(roomId: string | null) {
  const [room, setRoom] = useState<Room | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const fetchRoom = useCallback(async (currentRoomId: string) => {
    try {
      const res = await fetch(`/api/findroom/${currentRoomId}`);
      if (!res.ok) {
        throw new Error('Room not found or server error.');
      }
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setRoom(data);
    } catch (err: any) {
      setError(err.message);
      setRoom(null);
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    if (!roomId) return;

    const retrieveSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
      await fetchRoom(roomId);

      if (!sessionData?.user?.name) {
          console.log("User session not found, can't connect socket.");
          return;
      }
       
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
      const socket = io(socketUrl, { transports: ['websocket'] });
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        socket.emit('join-room', roomId, sessionData?.user?.name);
      });

  
      socket.on('room-users-updated', (participantsFromServer: any[]) => {
        setRoom(prevRoom => prevRoom ? { ...prevRoom, participants: participantsFromServer } : null);
      });
      
      socket.on('match-started', () => {
        setRoom(prevRoom => prevRoom ? { ...prevRoom, status: RoomStatus.IN_PROGRESS } : null);
      });

      socket.on('connect_error', (err) => {
        console.error("Socket Connection Error:", err.message);
        setError("Failed to connect to the server.");
      });

      return () => {
        if (socket) {
          socket.disconnect();
          socketRef.current = null;
        }
      };
    };

    retrieveSession();

  }, [roomId, fetchRoom]); 

  const startMatch = useCallback(() => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('start-match', roomId);
    }
  }, [roomId]);


  return { room, session, isLoading, error, startMatch };
}