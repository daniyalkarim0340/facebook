import { useEffect, useRef } from "react";

export default function ChatBackground({ darkMode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let sparks = [];

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    // State Machine Architecture for the Two Combatants
    const fighters = [
      {
        id: "alpha",
        x: window.innerWidth * 0.25,
        y: window.innerHeight * 0.5,
        vx: 0,
        vy: 0,
        radius: 14,
        baseColor: darkMode ? "34, 211, 238" : "14, 165, 233", // Cyan / Sky Blue
        state: "stalk", // stalk, dash, recoil
        timer: 0,
        energy: 100,
      },
      {
        id: "omega",
        x: window.innerWidth * 0.75,
        y: window.innerHeight * 0.5,
        vx: 0,
        vy: 0,
        radius: 14,
        baseColor: darkMode ? "239, 68, 68" : "220, 38, 38", // Crimson Red
        state: "stalk",
        timer: 0,
        energy: 100,
      },
    ];

    const createSparks = (x, y, color) => {
      const count = 18;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: Math.random() * 0.03 + 0.02,
          color,
        });
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Core Frame Update & Physics Processing
    const render = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const [f1, f2] = fighters;

      // 1. Core Combat Vector Math & State Machine
      fighters.forEach((f, idx) => {
        const opponent = idx === 0 ? f2 : f1;
        const dx = opponent.x - f.x;
        const dy = opponent.y - f.y;
        const dist = Math.hypot(dx, dy);

        f.timer--;

        if (f.state === "stalk") {
          // Creep closer to target opponent boundaries
          const speedFactor = 0.8;
          f.vx = (dx / dist) * speedFactor + (Math.random() - 0.5) * 0.5;
          f.vy = (dy / dist) * speedFactor + (Math.random() - 0.5) * 0.5;

          // Random chance execution to trigger an offensive dash lunge
          if (dist < 350 && f.timer <= 0 && Math.random() < 0.015) {
            f.state = "dash";
            f.vx = (dx / dist) * 9; // High velocity Strike
            f.vy = (dy / dist) * 9;
            f.timer = 25; // Dash duration frame cap
          }
        } else if (f.state === "dash") {
          if (f.timer <= 0) {
            f.state = "stalk";
            f.timer = 30; // Global cooldown recovery
          }
        } else if (f.state === "recoil") {
          f.vx *= 0.88; // Apply clean kinetic friction damping
          f.vy *= 0.88;
          if (f.timer <= 0) {
            f.state = "stalk";
            f.timer = 40;
          }
        }

        // Apply updated positional updates
        f.x += f.vx;
        f.y += f.vy;

        // Keep inside viewport limits
        if (f.x < 40) f.x = 40;
        if (f.x > w - 40) f.x = w - 40;
        if (f.y < 40) f.y = 40;
        if (f.y > h - 40) f.y = h - 40;
      });

      // 2. Proximity Clash Checking Subsystem
      const currentDist = Math.hypot(f2.x - f1.x, f2.y - f1.y);
      if (currentDist < f1.radius + f2.radius) {
        const midX = (f1.x + f2.x) / 2;
        const midY = (f1.y + f2.y) / 2;

        // Inject burst particles instantly at contact node point
        createSparks(midX, midY, f1.state === "dash" ? f1.baseColor : f2.baseColor);

        // Execute Reverse Velocity Recoil Shifts
        fighters.forEach((f, idx) => {
          const opponent = idx === 0 ? f2 : f1;
          const rDx = f.x - opponent.x;
          const rDy = f.y - opponent.y;
          const rDist = Math.hypot(rDx, rDy) || 1;

          f.state = "recoil";
          f.vx = (rDx / rDist) * 6;
          f.vy = (rDy / rDist) * 6;
          f.timer = 15;
        });
      }

      // 3. Render Kinetic Flash Particles
      sparks = sparks.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;

        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${s.alpha})`;
        ctx.fill();

        return s.alpha > 0;
      });

      // 4. Render Fighter Avatars with Motion Trails
      fighters.forEach((f) => {
        // Draw trailing ghost energy lanes if executing a dash attack
        if (f.state === "dash") {
          ctx.beginPath();
          ctx.moveTo(f.x, f.y);
          ctx.lineTo(f.x - f.vx * 2, f.y - f.vy * 2);
          ctx.strokeStyle = `rgba(${f.baseColor}, 0.25)`;
          ctx.lineWidth = f.radius * 1.5;
          ctx.stroke();
        }

        // Draw Core Combat Entity
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${f.baseColor}, ${darkMode ? 0.08 : 0.14})`;
        ctx.strokeStyle = `rgba(${f.baseColor}, ${f.state === "dash" ? 0.7 : 0.35})`;
        ctx.lineWidth = f.state === "dash" ? 2.5 : 1.5;
        ctx.stroke();
        ctx.fill();

        // Core Focal Reticle Point
        ctx.beginPath();
        ctx.arc(f.x, f.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${f.baseColor}, 0.8)`;
        ctx.fill();
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
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-80"
    />
  );
}