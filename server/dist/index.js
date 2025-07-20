"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
// Stores users currently in each room
// Structure: { [roomId]: [{ socketId: string, username: string }, ...] }
const roomUsers = {};
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Initialize Socket.IO server with CORS configuration
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
// Handle new Socket.IO connections
io.on('connection', (socket) => {
    console.log('✅ A user connected:', socket.id); // Log user connection
    // Event: A client requests to join a room
    socket.on('join-room', (roomId, username) => {
        socket.join(roomId); // Add the socket to the specified Socket.IO room
        // Initialize roomUsers entry if it doesn't exist
        if (!roomUsers[roomId]) {
            roomUsers[roomId] = [];
        }
        // Remove any existing entry for this socketId in the room
        // This handles cases where a user might reconnect or join again
        roomUsers[roomId] = roomUsers[roomId].filter(u => u.socketId !== socket.id);
        // Add the current user's socketId and username to the room's list
        roomUsers[roomId].push({ socketId: socket.id, username });
        // Get only the usernames for broadcasting
        const usersInRoom = roomUsers[roomId].map(u => u.username);
        // Emit 'room-users-updated' event to all clients in this specific room
        // This updates all participants' UIs with the current list of users
        io.to(roomId).emit('room-users-updated', usersInRoom);
    });
    // Event: A client disconnects
    socket.on('disconnect', () => {
        console.log('❌ A user disconnected:', socket.id); // Log user disconnection
        // Iterate through all rooms to find and remove the disconnected user
        for (const roomId in roomUsers) {
            const initialLength = roomUsers[roomId].length;
            // Filter out the disconnected user's socketId
            roomUsers[roomId] = roomUsers[roomId].filter(u => u.socketId !== socket.id);
            // If a user was actually removed from this room
            if (roomUsers[roomId].length < initialLength) {
                const updatedUsers = roomUsers[roomId].map(u => u.username);
                // Emit 'room-users-updated' to remaining users in the room
                io.to(roomId).emit('room-users-updated', updatedUsers);
            }
            // If the room becomes empty, delete its entry to clean up
            if (roomUsers[roomId].length === 0) {
                delete roomUsers[roomId];
            }
        }
    });
    // Event: Host requests to start the match
    socket.on('start-match', (roomId) => {
        console.log(`🎮 Start match requested for room: ${roomId}`); // Log match start request
        // Emit 'match-started' event to all clients in the specific room
        io.to(roomId).emit('match-started');
    });
});
// Start the HTTP server
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
