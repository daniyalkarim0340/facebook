import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Terminal,
  Cpu,
  Globe2,
  Fingerprint,
  Zap,
  MessageSquare,
  Shield,
  ChevronRight,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Terminal,
    title: 'MERN Native Matrix',
    desc: 'Full-stack pipelines built for instant cross-origin communication and seamless API integration.',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    icon: Globe2,
    title: 'Real-Time Search',
    desc: 'Live web lookups powered by Llama agents that query the network layer in real time.',
    color: 'from-emerald-500 to-teal-400',
  },
  {
    icon: Fingerprint,
    title: 'Token Protection',
    desc: 'Cryptographic auth with secure session state across every workspace interaction.',
    color: 'from-violet-500 to-purple-400',
  },
];

const STATS = [
  { value: '8+', label: 'AI Models' },
  { value: '<2s', label: 'Avg Response' },
  { value: '24/7', label: 'Uptime' },
  { value: '100%', label: 'Encrypted' },
];

// Custom Easing Curves
const easeCubic = [0.16, 1, 0.3, 1];

// ============================================================================
// DYNAMIC KINETIC NEURAL MATRIX BACKGROUND ENGINE
// ============================================================================
function NeuralMatrixBackground({ isAwakened }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null, radius: 200 });
  const viewScaleRef = useRef(2.5); // Start zoomed in for the intro sequence

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let particles = [];
    const particleCount = 80;
    const connectionDist = 150;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 1,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.005,
        });
      }
    };

    window.addEventListener('resize', resize);
    resize();
    initParticles();

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Smoothly zoom camera scale out during awakening sequence
      if (isAwakened) {
        viewScaleRef.current += (1.0 - viewScaleRef.current) * 0.04;
      }

      ctx.save();
      // Translate coordinates to center, apply scale matrix, translate back
      ctx.translate(w / 2, h / 2);
      ctx.scale(viewScaleRef.current, viewScaleRef.current);
      ctx.translate(-w / 2, -h / 2);

      // Render Node Networks
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.pulseSpeed;

        // Boundary collision tracking
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Mouse Gravitational Pull Interaction
        if (mouseRef.current.x !== null) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouseRef.current.radius) {
            const force = (mouseRef.current.radius - dist) / mouseRef.current.radius;
            p.x -= (dx / dist) * force * 0.5;
            p.y -= (dy / dist) * force * 0.5;
          }
        }

        const alpha = 0.15 + Math.sin(p.phase) * 0.1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${Math.max(0.05, alpha)})`;
        ctx.fill();
      });

      // Render Synapse Web Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.14;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha * (isAwakened ? 1 : 0.2)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      ctx.restore();
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isAwakened]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none w-full h-full z-0 opacity-80" />;
}

// ============================================================================
// STAGGERED DECODER TEXT TYPING EFFECT
// ============================================================================
function TypewriterHeading({ text, className }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block whitespace-nowrap">
          {word.split("").map((char, charIdx) => (
            <motion.span
              key={charIdx}
              initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.4,
                delay: 1.8 + (wordIdx * 0.12) + (charIdx * 0.03),
                ease: "easeOut"
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
          <span>&nbsp;</span>
        </span>
      ))}
    </span>
  );
}

// ============================================================================
// COMPONENT: MOCK CHAT INTERACTION PREVIEW
// ============================================================================
function MockChatPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.96, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      transition={{ duration: 1.2, delay: 2.5, ease: easeCubic }}
      className="relative w-full max-w-xl mx-auto mt-6 perspective-1000"
    >
      <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-blue-500/10 rounded-3xl blur-3xl opacity-70" />
      <div className="relative bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60 bg-slate-950/60">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <span className="text-[10px] text-slate-500 font-mono tracking-wider">scholarly-ai — core_node_v4</span>
          <div className="w-3.5" />
        </div>
        <div className="p-5 space-y-4 min-h-[220px] text-left">
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3.2, duration: 0.5 }}
            className="flex justify-end"
          >
            <div className="bg-slate-800/80 text-slate-200 text-xs px-4 py-2.5 rounded-2xl rounded-tr-sm border border-slate-700/40 max-w-[80%] shadow-md">
              Initialize structural analysis on quantum entanglement vector fields.
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3.8, duration: 0.6 }}
            className="flex gap-3 items-start"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-lg shadow-cyan-500/20">
              AI
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 text-slate-300 text-xs px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed shadow-inner">
              Matrix alignment verified. Entanglement data maps successfully stream processing via secure pipeline channels...
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.4 }}
            className="flex gap-2 items-center pl-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN CORE INTERFACE PORTAL COMPONENT
// ============================================================================
export default function HomePortal() {
  const navigate = useNavigate();
  const [isAwakened, setIsAwakened] = useState(false);
  const [showIntroScreen, setShowIntroScreen] = useState(true);
  
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 90]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.2]);

  useEffect(() => {
    // Stage 1: Awakening Central Network Nodes
    const awakenTimer = setTimeout(() => setIsAwakened(true), 400);
    // Stage 2: Collapse Initial Loading Blind Curtain Overlay
    const UIAssembleTimer = setTimeout(() => setShowIntroScreen(false), 1600);

    return () => {
      clearTimeout(awakenTimer);
      clearTimeout(UIAssembleTimer);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#020617] text-white antialiased overflow-x-hidden font-sans relative selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* CINEMATIC APPARITION OVERLAY INTRO SCREEN */}
      <AnimatePresence>
        {showIntroScreen && (
          <motion.div
            exit={{ opacity: 0, filter: 'blur(20px)' }}
            transition={{ duration: 0.8, ease: easeCubic }}
            className="fixed inset-0 bg-[#020617] z-50 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={isAwakened ? { scale: [1, 1.8, 40], opacity: [0.2, 1, 0] } : { scale: 1, opacity: 0.4 }}
              transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
              className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_40px_10px_rgba(34,211,238,0.8)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE BACKGROUND GRAPHICS NETWORKS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[65vw] h-[65vw] rounded-full bg-blue-600/10 blur-[140px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-500/8 blur-[160px] mix-blend-screen" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <NeuralMatrixBackground isAwakened={isAwakened} />

      {/* NAVIGATION INTERFACE */}
      <motion.nav
        initial={{ opacity: 0, y: -25 }}
        animate={!showIntroScreen ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: easeCubic }}
        className="relative z-40 flex h-16 items-center justify-between px-6 md:px-12 border-b border-slate-900 bg-slate-950/40 backdrop-blur-xl sticky top-0 shadow-lg shadow-black/10"
      >
        <div className="flex items-center gap-2.5 cursor-default group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/10 group-hover:rotate-12 transition-transform duration-300">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Scholarly AI</span>
            <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase -mt-0.5">Agent Core</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-slate-900/50"
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="relative overflow-hidden group text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/10 transition-transform active:scale-95"
          >
            {/* Glossy light-sweep sheen */}
            <span className="absolute inset-0 w-1/2 h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-shine" style={{ animationDuration: '1s' }} />
            <span className="relative z-10">Get Started</span>
          </button>
        </div>
      </motion.nav>

      {/* MAIN HERO STAGE */}
      <motion.main style={{ y: heroY, opacity: heroOpacity }} className="relative z-10">
        <div className="flex flex-col items-center text-center px-6 max-w-5xl mx-auto pt-20 md:pt-28 pb-12 space-y-8">
          
          {/* Subheader Banner Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
            animate={!showIntroScreen ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-slate-900/60 border border-slate-800 text-[10px] font-bold tracking-widest text-cyan-400 uppercase px-4 py-1.5 rounded-full shadow-inner"
          >
            <Cpu className="h-3 w-3 animate-pulse" />
            Next-Gen AI Compute Infrastructure
          </motion.div>

          {/* Staggered Dynamic Typography */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] max-w-4xl">
            <TypewriterHeading text="The elite platform for" className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent" />
            <br />
            <TypewriterHeading text="autonomous AI workflows" className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={!showIntroScreen ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 2.2 }}
            className="text-sm sm:text-base text-slate-400 max-w-2xl font-medium leading-relaxed"
          >
            Deploy premium Llama inference pipelines synchronized with real-time web search.
            Built for developers who demand speed, state protection, and pristine experiences.
          </motion.p>

          {/* Interactive Call-To-Action Operations */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={!showIntroScreen ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 2.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto"
          >
            <button
              onClick={() => navigate('/register')}
              className="relative overflow-hidden group w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-cyan-500/20 active:scale-95 transition-transform"
            >
              <span className="absolute inset-0 w-1/2 h-full bg-white/15 transform -skew-x-12 -translate-x-full group-hover:animate-shine" />
              Start Free Today
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm px-7 py-3.5 text-sm font-semibold text-slate-300 hover:border-slate-700 hover:bg-slate-800/40 transition-colors"
            >
              <MessageSquare className="h-4 w-4 text-slate-500" />
              Open Workspace
            </button>
          </motion.div>

          <MockChatPreview />
        </div>

        {/* METRICS PLATFORM INTERFACE */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto px-6 py-14 border-y border-slate-900/80 bg-slate-950/20 backdrop-blur-[2px]">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: easeCubic }}
              className="text-center"
            >
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* CORE CAPABILITIES MODULES */}
        <section className="max-w-5xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">
              <Zap className="w-3.5 h-3.5 animate-pulse" /> Core Capabilities
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Everything you need to build with AI</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, delay: i * 0.15, ease: easeCubic }}
                  whileHover={{ y: -5, border: '1px solid rgba(148, 163, 184, 0.15)', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}
                  className="group relative p-6 rounded-2xl bg-slate-900/20 border border-slate-900 transition-all duration-300 backdrop-blur-md shadow-lg"
                >
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg shadow-black/20 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                  <ChevronRight className="absolute bottom-6 right-6 w-4 h-4 text-slate-700 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CALL TO ACTION CONTAINER */}
        <section className="max-w-4xl mx-auto px-6 pb-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeCubic }}
            className="relative overflow-hidden rounded-3xl border border-slate-900 bg-gradient-to-br from-slate-900/60 via-slate-950/40 to-slate-950 p-10 md:p-14 text-center backdrop-blur-sm"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <Shield className="w-10 h-10 text-cyan-400 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">Ready to deploy your AI workspace?</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Join thousands of developers using Scholarly AI for research, coding pipelines, and real-time computation layers.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="relative overflow-hidden group inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-xl shadow-cyan-500/10 active:scale-95 transition-transform"
            >
              <span className="absolute inset-0 w-1/2 h-full bg-white/15 transform -skew-x-12 -translate-x-full group-hover:animate-shine" />
              Create Free Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </section>
      </motion.main>

      {/* LAYOUT FOOTER MODULE */}
      <footer className="relative z-10 border-t border-slate-950 px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-medium text-slate-500 bg-slate-950/60 backdrop-blur-sm">
        <div>© 2026 Scholarly AI Platform. Secure pipeline engine active.</div>
        <div className="flex items-center gap-6 mt-3 sm:mt-0 text-xs">
          <a href="#terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}