"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const roomUsers = {};
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
    socket.on('join-room', (roomId, username) => {
        socket.join(roomId);
        console.log(`***** SERVER: Executing join-room for ${username} in ${roomId} *****`);
        if (!roomUsers[roomId])
            roomUsers[roomId] = [];
        roomUsers[roomId] = roomUsers[roomId].filter(u => u.socketId !== socket.id);
        roomUsers[roomId].push({ socketId: socket.id, username });
        const usersInRoom = roomUsers[roomId].map(u => u.username);
        console.log(`📥 ${username} joined room ${roomId}. Room occupants after join:`, usersInRoom);
        console.log(`🚀 Attempting to emit 'room-users-updated' to room ${roomId} with users:`, usersInRoom);
        io.to(roomId).emit('room-users-updated', usersInRoom);
        console.log(`✅ Successfully emitted 'room-users-updated' for room ${roomId}.`);
    });
    socket.on('disconnect', () => {
        console.log('❌ A user disconnected:', socket.id);
        for (const roomId in roomUsers) {
            const initialLength = roomUsers[roomId].length;
            // FIX: Changed u.id to u.socketId
            roomUsers[roomId] = roomUsers[roomId].filter(u => u.socketId !== socket.id);
            if (roomUsers[roomId].length < initialLength) {
                const updatedUsers = roomUsers[roomId].map(u => u.username);
                console.log(`🗑️ User with socket ${socket.id} removed from room ${roomId}. Remaining users:`, updatedUsers);
                console.log(`🚀 Attempting to emit 'room-users-updated' (on disconnect) to room ${roomId} with users:`, updatedUsers);
                io.to(roomId).emit('room-users-updated', updatedUsers);
                console.log(`✅ Successfully emitted 'room-users-updated' (on disconnect) for room ${roomId}.`);
            }
            if (roomUsers[roomId].length === 0) {
                delete roomUsers[roomId];
            }
        }
    });
    socket.on('start-match', (roomId) => {
        console.log(`🎮 Start match requested for room: ${roomId}`);
        io.to(roomId).emit('match-started');
        console.log(`✅ Emitted 'match-started' for room: ${roomId}`);
    });
});
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`server running on port : ${PORT}`);
});
