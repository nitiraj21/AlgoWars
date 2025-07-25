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
  
    // socket.rooms ek Set hai jismein un sabhi rooms ki ID hoti hai jinhein socket ne join kiya hai.
    // Yeh 'for...in' loop se behtar hai.
    socket.rooms.forEach(roomId => {
      // Har socket apne ID ke naam se ek room mein hota hai, use ignore karein.
      if (roomId === socket.id) return;
  
      // Check karein ki room hamare memory store mein hai ya nahi.
      if (roomUsers[roomId]) {
        const roomData = roomUsers[roomId];
        const initialLength = roomData.participants.length;
  
        // Participant ko list se hatayein
        roomData.participants = roomData.participants.filter(
          (p) => p.socketId !== socket.id
        );
  
        // Agar list mein badlav hua hai, to update bhejein
        if (roomData.participants.length < initialLength) {
          const participantsWithDetails = roomData.participants.map((p) => ({
            id: p.socketId,
            role:
              p.username === roomData.hostUsername
                ? ('host' as const)
                : ('participant' as const),
            user: { username: p.username },
          }));
  
          io.to(roomId).emit('room-users-updated', { participants: participantsWithDetails });
  
          // Agar room khaali ho gaya hai, to use memory se delete kar dein
          if (roomData.participants.length === 0) {
            console.log(`🧹 Room ${roomId} is now empty. Deleting.`);
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
    console.error(`❌ [CRITICAL] Error during match start process:`, error);
    socket.emit('match-start-error', 'Failed to start match.');
  }
});
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});