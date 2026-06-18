import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
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
import { landingContainerVariants, landingItemVariants, landingCardVariants } from '../componets/auth/authAnimations';

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

function MockChatPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-lg mx-auto mt-4 perspective-1000"
    >
      <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-blue-500/20 rounded-3xl blur-2xl" />
      <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-950/80">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[10px] text-slate-500 font-mono ml-2">scholarly-ai — workspace</span>
        </div>
        <div className="p-5 space-y-4 min-h-[200px]">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="flex justify-end"
          >
            <div className="bg-slate-700 text-slate-100 text-xs px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[75%]">
              Explain quantum computing in simple terms
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 }}
            className="flex gap-2 items-start"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
              AI
            </div>
            <div className="bg-slate-800/80 border border-slate-700/50 text-slate-300 text-xs px-4 py-3 rounded-2xl rounded-tl-sm max-w-[80%] leading-relaxed">
              Quantum computers use qubits that can exist in multiple states at once — like a coin spinning in the air instead of landing heads or tails...
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="flex gap-2 items-center pl-9"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 typing-dot" style={{ animationDelay: '0s' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 typing-dot" style={{ animationDelay: '0.25s' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 typing-dot" style={{ animationDelay: '0.5s' }} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HomePortal() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, 80]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white antialiased overflow-x-hidden font-sans">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -25, 15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-blue-600/15 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -40, 25, 0], y: [0, 20, -30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-cyan-500/12 blur-[130px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-violet-600/10 blur-[100px]"
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.6) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-50 flex h-16 items-center justify-between px-6 md:px-12 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-xl sticky top-0"
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="flex items-center gap-2.5 cursor-default"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight">Scholarly AI</span>
            <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase -mt-0.5">Agent Core</span>
          </div>
        </motion.div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/login')}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-slate-800/60"
          >
            Log In
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(6,182,212,0.35)' }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/register')}
            className="text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20"
          >
            Get Started
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.main style={{ y: heroY, opacity: heroOpacity }} className="relative z-10">
        <motion.div
          variants={landingContainerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center px-6 max-w-5xl mx-auto pt-16 md:pt-24 pb-12 space-y-8"
        >
          <motion.div
            variants={landingItemVariants}
            className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-700/60 text-[10px] font-bold tracking-widest text-slate-400 uppercase px-4 py-1.5 rounded-full shadow-sm"
          >
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
              <Cpu className="h-3 w-3 text-cyan-400" />
            </motion.span>
            Next-Gen AI Compute Infrastructure
          </motion.div>

          <motion.h1
            variants={landingItemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] max-w-4xl"
          >
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              The elite platform for
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              autonomous AI workflows
            </span>
          </motion.h1>

          <motion.p
            variants={landingItemVariants}
            className="text-sm sm:text-base text-slate-400 max-w-2xl font-medium leading-relaxed"
          >
            Deploy premium Llama inference pipelines synchronized with real-time web search.
            Built for developers who demand speed, security, and a beautiful experience.
          </motion.p>

          <motion.div variants={landingItemVariants} className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-cyan-500/25"
            >
              Start Free Today
              <ArrowRight className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-7 py-3.5 text-sm font-semibold text-slate-300 hover:border-slate-600 hover:bg-slate-800/50 transition-colors"
            >
              <MessageSquare className="h-4 w-4 text-slate-500" />
              Open Workspace
            </motion.button>
          </motion.div>

          <motion.div variants={landingItemVariants}>
            <MockChatPreview />
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto px-6 py-12 border-y border-slate-800/60"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="text-center"
            >
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-1.5 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">
              <Zap className="w-3.5 h-3.5" /> Core Capabilities
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Everything you need to build with AI</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  custom={i}
                  variants={landingCardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="group relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700/80 transition-colors backdrop-blur-sm"
                >
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                  <ChevronRight className="absolute bottom-6 right-6 w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto px-6 pb-24"
        >
          <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-10 md:p-14 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
            />
            <Shield className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to deploy your AI workspace?</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
              Join thousands of developers using Scholarly AI for research, coding, and creative workflows.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(6,182,212,0.4)' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-xl shadow-cyan-500/25"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.section>
      </motion.main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/60 px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-medium text-slate-500 bg-slate-950/80 backdrop-blur-sm">
        <div>© 2026 Scholarly AI Platform. Secure pipeline active.</div>
        <div className="flex items-center gap-6 mt-3 sm:mt-0 text-xs">
          <a href="#terms" className="hover:text-slate-300 transition-colors">Terms</a>
          <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy</a>
        </div>
      </footer>
    </div>
  );
}
