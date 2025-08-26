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
let MATCH_DURATION_MINUTES: number | null = null;
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Helper function to calculate XP based on rank
function calculateXPByRank(rank: number): number {
  switch (rank) {
    case 1: return 100; // Winner
    case 2: return 40;  // Second place
    case 3: return 30;  // Third place
    default: return 20; // Everyone else
  }
}

// Helper function to assign ranks and distribute XP
async function finishMatchWithRanking(roomCode: string, roomId: string) {
  try {
    // Get all participants ordered by score (descending)
    const participants = await prisma.matchParticipant.findMany({
      where: { roomId: roomId },
      include: { user: { select: { username: true, id: true } } },
      orderBy: { score: 'desc' },
    });

    if (participants.length === 0) {
      console.log(`No participants found for room ${roomCode}`);
      return;
    }

    // Assign ranks and update participants
    const updates = participants.map(async (participant, index) => {
      const rank = index + 1;
      const xpGained = calculateXPByRank(rank);
      
      // Update participant rank
      await prisma.matchParticipant.update({
        where: { id: participant.id },
        data: { rank: rank },
      });

      // Update user stats
      const updateData: any = {
        XP: { increment: xpGained },
      };

      // Only increment wins for the winner (rank 1)
      if (rank === 1) {
        updateData.wins = { increment: 1 };
      }

      await prisma.user.update({
        where: { id: participant.user.id },
        data: updateData,
      });

      return {
        ...participant,
        rank,
        xpGained,
      };
    });

    const rankedParticipants = await Promise.all(updates);

    // Get the winner (first participant)
    const winner = rankedParticipants[0];

    // Emit results to all participants
    io.to(roomCode).emit('match-finished', {
      winner: {
        user: winner.user,
        score: winner.score,
        rank: winner.rank,
      },
      finalRankings: rankedParticipants.map(p => ({
        user: p.user,
        score: p.score,
        rank: p.rank,
        xpGained: p.xpGained,
      })),
    });

    console.log(`🏆 Match ${roomCode} finished with rankings:`);
    rankedParticipants.forEach(p => {
      console.log(`  ${p.rank}. ${p.user.username} - Score: ${p.score} (+${p.xpGained} XP)`);
    });

  } catch (error) {
    console.error(`Error finishing match with ranking for room ${roomCode}:`, error);
  }
}

io.on('connection', (socket) => {
  console.log('✅ A user connected:', socket.id);

  socket.on('join-room', async (roomCode: string, username: string) => {
    socket.join(roomCode);
  
    try {
      const room = await prisma.room.findUnique({
        where: { code: roomCode },
        select: { id: true, duration: true, status: true },
      });
      
      if (!room) {
        console.error(`Join-room failed: Room with code '${roomCode}' not found.`);
        return;
      }

      if(room.status ==='WAITING'){
        return;
      }

      
      
      const roomId = room.id;
      MATCH_DURATION_MINUTES = room.duration || null;
  
      const user = await prisma.user.findFirst({
        where: { OR: [{ username: username }, { email: username }] },
      });
      
      if (!user) {
        console.error(`Join-room failed: User '${username}' not found.`);
        return;
      }
  
      await prisma.matchParticipant.upsert({
        where: { userId_roomId: { userId: user.id, roomId: roomId } },
        update: {},
        create: { userId: user.id, roomId: roomId, role: 'PARTICIPANT' },
      });
  
      const updatedParticipants = await prisma.matchParticipant.findMany({
        where: { roomId: roomId },
        select: {
          role: true,
          score: true,
          rank: true,
          user: { select: { username: true , ProfilePic : true}}
        }
      });
  
      io.to(roomCode).emit('room-participants-updated', { participants: updatedParticipants });
  
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
      let endTime = new Date();
      if (MATCH_DURATION_MINUTES) {
        endTime = new Date(Date.now() + MATCH_DURATION_MINUTES * 60 * 1000);
      }

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
      
      if (MATCH_DURATION_MINUTES) {
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

            // Use the new ranking system instead of just announcing winner
            await finishMatchWithRanking(roomCode, currentRoom.id);

          } catch (error) {
            console.error(`Error finishing match for room ${roomCode}:`, error);
          }
        }, MATCH_DURATION_MINUTES * 60 * 1000);
      }

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
  
      // First, find the room by its code to get the actual ID
      const room = await prisma.room.findUnique({
        where: { code: roomCode },
        select: { id: true },
      });

      if (!room) {
        console.error(`[DEBUG] Score update failed: Room with code '${roomCode}' not found.`);
        return;
      }
      
      const roomId = room.id;

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

  // Optional: Add endpoint to manually finish match (for testing or admin purposes)
  socket.on('force-finish-match', async (roomCode) => {
    try {
      const room = await prisma.room.findUnique({
        where: { code: roomCode },
        select: { id: true }
      });

      if (!room) {
        console.error(`Force finish failed: Room ${roomCode} not found.`);
        return;
      }

      await prisma.room.update({
        where: { id: room.id },
        data: { status: 'FINISHED' },
      });

      await finishMatchWithRanking(roomCode, room.id);
      
    } catch (error) {
      console.error(`Error force finishing match for room ${roomCode}:`, error);
    }
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});