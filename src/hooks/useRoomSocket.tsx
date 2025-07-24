'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { getSession, } from 'next-auth/react';
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
    if (!roomId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    let socket: Socket | null = null;

    const connectAndFetch = async () => {
      try {
        const sessionData = await getSession();
        if (isMounted) setSession(sessionData);

        const roomRes = await fetch(`/api/findroom/${roomId}`);
        const roomData = await roomRes.json();

        if (isMounted) {
          setRoom(roomData);
          setIsLoading(false);
        }

        if (!sessionData?.user?.name) {
          return;
        }

        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
        socket = io(socketUrl, { transports: ['websocket'] });
        socketRef.current = socket;

        socket.on('connect', () => {
          if (sessionData?.user?.name) {
            socket?.emit('join-room', roomId, sessionData.user.name);
          }
        });

        socket.on('room-users-updated', (data: { participants: any[] }) => {
          if (isMounted) {
            // Purane room state ko lein aur sirf 'participants' key ko naye data se update karein
            setRoom(prevRoom => {
              if (!prevRoom) return null; // Agar purana state nahi hai, to kuch na karein
              return { ...prevRoom, participants: data.participants };
            });
          }
        });

        socket.on('match-started', () => {
          if (isMounted) fetchRoom(roomId);
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
  }, [roomId, fetchRoom]);

  const startMatch = useCallback(() => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('start-match', roomId);
    }
  }, [roomId]);

  return { room, session, isLoading, error, startMatch };
}