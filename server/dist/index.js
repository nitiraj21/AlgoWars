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
    socket.on('join-room', (roomId, username) => __awaiter(void 0, void 0, void 0, function* () {
        socket.join(roomId);
        try {
            if (!roomUsers[roomId]) {
                const room = yield prisma.room.findUnique({
                    where: { code: roomId },
                    select: { host: { select: { username: true } } },
                });
                if (!room)
                    return;
                roomUsers[roomId] = {
                    hostUsername: room.host.username,
                    participants: [],
                };
            }
            const roomData = roomUsers[roomId];
            roomData.participants = roomData.participants.filter((p) => p.username !== username);
            roomData.participants.push({ socketId: socket.id, username });
            const participantsWithDetails = roomData.participants.map((p) => ({
                id: p.socketId,
                role: p.username === roomData.hostUsername
                    ? 'host'
                    : 'participant',
                user: { username: p.username },
                // --- FIX: Add the score property ---
                score: 0, // Abhi ke liye default score 0 rakhein
            }));
            io.to(roomId).emit('room-users-updated', { participants: participantsWithDetails });
        }
        catch (error) {
            console.error('Error on join-room:', error);
        }
    }));
    // Replace your entire socket.on('disconnect', ...) with this
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
                        role: p.username === roomData.hostUsername
                            ? 'host'
                            : 'participant',
                        user: { username: p.username },
                        // --- FIX: Yahan bhi score add karein ---
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
        console.log(`[DEBUG] Received 'start-match' for roomId: '${roomId}'`);
        if (!roomId) {
            console.error('[DEBUG] Room ID is missing. Aborting.');
            return;
        }
        try {
            const startTime = new Date();
            console.log(`[DEBUG] Attempting to update DB. Start time: ${startTime.toISOString()}`);
            const updatedRoom = yield prisma.room.update({
                where: { code: roomId },
                data: {
                    status: 'IN_PROGRESS',
                    matchStartedAt: startTime,
                },
            });
            console.log('[DEBUG] DB update successful. Room status:', updatedRoom.status);
            console.log('[DEBUG] Room matchStartedAt:', updatedRoom.matchStartedAt);
            io.to(roomId).emit('match-started');
        }
        catch (error) {
            console.error(`❌ [CRITICAL] Error during match start process:`, error);
            socket.emit('match-start-error', 'Failed to start match.');
        }
    }));
    socket.on('correct-submission', ({ roomId, userEmail, points }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!userEmail) {
                console.error('User email not provided for score update.');
                return;
            }
            // 1. Email se user ko dhoondhein taaki humein userId mil sake
            const user = yield prisma.user.findUnique({
                where: { email: userEmail },
                select: { id: true },
            });
            if (!user) {
                console.error(`User with email ${userEmail} not found.`);
                return;
            }
            const userId = user.id;
            // 2. Ab userId aur roomId ka istemaal karke score update karein
            yield prisma.matchParticipant.update({
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
            // 3. Poori room ki nayi participant list database se fetch karein
            const updatedRoom = yield prisma.room.findUnique({
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
                // 4. Sabhi ko updated participants ki list (naye score ke saath) bhejein
                io.to(roomId).emit('room-participants-updated', {
                    participants: updatedRoom.participants,
                });
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
