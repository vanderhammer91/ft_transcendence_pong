// import React, { useEffect, useState } from 'react';
// import './App.css';
// import Ball from './Ball';

// function App() {
//   const [leftPaddleY, setLeftPaddleY] = useState(200); // Initial left paddle position
//   const [rightPaddleY, setRightPaddleY] = useState(200); // Initial right paddle position
//   const [ballPosition, setBallPosition] = useState({ x: 500, y: 250 }); // Initialize ball position
//   const [showGoalOverlay, setShowGoalOverlay] = useState(false);

//   useEffect(() => {
//     const protocol = window.location.protocol;
//     const socketURI = `${protocol}//${window.location.hostname}:8000/ws/game/`;
//     const socket = new WebSocket(socketURI);

//     // // Determine the WebSocket URI
//     // const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
//     // const socketURI = `${protocol}//${window.location.hostname}:8000/ws/game/`; // Adjust the port and path as needed
//     // const socket = new WebSocket(socketURI);

//     socket.onopen = () => {
//       console.log("WebSocket connection established");
//     };

//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log("Data received: ", data);

//       // Handling different types of messages
//       if(data.paddles) {
//         setLeftPaddleY(data.paddles.left.y);
//         setRightPaddleY(data.paddles.right.y);
//       }
      
//       if(data.ball) {
//         setBallPosition({ x: data.ball.x, y: data.ball.y });
//       }

//       if(data.type === 'goalScored') {
//         setShowGoalOverlay(true);
//         setTimeout(() => setShowGoalOverlay(false), 1500); // Show goal overlay for 1.5 seconds
//       }
//     };

//     // Define the key press handler within useEffect
//     const handleKeyPress = (event) => {
//       let deltaY = 0;
  
//       if (event.key === 'w' || event.key === 'ArrowUp') {
//         deltaY = -40; // Move up
//       } else if (event.key === 's' || event.key === 'ArrowDown') {
//         deltaY = 40; // Move down
//       } else {
//         return; // Do nothing for other keys
//       }
  
//       // Send paddle movement to the server
//       socket.send(JSON.stringify({ deltaY }));
//     };

//     window.addEventListener('keydown', handleKeyPress);

//     // Cleanup function
//     return () => {
//       window.removeEventListener('keydown', handleKeyPress);
//       socket.close();
//     };
//   }, []);

//   // return (
//   //   <div className="App">
//   //     <div className="game-area">
//   //       {showGoalOverlay && (
//   //         <div className="goal-overlay">
//   //           <p className="goal-text">GOAL!</p>
//   //         </div>
//   //       )}
//   //       <div style={{ position: 'absolute', left: '20px', top: `${leftPaddleY}px`, width: '20px', height: '100px', backgroundColor: 'blue' }}></div>
//   //       <div style={{ position: 'absolute', right: '20px', top: `${rightPaddleY}px`, width: '20px', height: '100px', backgroundColor: 'red' }}></div>
//   //       <Ball top={ballPosition.y} left={ballPosition.x} />
//   //     </div>
//   //   </div>
//   // );

//   return (
//     <div className="App">
//       <div className="game-area">
//         <div className="paddle left-paddle" style={{ top: '150px', left: '20px' }}></div>
//         <div className="paddle right-paddle" style={{ top: '150px', right: '20px' }}></div>
//         <div className="ball" style={{ top: '190px', left: '290px' }}></div>
//       </div>
//     </div>
//   );
// }

// export default App;

/*
        STEP TWOOOO
*/

// import React, { useEffect, useState } from 'react';
// import './App.css';
// import Ball from './Ball';

// function App() {
//   // Adjusted initial positions to match the static setup
//   const [leftPaddleY, setLeftPaddleY] = useState(150); // Initial left paddle position
//   const [rightPaddleY, setRightPaddleY] = useState(150); // Initial right paddle position
//   const [ballPosition, setBallPosition] = useState({ x: 290, y: 190 }); // Initialize ball position
//   const [showGoalOverlay, setShowGoalOverlay] = useState(false);

