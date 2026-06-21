import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Cpu,
  Shield,
  Zap,
  ChevronRight,
  Command,
  Activity,
  Layers,
  Radio,
  ArrowUpRight,
  Database,
  Globe,
  Plus,
  Minus,
  CheckCircle2,
  Server
} from 'lucide-react';

const cubicBezierConfig = [0.16, 1, 0.3, 1];

// ============================================================================
// BACKGROUND RAY-TRACER CANVASES
// ============================================================================
function QuantumGridBackground({ isActive }) {
  const canvasRef = useRef(null);
  const mouseCoords = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, intensity: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId;
    const gridSpacing = 45;
    
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const trackMouse = (e) => {
      mouseCoords.current.targetX = e.clientX;
      mouseCoords.current.targetY = e.clientY;
      mouseCoords.current.intensity = 1;
    };

    window.addEventListener('mousemove', trackMouse);
    document.addEventListener('mouseleave', () => { mouseCoords.current.intensity = 0; });

    const renderLoop = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      mouseCoords.current.x += (mouseCoords.current.targetX - mouseCoords.current.x) * 0.08;
      mouseCoords.current.y += (mouseCoords.current.targetY - mouseCoords.current.y) * 0.08;

      ctx.strokeStyle = 'rgba(34, 211, 238, 0.03)';
      ctx.lineWidth = 1;

      for (let y = 0; y < h; y += gridSpacing) {
        ctx.beginPath();
        for (let x = 0; x < w; x += 10) {
          const distanceToMouse = Math.hypot(x - mouseCoords.current.x, y - mouseCoords.current.y);
          let offset = 0;
          if (distanceToMouse < 250) {
            const influence = (250 - distanceToMouse) / 250;
            offset = Math.sin(x * 0.01 + y) * 12 * influence * mouseCoords.current.intensity;
          }
          if (x === 0) ctx.moveTo(x, y + offset);
          else ctx.lineTo(x, y + offset);
        }
        ctx.stroke();
      }

      for (let x = 0; x < w; x += gridSpacing) {
        ctx.beginPath();
        for (let y = 0; y < h; y += 10) {
          const distanceToMouse = Math.hypot(x - mouseCoords.current.x, y - mouseCoords.current.y);
          let offset = 0;
          if (distanceToMouse < 250) {
            const influence = (250 - distanceToMouse) / 250;
            offset = Math.cos(y * 0.01 + x) * 12 * influence * mouseCoords.current.intensity;
          }
          if (y === 0) ctx.moveTo(x + offset, y);
          else ctx.lineTo(x + offset, y);
        }
        ctx.stroke();
      }

      frameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', trackMouse);
    };
  }, [isActive]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

