"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const client_1 = require("@prisma/client");
const roomUsers = {};
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
io.on('connection', (socket) => {
    console.log('✅ A user connected:', socket.id);
    socket.on('join-room', (roomCode, username) => __awaiter(void 0, void 0, void 0, function* () {
        socket.join(roomCode);
        try {
            const room = yield prisma.room.findUnique({
                where: { code: roomCode },
                select: { id: true },
            });
            if (!room) {
                console.error(`Join-room failed: Room with code '${roomCode}' not found.`);
                return;
            }
            const roomId = room.id;
            const user = yield prisma.user.findFirst({
                where: { OR: [{ username: username }, { email: username }] },
            });
            if (!user) {
                console.error(`Join-room failed: User '${username}' not found.`);
                return;
            }
            // Participant ko database mein create/update karein
            yield prisma.matchParticipant.upsert({
                where: { userId_roomId: { userId: user.id, roomId: roomId } },
                update: {},
                create: { userId: user.id, roomId: roomId, role: 'PARTICIPANT' },
            });
            // --- YEH SABSE ZAROORI BADLAV HAI ---
            // Memory se list banane ke bajaye, hamesha database se latest participant list fetch karein
            const updatedParticipants = yield prisma.matchParticipant.findMany({
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
        }
        catch (error) {
            console.error('Error on join-room:', error);
        }
    }));
    socket.on('disconnect', () => {
        console.log('❌ A user disconnected:', socket.id);
        socket.rooms.forEach(roomId => {
            if (roomId === socket.id)
                return;
            if (roomUsers[roomId]) {
                const roomData = roomUsers[roomId];
                const initialLength = roomData.participants.length;
                roomData.participants = roomData.participants.filter((p) => p.socketId !== socket.id);
                if (roomData.participants.length < initialLength) {
                    const participantsWithDetails = roomData.participants.map((p) => ({
                        id: p.socketId,
                        role: p.username === roomData.hostUsername ? 'host' : 'participant',
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
    socket.on('start-match', (roomId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const startTime = new Date();
            yield prisma.room.update({
                where: { code: roomId },
                data: { status: 'IN_PROGRESS', matchStartedAt: startTime },
            });
            io.to(roomId).emit('match-started');
        }
        catch (error) {
            console.error(`Error during match start process:`, error);
            socket.emit('match-start-error', 'Failed to start match.');
        }
    }));
    socket.on('correct-submission', ({ roomCode, userEmail, points }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`[DEBUG] correct-submission received: userEmail='${userEmail}', roomCode='${roomCode}'`);
        try {
            if (!userEmail) {
                console.error('User email not provided for score update.');
                return;
            }
            // --- FIX: First, find the room by its code to get the actual ID ---
            const room = yield prisma.room.findUnique({
                where: { code: roomCode },
                select: { id: true },
            });
            if (!room) {
                console.error(`[DEBUG] Score update failed: Room with code '${roomCode}' not found.`);
                return;
            }
            const roomId = room.id; // Use the actual database ID
            // --- END OF FIX ---
            const user = yield prisma.user.findUnique({
                where: { email: userEmail },
                select: { id: true },
            });
            if (!user) {
                console.error(`User with email ${userEmail} not found.`);
                return;
            }
            const userId = user.id;
            console.log(`[DEBUG] Attempting to update score for userId: ${userId} in roomId: ${roomId}`);
            yield prisma.matchParticipant.update({
                where: {
                    userId_roomId: { userId: userId, roomId: roomId }, // Now using the correct roomId
                },
                data: { score: { increment: points } },
            });
            console.log("[DEBUG] Score incremented successfully in DB.");
            const updatedRoom = yield prisma.room.findUnique({
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
        }
        catch (error) {
            console.error('Error updating score:', error);
        }
    }));
});
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
