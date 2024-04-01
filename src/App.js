import React, { useEffect, useState } from 'react';
import './App.css';
import Ball from './Ball';
import io from 'socket.io-client';

const socket = io('http://192.168.43.6:4000'); // Use your server's actual IP address here

function App() {
  const [leftPaddleY, setLeftPaddleY] = useState(200); // Initial left paddle position
  const [rightPaddleY, setRightPaddleY] = useState(200); // Initial right paddle position
  const [ballPosition, setBallPosition] = useState({ x: 500, y: 250 }); // Initialize ball position


  useEffect(() => {
    // Listen for paddle position updates from the server
    socket.on('paddlesUpdate', (paddles) => {
      setLeftPaddleY(paddles.left.y);
      setRightPaddleY(paddles.right.y);
    });

    socket.on('ballUpdate', (ball) => {
      setBallPosition({ x: ball.x, y: ball.y });
    });

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
  
      // Emit paddle movement to the server without specifying the side
      socket.emit('movePaddle', { deltaY });
    };

    // Attach the event listener
    window.addEventListener('keydown', handleKeyPress);

    // Return a cleanup function to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      socket.off('paddlesUpdate');
    };
  }, []);

  return (
    <div className="App">
      <div className="game-area" style={{ position: 'relative', width: '1000px', height: '500px', border: '1px solid black' }}>
        <div style={{ position: 'absolute', left: '20px', top: `${leftPaddleY}px`, width: '20px', height: '100px', backgroundColor: 'blue' }}></div>
        <div style={{ position: 'absolute', right: '20px', top: `${rightPaddleY}px`, width: '20px', height: '100px', backgroundColor: 'red' }}></div>
        <Ball top={ballPosition.y} left={ballPosition.x} />
      </div>
    </div>
  );
}

export default App;
