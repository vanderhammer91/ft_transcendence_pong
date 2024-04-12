import React, { useEffect, useState } from 'react';
import './App.css';
import Ball from './Ball';

function App() {
  const [leftPaddleY, setLeftPaddleY] = useState(150);
  const [rightPaddleY, setRightPaddleY] = useState(150);
  const [ballPosition, setBallPosition] = useState({ x: 290, y: 190 });
  const [showGoalOverlay, setShowGoalOverlay] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socketURI = `${protocol}//${window.location.hostname}:8000/ws/game/`;
    const ws = new WebSocket(socketURI);

    ws.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Data received: ", data);

      if (data.paddles) {
        setLeftPaddleY(data.paddles.left.y);
        setRightPaddleY(data.paddles.right.y);
      }
      
      if (data.ball) {
        setBallPosition({ x: data.ball.x, y: data.ball.y });
      }

      if (data.type === 'goalScored') {
        setShowGoalOverlay(true);
        setTimeout(() => setShowGoalOverlay(false), 1500);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.log("WebSocket is not open");
        return;
      }

      let deltaY = 0;
      let side;

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
          return; // Ignore other keys
      }

      // Send the deltaY and side information to the server
      socket.send(JSON.stringify({ deltaY, side }));
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [socket]);

  return (
    <div className="App">
      <div className="game-area">
        <div className="paddle left-paddle" style={{ top: `${leftPaddleY}px`, left: '20px' }}></div>
        <div className="paddle right-paddle" style={{ top: `${rightPaddleY}px`, right: '20px' }}></div>
        <Ball top={ballPosition.y} left={ballPosition.x} />
        {showGoalOverlay && (
          <div className="goal-overlay">
            <p className="goal-text">GOAL!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
