import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const roomUsers: {
  [roomId: string]: {
    hostUsername: string;
    participants: { socketId: string; username: string }[];
  };
} = {};
const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-room', async (roomId: string, username: string) => {
    socket.join(roomId);
  
    try {
      if (!roomUsers[roomId]) {
        const room = await prisma.room.findUnique({
          where: { code: roomId },
          select: { host: { select: { username: true } } },
        });
  
        if (!room) return;
  
        roomUsers[roomId] = {
          hostUsername: room.host.username,
          participants: [],
        };
      }
  
      const roomData = roomUsers[roomId];
  
      roomData.participants = roomData.participants.filter(
        (p) => p.username !== username
      );
      
      roomData.participants.push({ socketId: socket.id, username });
  
      const participantsWithDetails = roomData.participants.map((p) => ({
        id: p.socketId,
        role:
          p.username === roomData.hostUsername
            ? ('host' as const)
            : ('participant' as const),
        user: { username: p.username },
        score: 0, 
      }));
  
      io.to(roomId).emit('room-users-updated', { participants: participantsWithDetails });
    } catch (error) {
      console.error('Error on join-room:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  
    socket.rooms.forEach(roomId => {
      if (roomId === socket.id) return;
  
      if (roomUsers[roomId]) {
        const roomData = roomUsers[roomId];
        const initialLength = roomData.participants.length;
  
        roomData.participants = roomData.participants.filter(
          (p) => p.socketId !== socket.id
        );
  
        if (roomData.participants.length < initialLength) {
          const participantsWithDetails = roomData.participants.map((p) => ({
            id: p.socketId,
            role:
              p.username === roomData.hostUsername
                ? ('host' as const)
                : ('participant' as const),
            user: { username: p.username },
            score: 0,
          }));
  
          io.to(roomId).emit('room-users-updated', { participants: participantsWithDetails });
  
          if (roomData.participants.length === 0) {
            delete roomUsers[roomId];
          }
        }
      }
    });
  });
  
socket.on('start-match', async (roomId) => {
  console.log(`[DEBUG] Received 'start-match' for roomId: '${roomId}'`);

  if (!roomId) {
    console.error('[DEBUG] Room ID is missing. Aborting.');
    return;
  }
  
  try {
    const startTime = new Date();
    console.log(`[DEBUG] Attempting to update DB. Start time: ${startTime.toISOString()}`);
    
    const updatedRoom = await prisma.room.update({
      where: { code: roomId },
      data: {
        status: 'IN_PROGRESS',
        matchStartedAt: startTime,
      },
    });

    console.log('[DEBUG] DB update successful. Room status:', updatedRoom.status);
    console.log('[DEBUG] Room matchStartedAt:', updatedRoom.matchStartedAt);
    
    io.to(roomId).emit('match-started');

  } catch (error) {
    console.error(`Error during match start process:`, error);
    socket.emit('match-start-error', 'Failed to start match.');
  }
  });
  socket.on('correct-submission', async ({ roomId, userEmail, points }) => {
    try {
      if (!userEmail) {
        console.error('User email not provided for score update.');
        return;
      }
  
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { id: true },
      });
  
      if (!user) {
        console.error(`User with email ${userEmail} not found.`);
        return;
      }
  
      const userId = user.id;
  
      await prisma.matchParticipant.update({
        where: {
          userId_roomId: {
            userId: userId,
            roomId: roomId,
          },
        },
        data: {
          score: {
            increment: points,
          },
        },
      });
  
      const updatedRoom = await prisma.room.findUnique({
        where: { id: roomId },
        include: {
          participants: {
            include: {
              user: { select: { username: true } },
            },
          },
        },
      });
  
      if (updatedRoom) {
        io.to(roomId).emit('room-participants-updated', {
          participants: updatedRoom.participants,
        });
      }
    } catch (error) {
      console.error('Error updating score:', error);
    }
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});