import React, { useEffect, useState } from 'react';
import './App.css';
import Ball from './Ball';

function App() {
  const [leftPaddleY, setLeftPaddleY] = useState(200); // Initial left paddle position
  const [rightPaddleY, setRightPaddleY] = useState(200); // Initial right paddle position
  const [ballPosition, setBallPosition] = useState({ x: 500, y: 250 }); // Initialize ball position
  const [showGoalOverlay, setShowGoalOverlay] = useState(false);

  useEffect(() => {
    // Determine the WebSocket URI
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socketURI = `${protocol}//${window.location.hostname}:8000/ws/game/`; // Adjust the port and path as needed
    const socket = new WebSocket(socketURI);

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Data received: ", data);

      // Handling different types of messages
      if(data.paddles) {
        setLeftPaddleY(data.paddles.left.y);
        setRightPaddleY(data.paddles.right.y);
      }
      
      if(data.ball) {
        setBallPosition({ x: data.ball.x, y: data.ball.y });
      }

      if(data.type === 'goalScored') {
        setShowGoalOverlay(true);
        setTimeout(() => setShowGoalOverlay(false), 1500); // Show goal overlay for 1.5 seconds
      }
    };

    // Define the key press handler within useEffect
    const handleKeyPress = (event) => {
      let deltaY = 0;
  
      if (event.key === 'w' || event.key === 'ArrowUp') {
        deltaY = -40; // Move up
      } else if (event.key === 's' || event.key === 'ArrowDown') {
        deltaY = 40; // Move down
      } else {
        return; // Do nothing for other keys
      }
  
      // Send paddle movement to the server
      socket.send(JSON.stringify({ deltaY }));
    };

    window.addEventListener('keydown', handleKeyPress);

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      socket.close();
    };
  }, []);

  return (
    <div className="App">
      <div className="game-area">
        {showGoalOverlay && (
          <div className="goal-overlay">
            <p className="goal-text">GOAL!</p>
          </div>
        )}
        <div style={{ position: 'absolute', left: '20px', top: `${leftPaddleY}px`, width: '20px', height: '100px', backgroundColor: 'blue' }}></div>
        <div style={{ position: 'absolute', right: '20px', top: `${rightPaddleY}px`, width: '20px', height: '100px', backgroundColor: 'red' }}></div>
        <Ball top={ballPosition.y} left={ballPosition.x} />
      </div>
    </div>
  );
}

export default App;
