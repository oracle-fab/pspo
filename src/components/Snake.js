// src/components/Snake.js

import React, { useEffect, useRef } from 'react';

const Snake = ({ width, height }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Snake properties
    const snakeSize = 10;
    let snakeX = 0;
    let snakeY = 0;
    let dx = 2;
    let dy = 0;

    const drawSnake = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'red';
      ctx.fillRect(snakeX, snakeY, snakeSize, snakeSize);
    };

    const moveSnake = () => {
      snakeX += dx;
      snakeY += dy;

      // Change direction when hitting the edges
      if (snakeX <= 0 || snakeX >= width - snakeSize) {
        dx = -dx;
        dy = dx > 0 ? -2 : 2;
      }
      if (snakeY <= 0 || snakeY >= height - snakeSize) {
        dy = -dy;
        dx = dy > 0 ? 2 : -2;
      }
    };

    const animate = () => {
      moveSnake();
      drawSnake();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [width, height]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ position: 'absolute', pointerEvents: 'none' }} />;
};

export default Snake;