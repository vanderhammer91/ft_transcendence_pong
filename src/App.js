import React, { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';

// // Connect to the server
// const socket = io('http://localhost:4000'); // Make sure this matches your server's address

const socket = io('http://192.168.43.6:4000'); // Use your server's actual IP address here

function App() {
  const [leftPaddleY, setLeftPaddleY] = useState(200); // Initial left paddle position
  const [rightPaddleY, setRightPaddleY] = useState(200); // Initial right paddle position

  useEffect(() => {
    // Listen for paddle position updates from the server
    socket.on('paddlesUpdate', (paddles) => {
      setLeftPaddleY(paddles.left.y);
      setRightPaddleY(paddles.right.y);
    });

    // Handle key presses for moving the paddles
    const handleKeyPress = (event) => {
      let deltaY = 0;
      let side = '';

      switch (event.key) {
        case 'w':
          deltaY = -40;
          side = 'left';
          break;
        case 's':
          deltaY = 40;
          side = 'left';
          break;
        case 'ArrowUp':
          deltaY = -40;
          side = 'right';
          break;
        case 'ArrowDown':
          deltaY = 40;
          side = 'right';
          break;
        default:
          return; // Exit if another key is pressed
      }

      // Emit paddle movement to the server
      socket.emit('movePaddle', { side, deltaY });
    };

    window.addEventListener('keydown', handleKeyPress);

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
      </div>
    </div>
  );
}

export default App;