// ============================================================================
// CHARACTER TYPOGRAPHY DECODER
// ============================================================================
function GlowDecodeText({ children, delayOffset = 0 }) {
  const letters = children.split("");
  return (
    <span>
      {letters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, filter: 'blur(12px)', y: 20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.8, delay: delayOffset + index * 0.02, ease: cubicBezierConfig }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

// ============================================================================
// PIPELINE STREAM SIMULATOR
// ============================================================================
function LivePipelineConsole() {
  const [logs, setLogs] = useState([
    { id: 1, type: 'system', msg: 'System Core connection initialized successfully.' },
  ]);

  useEffect(() => {
    const logPool = [
      { type: 'process', msg: 'Streaming response weights via high-speed pipeline...' },
      { type: 'success', msg: 'Vector alignment verified inside database node [0x92f]' },
      { type: 'system', msg: 'Query lookups routed seamlessly through Llama inference layer.' },
      { type: 'process', msg: 'Cross-origin pipeline state: Securing active session states.' },
      { type: 'success', msg: 'Token validation encryption pass complete. State locked.' }
    ];

    const interval = setInterval(() => {
      setLogs((prev) => {
        const nextLog = logPool[Math.floor(Math.random() * logPool.length)];
        const updated = [...prev, { id: Date.now(), ...nextLog }];
        if (updated.length > 5) updated.shift();
        return updated;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-950/70 border border-slate-900 rounded-2xl p-5 font-mono text-xs shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-4 text-[10px] text-slate-500 tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>LIVE PIPELINE DEEP TRACE</span>
        </div>
        <span>MONITOR // ACTIVE</span>
      </div>
      <div className="space-y-2 min-h-[140px] text-left">
        <AnimatePresence mode="popLayout">
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
              transition={{ duration: 0.4 }}
              className="flex items-start gap-2.5"
            >
              <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-bold shrink-0 ${
                log.type === 'system' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                log.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              }`}>
                {log.type}
              </span>
              <span className="text-slate-300 leading-relaxed text-[11px]">{log.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================================
// SYSTEM PROTOCOLS FAQ ITEM
// ============================================================================
function ProtocolAccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-slate-900/80 overflow-hidden transition-colors duration-300">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="text-sm font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">{question}</span>
        <div className="h-6 w-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 transition-transform duration-300">
          {isOpen ? <Minus className="w-3.5 h-3.5 text-cyan-400" /> : <Plus className="w-3.5 h-3.5" />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <p className="pb-5 text-xs text-slate-400 leading-relaxed max-w-3xl">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// MAIN APPLICATION ROUTER PORTAL
// ============================================================================
export default function HomePortal() {
  const navigate = useNavigate();
  const [hasAssembled, setHasAssembled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  
  const { scrollY } = useScroll();
  // Isolate scroll fading ONLY to the hero viewport text layout
  const heroYAxisTransform = useTransform(scrollY, [0, 400], [0, -40]);
  const heroAlphaFadeTransform = useTransform(scrollY, [0, 350], [1, 0]);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('userSession');
    if (token) {
      setIsAuthenticated(true);
    }
    const assemblyTimer = setTimeout(() => setHasAssembled(true), 100);
    return () => clearTimeout(assemblyTimer);
  }, []);

  const executeAuthProtectedRouting = (alternativeRoute) => {
    if (isAuthenticated) {
      navigate('/chat');
    } else {
      navigate(alternativeRoute);
    }
  };

  const FAQS = [
    { q: 'How does real-time node routing function?', a: 'Every query submitted down the pipeline automatically links directly with live edge-workers. It completely destroys traditional cold-starts by pre-allocating computing channels directly to user memory.' },
    { q: 'Are data streams securely protected?', a: 'Absolutely. Session variables and query flows utilize cryptographically isolated memory spaces. No third-party engines ever get clear access to your core data records.' },
    { q: 'Can I hook up my own custom REST APIs?', a: 'Yes. The interface engine scales elegantly over classic MERN connections. Simply inject your endpoint variables right into your workspace configurations panel.' }
  ];

  return (
    <div className="min-h-screen w-full bg-[#030712] text-slate-100 antialiased overflow-x-hidden font-sans relative selection:bg-cyan-500/20 selection:text-cyan-300">
      
      {/* SHIELDED INITIAL SYSTEM OVERLAY */}
      <AnimatePresence>
        {!hasAssembled && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-[#030712] z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="flex flex-col items-center gap-3">
              <Command className="w-6 h-6 text-cyan-400 animate-spin" />
              <div className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-mono font-bold">Assembling System Parameters</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AMBIENT VECTOR LIGHT LAYERS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <div className="absolute top-[-25%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-br from-cyan-500/10 to-transparent blur-[160px]" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-tr from-indigo-600/10 to-transparent blur-[180px]" />
      </div>

      <QuantumGridBackground isActive={hasAssembled} />

      {/* STICKY GLASS FRAME LAYOUT NAVIGATION */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={hasAssembled ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: cubicBezierConfig }}
        className="z-40 h-20 items-center justify-between px-6 md:px-12 bg-slate-950/25 backdrop-blur-xl border-b border-slate-900/60 sticky top-0 flex shadow-2xl shadow-black/20"
      >
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="h-10 w-10 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:border-cyan-500/40 shadow-inner">
            <Command className="h-4 w-4 text-cyan-400 transition-transform duration-500 group-hover:rotate-180" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-white">NOVA MATRIX</span>
            <span className="text-[9px] font-bold text-cyan-500/80 tracking-[0.2em] uppercase -mt-0.5">Neural Cluster</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => executeAuthProtectedRouting('/login')}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-slate-900/40"
          >
            {isAuthenticated ? 'Enter Workspace' : 'Log In'}
          </button>
          <button
            onClick={() => executeAuthProtectedRouting('/register')}
            className="relative overflow-hidden group text-xs font-semibold bg-white text-slate-950 px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-1.5 font-bold">
              {isAuthenticated ? 'Launch Console' : 'Get Started'}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </motion.nav>

      {/* CORE FRAMEWORK STAGE */}
      <main className="relative z-10 pt-24 md:pt-32 px-6 max-w-6xl mx-auto flex flex-col items-center">
        
        {/* HERO LOGIC CONTAINER - (Scroll Transformations bound exclusively here) */}
        <motion.div 
          style={{ y: heroYAxisTransform, opacity: heroAlphaFadeTransform }}
          className="flex flex-col items-center w-full"
        >
          <div className="inline-flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase px-4 py-2 rounded-xl shadow-inner mb-8">
            <Activity className="h-3 w-3 text-cyan-400 animate-pulse" />
            SYSTEM LAYER V2.0 STABLE // ACTIVE
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-center leading-[1.05] max-w-5xl">
            <GlowDecodeText delayOffset={0.1}>Autonomous processing layers</GlowDecodeText>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
              <GlowDecodeText delayOffset={0.6}>for high-throughput workflows.</GlowDecodeText>
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl text-center mt-8 font-medium leading-relaxed">
             Orchestrate premium full-stack LLM operational architectures with zero cross-origin processing bottlenecks. High-speed distributed state machines explicitly structured for web interface architectures.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full sm:w-auto">
            <button
              onClick={() => executeAuthProtectedRouting('/register')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/20 active:scale-95 transition-all duration-300"
            >
              {isAuthenticated ? 'Open Active Terminal' : 'Initialize Stack'}
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => executeAuthProtectedRouting('/login')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/20 backdrop-blur-md px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-300 hover:border-slate-700 hover:bg-slate-800/40 transition-all duration-300"
            >
              <Terminal className="h-4 w-4 text-slate-500" />
              {isAuthenticated ? 'View Chat History' : 'System Authorization'}
            </button>
          </div>
        </motion.div>

        {/* PIPELINE LIVE TRACE ENVIRONMENT */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: cubicBezierConfig }}
          className="w-full max-w-3xl mt-28 text-center"
        >
          <div className="text-[10px] tracking-[0.25em] font-bold uppercase text-slate-500 mb-4 flex items-center justify-center gap-2">
            <Server className="w-3 h-3 text-cyan-400" /> LIVE ENVIRONMENT PIPELINES
          </div>
          <LivePipelineConsole />
        </motion.div>

        {/* SCROLL-REVEALED BENTO GRID FIELD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-32">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: cubicBezierConfig }}
            whileHover={{ y: -6, borderColor: 'rgba(34, 211, 238, 0.25)' }}
            className="group relative p-8 rounded-3xl bg-slate-900/10 border border-slate-900 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between h-64 overflow-hidden shadow-2xl shadow-black/40"
          >
            <div className="h-11 w-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                Distributed Vectors <span className="text-[9px] bg-cyan-500/10 text-cyan-400 font-mono px-1.5 py-0.5 rounded border border-cyan-500/20">DB</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">High-density MERN vector streaming arrays natively optimized for sub-millisecond retrieval layers.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.05, ease: cubicBezierConfig }}
            whileHover={{ y: -6, borderColor: 'rgba(59, 130, 246, 0.25)' }}
            className="group relative p-8 rounded-3xl bg-slate-900/10 border border-slate-900 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between h-64 overflow-hidden shadow-2xl shadow-black/40"
          >
            <div className="h-11 w-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                Zero-State Syncing <span className="text-[9px] bg-blue-500/10 text-blue-400 font-mono px-1.5 py-0.5 rounded border border-blue-500/20">Live</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">Bi-directional socket architectures keeping user matrix states locked and updated across nodes.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: cubicBezierConfig }}
            whileHover={{ y: -6, borderColor: 'rgba(168, 85, 247, 0.25)' }}
            className="group relative p-8 rounded-3xl bg-slate-900/10 border border-slate-900 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between h-64 overflow-hidden shadow-2xl shadow-black/40"
          >
            <div className="h-11 w-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                Token Enclaves <span className="text-[9px] bg-purple-500/10 text-purple-400 font-mono px-1.5 py-0.5 rounded border border-purple-500/20">Auth</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">Cryptographically signed authorization signatures safeguarding sensitive context pipelines.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, ease: cubicBezierConfig }}
            className="md:col-span-2 group relative p-8 rounded-3xl bg-slate-900/10 border border-slate-900 backdrop-blur-xl hover:border-cyan-500/20 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center h-auto md:h-56 overflow-hidden shadow-2xl shadow-black/40 gap-6"
          >
            <div className="max-w-md">
              <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 mb-4">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">Automated Execution Pipelines</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Trigger custom internal routines directly through automated agents. Built natively to prevent runtime leakage across external browser systems.</p>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-4 font-mono text-[10px] text-slate-400 w-full md:w-auto shrink-0 shadow-inner">
              <div className="text-cyan-400 mb-1">▶ run_agent_cluster</div>
              <div>[STATUS] Pipeline allocated</div>
              <div className="text-emerald-400">[SUCCESS] Vector sync: 100%</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: 0.05, ease: cubicBezierConfig }}
            whileHover={{ borderColor: 'rgba(59, 130, 246, 0.2)' }}
            className="group relative p-8 rounded-3xl bg-slate-900/10 border border-slate-900 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between h-auto md:h-56 overflow-hidden shadow-2xl shadow-black/40"
          >
            <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Global Live Trace</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Instantly stream live network data pipelines with zero lag overhead or processing interruptions.</p>
            </div>
          </motion.div>
        </div>

        {/* COMPUTE ALLOCATION GRID TIER MODULES */}
        <section className="w-full mt-36">
          <div className="text-center mb-16">
            <div className="text-[10px] tracking-[0.2em] font-bold uppercase text-cyan-400 mb-2 flex items-center justify-center gap-1.5">
              <Zap className="w-3 h-3 animate-pulse" /> COMPUTE POWER DISTRIBUTIONS
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Sleek Compute Tiers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
            
            {/* Standard Compute Frame */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: cubicBezierConfig }}
              whileHover={{ y: -5, borderColor: 'rgba(255,255,255,0.1)' }}
              className="bg-slate-900/10 border border-slate-900 rounded-3xl p-8 backdrop-blur-xl relative flex flex-col justify-between h-[400px] transition-all group shadow-2xl shadow-black/50"
            >
              <div>
                <div className="text-xs font-mono text-slate-500 tracking-wider uppercase mb-1">Standard Compute</div>
                <div className="text-2xl font-bold text-white flex items-baseline gap-1">
                  $0 <span className="text-xs text-slate-500 font-normal">/ month</span>
                </div>
                <div className="space-y-3 mt-6">
                  {['Standard processing pipelines', 'Isolated state environments', 'Basic token protection rules'].map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-xs text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-slate-700 group-hover:text-cyan-500 transition-colors" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => executeAuthProtectedRouting('/register')} className="w-full bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all">
                Initialize Free Layer
              </button>
            </motion.div>

            {/* Enterprise Core Premium Frame */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: cubicBezierConfig }}
              whileHover={{ y: -5, scale: 1.01, borderColor: 'rgba(34, 211, 238, 0.4)' }}
              className="bg-gradient-to-b from-cyan-500/[0.03] to-transparent border border-cyan-500/20 rounded-3xl p-8 backdrop-blur-xl relative flex flex-col justify-between h-[400px] shadow-2xl shadow-cyan-500/5 transition-all group"
            >
              <div className="absolute top-4 right-4 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[9px] uppercase font-bold px-2.5 py-1 rounded-md tracking-wider animate-pulse">
                Max Priority
              </div>
              <div>
                <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase mb-1">Enterprise Core</div>
                <div className="text-2xl font-bold text-white flex items-baseline gap-1">
                  $29 <span className="text-xs text-slate-500 font-normal">/ month</span>
                </div>
                <div className="space-y-3 mt-6">
                  {['Unlimited distributed vectors', 'Live socket sync integrations', 'Cryptographic enclave shields', 'Priority multi-model pipelines'].map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => executeAuthProtectedRouting('/register')} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all">
                Provision Network Access
              </button>
            </motion.div>
          </div>
        </section>

        {/* CORE ACCORDION (FAQ MODULE) */}
        <section className="w-full max-w-3xl mt-36 border-t border-slate-900/60 pt-24">
          <div className="mb-10 text-left">
            <div className="text-[10px] tracking-[0.2em] font-mono text-slate-500 uppercase mb-1">SECURITY & CAPABILITY ARRAYS</div>
            <h2 className="text-lg font-bold text-white">System Protocols FAQ</h2>
          </div>
          <div className="flex flex-col">
            {FAQS.map((faq, idx) => (
              <ProtocolAccordionItem
                key={idx}
                question={faq.q}
                answer={faq.a}
                isOpen={activeFaq === idx}
                onToggle={() => setActiveFaq(activeFaq === idx ? null : idx)}
              />
            ))}
          </div>
        </section>

        {/* BRIGHT CRUCIAL CALL-TO-ACTION CONTAINER (100% PERMANENT VISIBILITY) */}
        <section className="w-full max-w-4xl pb-32 mt-36">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, ease: cubicBezierConfig }}
            className="relative overflow-hidden rounded-3xl border border-slate-900/80 bg-slate-950/80 p-12 text-center backdrop-blur-xl shadow-2xl shadow-black"
          >
            {/* Pulsing decorative radar ring animation frames */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-cyan-500/5 rounded-full pointer-events-none animate-ping" style={{ animationDuration: '4s' }} />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

            <Cpu className="w-8 h-8 text-cyan-400 mx-auto mb-4 opacity-80 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">Deploy your customized workspace instance</h2>
            <p className="text-slate-400 text-xs max-w-sm mx-auto mb-8 leading-relaxed">
              Connect runtime environments to live query processors instantly.
            </p>
            
            <button
              onClick={() => executeAuthProtectedRouting('/register')}
              className="group relative inline-flex items-center gap-2 bg-white text-slate-950 font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all duration-300 active:scale-95 hover:bg-slate-100 shadow-xl shadow-white/5 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                {isAuthenticated ? 'Re-Open Terminal Session' : 'Provision Account'}
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          </motion.div>
        </section>

      </main>

      {/* FOOTER INTERFACE LAYER */}
      <footer className="relative z-10 border-t border-slate-950 px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono tracking-wider text-slate-500 bg-slate-950/60 backdrop-blur-md">
        <div>© 2026 NOVA MATRIX LAYER. CHANNELS ENCRYPTED via AES-256.</div>
        <div className="flex items-center gap-6 mt-3 sm:mt-0 uppercase">
          <a href="#network" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" /> Node Status: Optimal
          </a>
          <a href="#docs" className="hover:text-slate-300 transition-colors">API Systems</a>
        </div>
      </footer>
    </div>
  );
}