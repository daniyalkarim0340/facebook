import { useEffect, useRef } from "react";

export default function ChatBackground({ darkMode, mode = "bubbles" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let raf;
    let bubbles = [];
    var time = 0;

    const init = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      bubbles = [];

      const count = 100;

      for (let i = 0; i < count; i++) {
        bubbles.push({
          x: Math.random() * w,
          y: h + Math.random() * h,
          vx: 0,
          vy: Math.random() * 2 + 1,
          size: Math.random() * 10 + 5,
          speed: Math.random() * 0.5 + 0.1,
          hue: Math.random() * 360,
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

      bubbles.forEach((b) => {
        b.y -= b.vy;

        // reset
        if (b.y < -b.size) {
          b.x = Math.random() * w;
          b.y = h + Math.random() * h;
          b.vy = Math.random() * 2 + 1;
        }

        // DRAW
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = darkMode
          ? `hsla(${b.hue}, 80%, 50%, 0.5)`
          : `hsla(${b.hue}, 80%, 70%, 0.4)`;
        ctx.fill();
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