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
  console.log('✅ A user connected:', socket.id);

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
        (p) => p.socketId !== socket.id
      );
      roomData.participants.push({ socketId: socket.id, username });
  
      const participantsWithDetails = roomData.participants.map((p) => ({
        id: p.socketId,
        role: p.username === roomData.hostUsername ? 'host' : 'participant',
        user: { username: p.username },
      }));
  
      io.to(roomId).emit('room-users-updated', { participants: participantsWithDetails });
    } catch (error) {
      console.error('Error on join-room:', error);
    }
  });

  // Replace your entire socket.on('disconnect', ...) with this

socket.on('disconnect', () => {
  console.log('❌ A user disconnected:', socket.id);

  for (const roomId in roomUsers) {
    const roomData = roomUsers[roomId];

    // Safety check in case roomData is manipulated unexpectedly
    if (!roomData || !roomData.participants) continue;

    const initialLength = roomData.participants.length;

    // Create a new list without the disconnected user
    const updatedParticipants = roomData.participants.filter(
      (p) => p.socketId !== socket.id
    );

    // Check if a user was actually removed from this room
    if (updatedParticipants.length < initialLength) {
      // 1. Update the list in memory first
      roomData.participants = updatedParticipants;

      // 2. Prepare the data to be sent to the frontend
      const participantsWithDetails = roomData.participants.map((p) => ({
        id: p.socketId,
        role:
          p.username === roomData.hostUsername
            ? ('host' as const)
            : ('participant' as const),
        user: { username: p.username },
      }));

      // 3. Broadcast the update
      io.to(roomId).emit('room-users-updated', participantsWithDetails);

      // 4. AFTER broadcasting, check if the room is empty and clean it up
      if (roomData.participants.length === 0) {
        delete roomUsers[roomId];
      }
    }
  }
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
    console.error(`❌ [CRITICAL] Error during match start process:`, error);
    socket.emit('match-start-error', 'Failed to start match.');
  }
});
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});