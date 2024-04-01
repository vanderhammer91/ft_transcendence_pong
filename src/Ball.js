import React from 'react';
import './Ball.css';

// function Ball({ top, left }) {
//   return (
//     <div className="ball" style={{ top: `${top}%`, left: `${left}%` }}></div>
//   );
// }


function Ball({ top, left }) {
  // Use the 'ball' class for styling and apply dynamic positioning with inline styles for 'top' and 'left'
  return (
    <div 
      className="ball" 
      style={{ 
        top: `${top}px`, 
        left: `${left}px`, 
      }} 
    />
  );
}


export default Ball;
