import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust in production for security
    methods: ["GET", "POST"],
  },
});

// Initial state for both paddles
let paddles = {
  left: { y: 200 },
  right: { y: 200 },
};

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Send initial states of both paddles to the newly connected client
  socket.emit('paddlesUpdate', paddles);

  // Handle paddle movement commands from clients
  socket.on('movePaddle', ({ side, deltaY }) => {
    // Update the specified paddle's position based on received deltaY
    paddles[side].y += deltaY;
    paddles[side].y = Math.max(0, Math.min(paddles[side].y, 400)); // Keep within bounds

    // Broadcast updated paddle positions to all clients
    io.emit('paddlesUpdate', paddles);
  });
});

const PORT = 4000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
