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
const MATCH_DURATION_MINUTES  = 60;
io.on('connection', (socket) => {
  console.log('✅ A user connected:', socket.id);

  socket.on('join-room', async (roomCode: string, username: string) => {
    socket.join(roomCode);
  
    try {
      const room = await prisma.room.findUnique({
        where: { code: roomCode },
        select: { id: true },
      });
      if (!room) {
        console.error(`Join-room failed: Room with code '${roomCode}' not found.`);
        return;
      }
      const roomId = room.id;
  
      const user = await prisma.user.findFirst({
        where: { OR: [{ username: username }, { email: username }] },
      });
      if (!user) {
        console.error(`Join-room failed: User '${username}' not found.`);
        return;
      }
  
      // Participant ko database mein create/update karein
      await prisma.matchParticipant.upsert({
        where: { userId_roomId: { userId: user.id, roomId: roomId } },
        update: {},
        create: { userId: user.id, roomId: roomId, role: 'PARTICIPANT' },
      });
  
      // --- YEH SABSE ZAROORI BADLAV HAI ---
      // Memory se list banane ke bajaye, hamesha database se latest participant list fetch karein
      const updatedParticipants = await prisma.matchParticipant.findMany({
          where: { roomId: roomId },
          select: {
              // Yahan wahi fields select karein jo frontend ko chahiye
              role: true,
              score: true,
              user: { select: { username: true } }
          }
      });
  
      // Sabhi ko updated list (naye score ke saath) bhejein
      io.to(roomCode).emit('room-participants-updated', { participants: updatedParticipants });
      // --- END OF FIX ---
  
    } catch (error) {
      console.error('Error on join-room:', error);
    }
  });
  

  socket.on('disconnect', () => {
    console.log('❌ A user disconnected:', socket.id);
    socket.rooms.forEach(roomId => {
      if (roomId === socket.id) return;
      if (roomUsers[roomId]) {
        const roomData = roomUsers[roomId];
        const initialLength = roomData.participants.length;
        roomData.participants = roomData.participants.filter((p) => p.socketId !== socket.id);
        if (roomData.participants.length < initialLength) {
          const participantsWithDetails = roomData.participants.map((p) => ({
            id: p.socketId,
            role: p.username === roomData.hostUsername ? ('host' as const) : ('participant' as const),
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
  
  socket.on('start-match', async (roomCode) => {
    try {
      const endTime = new Date(Date.now() + MATCH_DURATION_MINUTES * 60 * 1000);

      const room = await prisma.room.findUnique({
        where: { code: roomCode },
        select: { id: true }
      });

      if (!room) {
        console.error(`Start match failed: Room ${roomCode} not found.`);
        return;
      }

      await prisma.room.update({
        where: { id: room.id },
        data: {
          status: 'IN_PROGRESS',
          matchEndedAt: endTime,
        },
      });

      io.to(roomCode).emit('match-started');

      setTimeout(async () => {
        try {
          const currentRoom = await prisma.room.findUnique({
            where: { code: roomCode },
            select: { id: true }
          });

          if (!currentRoom) return;

          await prisma.room.update({
            where: { id: currentRoom.id },
            data: { status: 'FINISHED' },
          });

          const winner = await prisma.matchParticipant.findFirst({
            where: { roomId: currentRoom.id },
            orderBy: { score: 'desc' },
            include: { user: { select: { username: true } } },
          });

          io.to(roomCode).emit('winner-announced', { winner });
          console.log(`🏆 Match ${roomCode} finished. Winner: ${winner?.user?.username} with a score of ${winner?.score}`);

        } catch (error) {
            console.error(`Error finishing match for room ${roomCode}:`, error);
        }
      }, MATCH_DURATION_MINUTES * 60 * 1000);

    } catch (error) {
      console.error(`Error starting match for room ${roomCode}:`, error);
    }
  });

  socket.on('correct-submission', async ({ roomCode, userEmail, points }) => {
    console.log(`[DEBUG] correct-submission received: userEmail='${userEmail}', roomCode='${roomCode}'`);
    try {
      if (!userEmail) {
        console.error('User email not provided for score update.');
        return;
      }
  
      // --- FIX: First, find the room by its code to get the actual ID ---
      const room = await prisma.room.findUnique({
        where: { code: roomCode },
        select: { id: true },
      });

      if (!room) {
        console.error(`[DEBUG] Score update failed: Room with code '${roomCode}' not found.`);
        return;
      }
      const roomId = room.id; // Use the actual database ID
      // --- END OF FIX ---

      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { id: true },
      });
  
      if (!user) {
        console.error(`User with email ${userEmail} not found.`);
        return;
      }
  
      const userId = user.id;
      console.log(`[DEBUG] Attempting to update score for userId: ${userId} in roomId: ${roomId}`);
  
      await prisma.matchParticipant.update({
        where: {
          userId_roomId: { userId: userId, roomId: roomId }, 
        },
        data: { score: { increment: points } },
      });
      console.log("[DEBUG] Score incremented successfully in DB.");
  
      const updatedRoom = await prisma.room.findUnique({
        where: { id: roomId },
        include: {
          participants: {
            include: { user: { select: { username: true, id: true } } },
          },
        },
      });
      
      if (updatedRoom) {
        io.to(roomCode).emit('room-participants-updated', {
          participants: updatedRoom.participants,
        });
        console.log("[DEBUG] Sent updated participants list to room.");
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
