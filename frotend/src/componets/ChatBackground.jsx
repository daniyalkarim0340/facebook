import { useEffect, useRef } from "react";

export default function ChatBackground({ darkMode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let balls = [];
    const numBalls = 20; // Adjust the quantity of balls here

    // Resize handler to keep canvas full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize ball objects with random positions, velocities, and sizes
    const initBalls = () => {
      balls = [];
      for (let i = 0; i < numBalls; i++) {
        const radius = Math.random() * 12 + 6; // Radius between 6px and 18px
        balls.push({
          x: Math.random() * (canvas.width - radius * 2) + radius,
          y: Math.random() * (canvas.height - radius * 2) + radius,
          vx: (Math.random() - 0.5) * 2.5, // Horizontal speed
          vy: (Math.random() - 0.5) * 2.5, // Vertical speed
          radius: radius,
        });
      }
    };
    initBalls();

    // Main animation loop running at 60fps
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      balls.forEach((ball) => {
        // Update physics position
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Collision detection for left/right walls
        if (ball.x - ball.radius <= 0) {
          ball.x = ball.radius;
          ball.vx *= -1;
        } else if (ball.x + ball.radius >= canvas.width) {
          ball.x = canvas.width - ball.radius;
          ball.vx *= -1;
        }

        // Collision detection for top/bottom walls
        if (ball.y - ball.radius <= 0) {
          ball.y = ball.radius;
          ball.vy *= -1;
        } else if (ball.y + ball.radius >= canvas.height) {
          ball.y = canvas.height - ball.radius;
          ball.vy *= -1;
        }

        // Draw the bouncing ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

        if (darkMode) {
          // Dark Mode: Soft glowing ethereal white orbs
          ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
          ctx.shadowBlur = 15;
          ctx.shadowColor = "rgba(255, 255, 255, 0.1)";
        } else {
          // Light Mode: Clean semi-transparent white frosted glass orbs with subtle gray borders
          ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
          ctx.strokeStyle = "rgba(0, 0, 0, 0.04)";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(0, 0, 0, 0.03)";
        }

        ctx.fill();
        // Reset shadow properties for subsequent rendering calculations
        ctx.shadowBlur = 0; 
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Clean up animation processes and event bindings when unmounting
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [darkMode]); // Re-run effect immediately when theme toggles to shift colors smoothly

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    />
  );
}