import React from 'react';
import './Paddle.css';

// //Added left, right to enable a left and right paddle.
// function Paddle({ top, left = '20px', right }) {
//   return (
//     <div className="paddle" style={{ top: `${top}%`, left, right }}></div>
//   );
// }

// function Paddle({ top, left, right }) {
//   const style = {
//     top: `${top}%`,
//     left: left ? `${left}` : undefined,
//     right: right ? `${right}` : undefined,
//   };
  
//   return <div className="paddle" style={style}></div>;
// }


function Paddle({ top, left, right }) {
  const style = {
    top: `${top}px`, // Change this to use pixels
    left: left ? `${left}` : undefined,
    right: right ? `${right}` : undefined,
  };

  return <div className="paddle" style={style}></div>;
}



export default Paddle;
