import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

function useParticles(count = 35) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 10 + 8,
        delay: Math.random() * 6,
        drift: Math.random() * 80 - 40,
      })),
    [count]
  );
}

export default function AuthBackground({ mousePos = { x: 0, y: 0 } }) {
  const particles = useParticles();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Soft ambient orbs */}
      <motion.div
        animate={{ x: mousePos.x * -1.2, y: mousePos.y * -1.2 }}
        transition={{ type: 'spring', stiffness: 40, damping: 22 }}
        className="absolute top-[15%] left-[20%] w-72 h-72 md:w-96 md:h-96 bg-blue-600/25 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ x: mousePos.x * 1.4, y: mousePos.y * 1.4 }}
        transition={{ type: 'spring', stiffness: 40, damping: 22 }}
        className="absolute bottom-[10%] right-[15%] w-80 h-80 md:w-[28rem] md:h-[28rem] bg-cyan-500/20 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ x: mousePos.x * 0.6, y: mousePos.y * -0.8 }}
        transition={{ type: 'spring', stiffness: 35, damping: 20 }}
        className="absolute top-[55%] left-[45%] w-48 h-48 bg-violet-600/10 rounded-full blur-[90px]"
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-cyan-400/70 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.2, 0.9, 0.2],
            y: [0, -120 - Math.random() * 80, -200],
            x: [0, p.drift, p.drift * 1.5],
            scale: [1, 1.2, 0.6],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
}

export function useMouseParallax() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    setMousePos({ x, y });
  };

  return { mousePos, handleMouseMove };
}