//   useEffect(() => {
//     const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
//     const socketURI = `${protocol}//${window.location.hostname}:8000/ws/game/`;
//     const socket = new WebSocket(socketURI);

//     socket.onopen = () => {
//       console.log("WebSocket connection established");
//     };

//     // Just log the data for now, to ensure the WebSocket connection is working
//     socket.onmessage = (event) => {
//       console.log("Data received: ", event.data);
//       // Temporarily comment out state updates based on received data
//       /*
//       const data = JSON.parse(event.data);

//       if(data.paddles) {
//         setLeftPaddleY(data.paddles.left.y);
//         setRightPaddleY(data.paddles.right.y);
//       }
      
//       if(data.ball) {
//         setBallPosition({ x: data.ball.x, y: data.ball.y });
//       }

//       if(data.type === 'goalScored') {
//         setShowGoalOverlay(true);
//         setTimeout(() => setShowGoalOverlay(false), 1500);
//       }
//       */
//     };

//     const handleKeyPress = (event) => {
//       let deltaY = 0;

//       if (event.key === 'w' || event.key === 'ArrowUp') {
//         deltaY = -40;
//       } else if (event.key === 's' || event.key === 'ArrowDown') {
//         deltaY = 40;
//       } else {
//         return;
//       }

//       // Temporarily comment out sending paddle movement to the server
//       // socket.send(JSON.stringify({ deltaY }));
//     };

//     window.addEventListener('keydown', handleKeyPress);

//     return () => {
//       window.removeEventListener('keydown', handleKeyPress);
//       socket.close();
//     };
//   }, []);

//   return (
//     <div className="App">
//       <div className="game-area">
//         {/* Use state values to dynamically position elements */}
//         <div className="paddle left-paddle" style={{ top: `${leftPaddleY}px`, left: '20px' }}></div>
//         <div className="paddle right-paddle" style={{ top: `${rightPaddleY}px`, right: '20px' }}></div>
//         <Ball top={ballPosition.y} left={ballPosition.x} />
//       </div>
//     </div>
//   );
// }

// export default App;



/*
        STEP THREE
*/

import React, { useEffect, useState } from 'react';
import './App.css';
import Ball from './Ball';

function App() {
  const [leftPaddleY, setLeftPaddleY] = useState(150);
  const [rightPaddleY, setRightPaddleY] = useState(150);
  const [ballPosition, setBallPosition] = useState({ x: 290, y: 190 });
  const [showGoalOverlay, setShowGoalOverlay] = useState(false);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socketURI = `${protocol}//${window.location.hostname}:8000/ws/game/`;
    const socket = new WebSocket(socketURI);

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Data received: ", data);

      // Dynamically update state based on the data received
      if (data.paddles) {
        setLeftPaddleY(data.paddles.left.y);
        setRightPaddleY(data.paddles.right.y);
      }
      
      if (data.ball) {
        setBallPosition({ x: data.ball.x, y: data.ball.y });
      }

      if (data.type === 'goalScored') {
        setShowGoalOverlay(true);
        setTimeout(() => setShowGoalOverlay(false), 1500); // Show goal overlay for 1.5 seconds
      }
    };

    // Re-enable sending paddle movement to the server based on user input
    const handleKeyPress = (event) => {
      let deltaY = 0;

      if (event.key === 'w' || event.key === 'ArrowUp') {
        deltaY = -40; // Move up
      } else if (event.key === 's' || event.key === 'ArrowDown') {
        deltaY = 40; // Move down
      } else {
        return; // Ignore other keys
      }

      socket.send(JSON.stringify({ deltaY })); // Send the deltaY to the server
    };

    window.addEventListener('keydown', handleKeyPress);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      socket.close();
    };
  }, []);

  return (
    <div className="App">
      <div className="game-area">
        {/* Use state values for dynamic positioning */}
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
