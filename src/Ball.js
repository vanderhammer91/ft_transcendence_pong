import React from 'react';
import './Ball.css';

function Ball({ top, left }) {
  // Use the 'ball' class for styling and apply dynamic positioning with inline styles for 'top' and 'left'
  return (
    <div 
      className="ball" 
      style={{ 
        top: `${top}px`, 
        left: `${left}px`, 
        width: '20px', 
        height: '20px', 
        borderRadius: '50%', 
        backgroundColor: 'white',
        position: 'absolute'
      }} 
    />
  );
}


export default Ball;
