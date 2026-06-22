import { useEffect, useRef } from "react";

export default function ChatBackground({ darkMode, mode = "bubbles" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let raf;
    let bubbles = [];
    let sparks = [];
    let stars = [];
    let lines = [];
    var time = 0;

    const init = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      bubbles = [];
      sparks = [];
      stars = [];
      lines = [];

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

        sparks.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.random() * 2 - 1,
          vy: Math.random() * 2 - 1,
          size: Math.random() * 2 + 1,
          speed: Math.random() * 0.5 + 0.1,
          hue: Math.random() * 360,
        });

        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.random() * 0.1 - 0.05,
          vy: Math.random() * 0.1 - 0.05,
          size: Math.random() * 1 + 0.5,
          speed: Math.random() * 0.01 + 0.01,
          hue: Math.random() * 360,
        });

        lines.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.random() * 2 - 1,
          vy: Math.random() * 2 - 1,
          length: Math.random() * 50 + 20,
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

      // Bubbles
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

      // Sparks
      sparks.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;

        // reset
        if (s.x < 0 || s.x > w) {
          s.vx = -s.vx;
        }
        if (s.y < 0 || s.y > h) {
          s.vy = -s.vy;
        }

        // DRAW
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = darkMode
          ? `hsla(${s.hue}, 80%, 30%, 0.8)`
          : `hsla(${s.hue}, 80%, 90%, 0.6)`;
        ctx.fill();
      });

      // Stars
      stars.forEach((st) => {
        st.x += st.vx;
        st.y += st.vy;

        // reset
        if (st.x < 0 || st.x > w) {
          st.vx = -st.vx;
        }
        if (st.y < 0 || st.y > h) {
          st.vy = -st.vy;
        }

        // DRAW
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
        ctx.fillStyle = darkMode
          ? `hsla(${st.hue}, 80%, 20%, 0.9)`
          : `hsla(${st.hue}, 80%, 80%, 0.7)`;
        ctx.fill();
      });

      // Lines
      lines.forEach((l) => {
        l.x += l.vx;
        l.y += l.vy;

        // reset
        if (l.x < 0 || l.x > w) {
          l.vx = -l.vx;
        }
        if (l.y < 0 || l.y > h) {
          l.vy = -l.vy;
        }

        // DRAW
        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(l.x + l.vx * l.length, l.y + l.vy * l.length);
        ctx.strokeStyle = darkMode
          ? `hsla(${l.hue}, 80%, 40%, 0.7)`
          : `hsla(${l.hue}, 80%, 60%, 0.5)`;
        ctx.lineWidth = 2;
        ctx.stroke();
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