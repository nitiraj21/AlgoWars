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
  rank: number;
}

interface RankedParticipant {
  user: {
    username: string;
  };
  score: number;
  rank: number;
  xpGained: number;
}

interface MatchFinishedData {
  winner: Winner;
  finalRankings: RankedParticipant[];
}

export function useRoomSocket(roomCode: string | null) {
  const [room, setRoom] = useState<Room | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMatchLoading, setIsMatchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [winner, setWinner] = useState<Winner | null>(null);
  const [finalRankings, setFinalRankings] = useState<RankedParticipant[]>([]);
  const [isMatchFinished, setIsMatchFinished] = useState(false);

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

        const socketUrl = 'http://13.235.48.154:5000';
        socket = io(socketUrl, { transports: ['websocket'] });
        socketRef.current = socket;

        socket.on('connect', () => {
          if (sessionData?.user?.name) {
            socket?.emit('join-room', roomCode, sessionData.user.name);
          }
        });

        // Handle participants updates (includes rank information now)
        socket.on('room-participants-updated', (data: { participants: any[] }) => {
          if (isMounted) {
            console.log("Participants updated:", data.participants);
            setRoom(prevRoom => {
              if (!prevRoom) return null;
              return { ...prevRoom, participants: data.participants };
            });
          }
        });

        socket.on('match-started', () => {
          if (isMounted) {
            console.log("Match started");
            setIsMatchFinished(false);
            setWinner(null);
            setFinalRankings([]);
            fetchRoom(roomCode);
          }
        });

        // Handle the new match-finished event instead of winner-announced
        socket.on('match-finished', (data: MatchFinishedData) => {
          if (isMounted) {
            console.log("Match finished event received:", data);
            setWinner(data.winner);
            setFinalRankings(data.finalRankings);
            setIsMatchFinished(true);
            
            // Update room status to FINISHED
            setRoom(prevRoom => prevRoom ? { 
              ...prevRoom, 
              status: RoomStatus.FINISHED 
            } : null);
          }
        });

        // Keep the old winner-announced for backward compatibility (optional)
        socket.on('winner-announced', (data: { winner: Winner }) => {
          if (isMounted) {
            console.log("Winner announced event received (legacy):", data);
            setWinner(data.winner);
            setIsMatchFinished(true);
            setRoom(prevRoom => prevRoom ? { 
              ...prevRoom, 
              status: RoomStatus.FINISHED 
            } : null);
          }
        });

        // Handle connection errors
        socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          if (isMounted) setError('Failed to connect to server');
        });

        socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
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
      setIsMatchLoading(true);
      socketRef.current.emit('start-match', roomCode, () => {
        setIsMatchLoading(false);
      });
      
    }
  }, [roomCode]);

  // Helper function to force finish match (useful for testing)
  const forceFinishMatch = useCallback(() => {
    if (socketRef.current && roomCode) {
      socketRef.current.emit('force-finish-match', roomCode);
    }
  }, [roomCode]);

  // Helper function to get current user's rank and XP gained
  const getCurrentUserStats = useCallback(() => {
    if (!session?.user?.name || !finalRankings.length) return null;
    
    return finalRankings.find(participant => 
      participant.user.username === session.user?.name
    );
  }, [session?.user?.name, finalRankings]);

  // Helper function to check if current user is the winner
  const isCurrentUserWinner = useCallback(() => {
    if (!session?.user?.name || !winner) return false;
    return winner.user.username === session.user?.name;
  }, [session?.user?.name, winner]);

  return { 
    room, 
    session, 
    isLoading, 
    error, 
    startMatch,
    forceFinishMatch, // For testing purposes
    socketRef, 
    winner,
    finalRankings,
    isMatchFinished,
    getCurrentUserStats,
    isCurrentUserWinner,
    isMatchLoading
  };
}