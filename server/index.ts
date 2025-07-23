import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const roomUsers: { [roomId: string]: { socketId: string; username: string }[] } = {};
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

    if (!roomUsers[roomId]) {
      roomUsers[roomId] = [];
    }

    roomUsers[roomId] = roomUsers[roomId].filter(
      (u) => u.socketId !== socket.id
    );
    roomUsers[roomId].push({ socketId: socket.id, username });

    try {
      const room = await prisma.room.findUnique({
        where: { code: roomId },
        select: { host: { select: { username: true } } },
      });

      if (!room) {
        return;
      }

      const participantsWithDetails = roomUsers[roomId].map((p) => {
        return {
          id: p.socketId,
          role:
            p.username === room.host.username
              ? ('host' as const)
              : ('participant' as const),
          user: {
            username: p.username,
          },
        };
      });

      io.to(roomId).emit('room-users-updated', participantsWithDetails);
    } catch (error) {
      console.error('Error fetching room host:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ A user disconnected:', socket.id);

    for (const roomId in roomUsers) {
      const initialLength = roomUsers[roomId].length;
      roomUsers[roomId] = roomUsers[roomId].filter(
        (u) => u.socketId !== socket.id
      );

      if (roomUsers[roomId].length < initialLength) {
        (async () => {
          try {
            const room = await prisma.room.findUnique({
              where: { code: roomId },
              select: { host: { select: { username: true } } },
            });

            if (!room) return;

            const participantsWithDetails = roomUsers[roomId].map((p) => ({
              id: p.socketId,
              role:
                p.username === room.host.username
                  ? ('host' as const)
                  : ('participant' as const),
              user: { username: p.username },
            }));

            io.to(roomId).emit('room-users-updated', participantsWithDetails);
          } catch (error) {
            console.error('Error on disconnect update:', error);
          }
        })();
      }

      if (roomUsers[roomId].length === 0) {
        delete roomUsers[roomId];
      }
    }
  });

  socket.on('start-match', async (roomId) => {
    console.log(`🎮 Start match requested for room: ${roomId}`);
    try {
      await prisma.room.update({
        where: { code: roomId },
        data: { status: 'IN_PROGRESS' },
      });

      io.to(roomId).emit('match-started');
    } catch (error) {
      console.error(`❌ Error starting match for room ${roomId}:`, error);
      socket.emit('match-start-error', 'Failed to start match.');
    }
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});