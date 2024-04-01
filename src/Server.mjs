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

let clientID = 0; // Starting point for client IDs
const clientIDsMap = new Map(); // Map to store client IDs

io.on('connection', (socket) => {
  clientID++; // Increment clientID for each new connection
  clientIDsMap.set(socket.id, clientID); // Map socket ID to clientID
  console.log(`Client connected: ${socket.id}, assigned ID: ${clientID}`);

  // Send initial states of both paddles to the newly connected client
  socket.emit('paddlesUpdate', paddles);

  // Handle paddle movement commands from clients
  socket.on('movePaddle', ({ side, deltaY }) => {
    paddles[side].y += deltaY;
    paddles[side].y = Math.max(0, Math.min(paddles[side].y, 400)); // Keep within bounds
    io.emit('paddlesUpdate', paddles); // Broadcast updated paddle positions
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}, ID was: ${clientIDsMap.get(socket.id)}`);
    clientIDsMap.delete(socket.id); // Remove the client ID from the map upon disconnection
  });
});

const PORT = 4000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
