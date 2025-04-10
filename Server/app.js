// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const connectDB = require('./config/db');
const roomRoutes = require('./routes/room.routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api', roomRoutes);

// Store active users in memory (optional)
const roomUsers = {};

io.on('connection', (socket) => {
  console.log('✅ New connection:', socket.id);

  socket.on('join-room', ({ secretKey, user }) => {
    socket.join(secretKey);
    if (!roomUsers[secretKey]) roomUsers[secretKey] = [];
    roomUsers[secretKey].push({ ...user, socketId: socket.id });

    io.to(secretKey).emit('user-list', roomUsers[secretKey]); // broadcast updated user list
    console.log(`🔗 ${user.name} joined room ${secretKey}`);
  });

  socket.on('send-message', ({ secretKey, message }) => {
    io.to(secretKey).emit('receive-message', message);
    console.log(`📨 Message to ${secretKey}:`, message.message);
  });

  socket.on('room-closed', (secretKey) => {
    io.to(secretKey).emit('room-closed');
    delete roomUsers[secretKey];
    console.log(`🚫 Room closed: ${secretKey}`);
  });

  socket.on('disconnect', () => {
    for (const [room, users] of Object.entries(roomUsers)) {
      const idx = users.findIndex(u => u.socketId === socket.id);
      if (idx !== -1) {
        const leftUser = users.splice(idx, 1)[0];
        io.to(room).emit('user-list', users);
        console.log(`❌ User left: ${leftUser.name}`);
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
