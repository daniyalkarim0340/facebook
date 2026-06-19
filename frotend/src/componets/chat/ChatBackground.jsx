import { useEffect, useRef } from "react";

export default function ChatBackground({ darkMode, mode = "flow" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let raf;
    let particles = [];
    let time = 0;

    const init = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      particles = [];

      const count =
        mode === "stars" ? 120 :
        mode === "rain" ? 180 :
        mode === "words" ? 80 :
        160;

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: 0,
          vy: 0,
          size: Math.random() * 2 + 1,
          speed: Math.random() * 1 + 0.5,
          hue: Math.random() > 0.5 ? 200 : 280,
          text: ["AI","CODE","CHAT","DATA","FLOW"][Math.floor(Math.random()*5)],
        });
      }
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    };

    window.addEventListener("resize", resize);
    resize();

    const render = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // fade background
      ctx.fillStyle = darkMode
        ? "rgba(10,10,15,0.08)"
        : "rgba(245,245,250,0.12)";
      ctx.fillRect(0, 0, w, h);

      time += 0.01;

      particles.forEach((p) => {

        // 🌊 FLOW MODE (your original)
        if (mode === "flow") {
          const angle =
            Math.sin(p.x * 0.002 + time) +
            Math.cos(p.y * 0.002 - time);

          p.vx += Math.cos(angle) * 0.3;
          p.vy += Math.sin(angle) * 0.3;
          p.vx *= 0.96;
          p.vy *= 0.96;
        }

        // 🌧️ RAIN MODE
        if (mode === "rain") {
          p.vy += 0.2;
        }

        // ✨ STARS MODE
        if (mode === "stars") {
          p.x += (p.x - w / 2) * 0.0005;
          p.y += (p.y - h / 2) * 0.0005;
        }

        // 📜 WORD MODE
        if (mode === "words") {
          p.y += 1.2;
        }

        p.x += p.vx;
        p.y += p.vy;

        // reset
        if (p.x < 0 || p.x > w || p.y > h || p.y < 0) {
          p.x = Math.random() * w;
          p.y = mode === "rain" ? -10 : Math.random() * h;
          p.vx = 0;
          p.vy = 0;
        }

        // DRAW
        ctx.beginPath();

        if (mode === "words") {
          ctx.fillStyle = `rgba(0,200,255,0.6)`;
          ctx.font = "12px monospace";
          ctx.fillText(p.text, p.x, p.y);
        } else {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = darkMode
            ? `rgba(0,200,255,0.5)`
            : `rgba(80,100,255,0.4)`;
          ctx.fill();
        }
      });

      raf = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [darkMode, mode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}