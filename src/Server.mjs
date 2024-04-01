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



// Function to generate a random velocity within a range, and randomly invert it
const randomVelocity = (min, max) => {
  const velocity = Math.random() * (max - min) + min;
  return Math.random() < 0.5 ? -velocity : velocity;
};

// Initializing ball state with random velocity and direction
let ball = {
  x: 500, // Assuming game width is 1000
  y: 250, // Assuming game height is 500
  dx: randomVelocity(3, 5), // Random horizontal velocity between 3 and 5
  dy: randomVelocity(3, 5), // Random vertical velocity between 3 and 5
  radius: 10, // Ball radius
};

const updateBallPosition = () => {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Collision with top and bottom walls
  if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= 500) {
    ball.dy = -ball.dy;
  }

  // Collision detection with left paddle
  if (ball.x - ball.radius <= 20 + 20 && // Left paddle width + ball radius
      ball.y >= paddles.left.y &&
      ball.y <= paddles.left.y + 100) { // Assuming paddle height is 100
    ball.dx = -ball.dx;
  }

  // Collision detection with right paddle
  if (ball.x + ball.radius >= 1000 - 20 - 20 && // Right paddle position from the right wall + ball radius
      ball.y >= paddles.right.y &&
      ball.y <= paddles.right.y + 100) {
    ball.dx = -ball.dx;
  }

  io.emit('ballUpdate', ball);
};

setInterval(updateBallPosition, 1000 / 60); // Update ball position at 60 FPS






// let clientID = 0; // Starting point for client IDs
const clientIDsMap = new Map(); // Map to store client IDs
let availableIDs = []; // Stack to hold available client IDs.
let currentMaxID = 0;

  io.on('connection', (socket) => {
    let assignedID;
    if (availableIDs.length > 0) {
      // Reuse an available ID if possible.
      assignedID = availableIDs.pop();
    } else {
      // Otherwise, increment the current maximum ID and use it.
      assignedID = ++currentMaxID;
    }
  
    clientIDsMap.set(socket.id, assignedID);
    console.log(`Client connected: ${socket.id}, assigned ID: ${assignedID}`);
  
    // Send initial states of both paddles to the newly connected client
    socket.emit('paddlesUpdate', paddles);
  
    socket.on('disconnect', () => {
      const idToRelease = clientIDsMap.get(socket.id);
      console.log(`Client disconnected: ${socket.id}, ID was: ${idToRelease}`);
      // Instead of deleting the ID, make it available for reuse.
      availableIDs.push(idToRelease);
      clientIDsMap.delete(socket.id);
    });

    socket.on('movePaddle', ({ deltaY }) => {
      const clientID = clientIDsMap.get(socket.id);
      let side = clientID % 2 === 0 ? 'right' : 'left'; // Even IDs control the right, odd control the left
  
      paddles[side].y += deltaY;
      paddles[side].y = Math.max(0, Math.min(paddles[side].y, 400)); // Assuming the game area is 400px in height and paddle is 100px
  
      io.emit('paddlesUpdate', paddles); // Broadcast updated paddle positions
    });

  // // Handle paddle movement commands from clients
  // socket.on('movePaddle', ({ side, deltaY }) => {
  //   paddles[side].y += deltaY;
  //   paddles[side].y = Math.max(0, Math.min(paddles[side].y, 400)); // Keep within bounds
  //   io.emit('paddlesUpdate', paddles); // Broadcast updated paddle positions
  // });

});

const PORT = 4000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
