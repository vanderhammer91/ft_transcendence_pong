import React from 'react';
import './Paddle.css';

function Paddle({ top, left, right }) {
  const style = {
    top: `${top}px`, // Change this to use pixels
    left: left ? `${left}` : undefined,
    right: right ? `${right}` : undefined,
  };

  return <div className="paddle" style={style}></div>;
}

export default Paddle;