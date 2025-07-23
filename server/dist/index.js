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
        if (!roomUsers[roomId]) {
            roomUsers[roomId] = [];
        }
        roomUsers[roomId] = roomUsers[roomId].filter((u) => u.socketId !== socket.id);
        roomUsers[roomId].push({ socketId: socket.id, username });
        try {
            const room = yield prisma.room.findUnique({
                where: { code: roomId },
                select: { host: { select: { username: true } } },
            });
            if (!room) {
                return;
            }
            const participantsWithDetails = roomUsers[roomId].map((p) => {
                return {
                    id: p.socketId,
                    role: p.username === room.host.username
                        ? 'host'
                        : 'participant',
                    user: {
                        username: p.username,
                    },
                };
            });
            io.to(roomId).emit('room-users-updated', participantsWithDetails);
        }
        catch (error) {
            console.error('Error fetching room host:', error);
        }
    }));
    socket.on('disconnect', () => {
        console.log('❌ A user disconnected:', socket.id);
        for (const roomId in roomUsers) {
            const initialLength = roomUsers[roomId].length;
            roomUsers[roomId] = roomUsers[roomId].filter((u) => u.socketId !== socket.id);
            if (roomUsers[roomId].length < initialLength) {
                (() => __awaiter(void 0, void 0, void 0, function* () {
                    try {
                        const room = yield prisma.room.findUnique({
                            where: { code: roomId },
                            select: { host: { select: { username: true } } },
                        });
                        if (!room)
                            return;
                        const participantsWithDetails = roomUsers[roomId].map((p) => ({
                            id: p.socketId,
                            role: p.username === room.host.username
                                ? 'host'
                                : 'participant',
                            user: { username: p.username },
                        }));
                        io.to(roomId).emit('room-users-updated', participantsWithDetails);
                    }
                    catch (error) {
                        console.error('Error on disconnect update:', error);
                    }
                }))();
            }
            if (roomUsers[roomId].length === 0) {
                delete roomUsers[roomId];
            }
        }
    });
    socket.on('start-match', (roomId) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`🎮 Start match requested for room: ${roomId}`);
        try {
            yield prisma.room.update({
                where: { code: roomId },
                data: { status: 'IN_PROGRESS' },
            });
            io.to(roomId).emit('match-started');
        }
        catch (error) {
            console.error(`❌ Error starting match for room ${roomId}:`, error);
            socket.emit('match-start-error', 'Failed to start match.');
        }
    }));
});
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
