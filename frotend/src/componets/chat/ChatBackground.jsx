import { useEffect, useRef } from "react";

export default function ChatBackground({ darkMode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    let time = 0;
    
    // Engineering Parameters
    const particleCount = 160; 
    const flowScale = 0.0025;   
    const globalFriction = 0.96; 

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      
      if (particles.length === 0) {
        initSimulation();
      }
    };

    const initSimulation = () => {
      particles = [];
      const w = window.innerWidth;
      const h = window.innerHeight;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: 0,
          vy: 0,
          speed: Math.random() * 0.7 + 0.5,
          life: Math.random() * 150 + 100, 
          maxLife: 250,
          // 220 = Electric Cyan/Blue, 260 = Royal Purple/Amethyst
          hue: Math.random() > 0.5 ? 220 : 260 
        });
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const render = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // 1. BALANCE CONTRAST ACCUMULATION BUFFER
      if (darkMode) {
        ctx.fillStyle = "rgba(9, 9, 11, 0.06)"; // Ethereal dark decay
      } else {
        ctx.fillStyle = "rgba(244, 244, 245, 0.14)"; // Clean ink absorption on light paper
      }
      ctx.fillRect(0, 0, w, h);

      time += 0.0015; 

      particles.forEach((p) => {
        // Multi-layered fluid equations
        const angle = 
          Math.sin(p.x * flowScale + time) * Math.PI * 2 + 
          Math.cos(p.y * flowScale - time) * Math.PI * 1.5;

        const forceX = Math.cos(angle) * p.speed;
        const forceY = Math.sin(angle) * p.speed;

        p.vx += forceX * 0.15;
        p.vy += forceY * 0.15;
        p.vx *= globalFriction;
        p.vy *= globalFriction;
        p.x += p.vx;
        p.y += p.vy;

        p.life--;

        // Systemic recycling loop
        if (p.life <= 0 || p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
          p.x = Math.random() * w;
          p.y = Math.random() * h;
          p.vx = 0;
          p.vy = 0;
          p.life = Math.random() * 150 + 100;
        }

        // 2. HARDWARE VECTOR DRAW WITH DYNAMIC VISIBILITY WEIGHTS
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);

        const alphaRatio = Math.sin((p.life / p.maxLife) * Math.PI);
        
        if (darkMode) {
          // Dark Mode: Glowing luminescent neon vectors
          ctx.strokeStyle = `hsla(${p.hue}, 95%, 65%, ${alphaRatio * 0.22})`;
          ctx.lineWidth = 1.2;
        } else {
          // Light Mode: High-contrast, executive deep indigo and velvet lines
          // Dropped lightness to 35% and cranked opacity up to 0.45x for crystal-clear visibility
          ctx.strokeStyle = `hsla(${p.hue + 15}, 90%, 35%, ${alphaRatio * 0.45})`;
          ctx.lineWidth = 1.6; // Slightly thicker lines to pierce light mode brightness
        }

        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        display: "block"
      }}
    />
  );
}