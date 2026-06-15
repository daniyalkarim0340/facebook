
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Terminal, 
  Cpu, 
  Globe2, 
  Fingerprint 
} from 'lucide-react';

export default function HomePortal() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-screen bg-white text-slate-900 antialiased selection:bg-slate-100 font-sans flex flex-col justify-between">
      
      {/* 1. MINIMAL PREMIUM NAVIGATION BAR */}
      <nav className="flex h-16 items-center justify-between px-6 md:px-12 border-b border-slate-100/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-white shadow-md shadow-slate-950/10">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-xs tracking-tight text-slate-950">Agent Core</span>
            <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase -mt-0.5">Matrix</span>
          </div>
        </div>
        
        {/* Auth Interface Entry Trigger Fields */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-950 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
          >
            Log In
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="text-xs font-semibold bg-slate-950 text-white hover:bg-slate-800 transition-all px-4 py-2 rounded-xl shadow-sm hover:shadow active:scale-[0.98]"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* 2. HERO PRESENTATION BLOCK CONTAINER */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto py-20 space-y-10 relative">
        {/* Apple/Stripe-Inspired Background Light Map Accent */}
        <div className="absolute inset-0 top-1/4 opacity-30 pointer-events-none -z-10">
          <div className="w-[550px] h-[550px] rounded-full bg-slate-100 blur-[130px] mx-auto" />
        </div>

        {/* Micro System Live Pill */}
        <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 text-[10px] font-bold tracking-widest text-slate-400 uppercase px-3 py-1 rounded-full shadow-sm">
          <Cpu className="h-3 w-3 text-slate-950 animate-pulse" /> Next-Gen AI Compute Infrastructure
        </div>

        {/* Core Value Identity Title */}
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-slate-950 leading-[1.1] max-w-3xl">
          The elite platform for autonomous AI agent workflows.
        </h1>

        {/* Secondary Description Paragraph Frame */}
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl font-medium leading-relaxed">
          Deploy premium Llama inference pipelines instantly synchronized with real-time global web search tools. Built exclusively for full-stack environments requiring clean, high-performance execution.
        </p>

        {/* Interactive Workspace Navigation Switches */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
          <button 
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-xs font-semibold text-white shadow-md shadow-slate-950/10 transition-all hover:bg-slate-800 active:scale-[0.98]"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300"
          >
            Explore Sandbox Terminal
          </button>
        </div>

        {/* 3. PRODUCT FEATURE PROPS CAPABILITIES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pt-16 text-left border-t border-slate-100">
          
          <div className="space-y-2 p-2 rounded-xl hover:bg-slate-50/50 transition-colors">
            <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-950 shadow-sm mb-3">
              <Terminal className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950">MERN Native Matrix</h3>
            <p className="text-xs font-medium text-slate-400 leading-relaxed">Consolidated layout bindings optimized for immediate cross-origin communication pipelines.</p>
          </div>

          <div className="space-y-2 p-2 rounded-xl hover:bg-slate-50/50 transition-colors">
            <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-950 shadow-sm mb-3">
              <Globe2 className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950">Real-Time Search</h3>
            <p className="text-xs font-medium text-slate-400 leading-relaxed">Dynamic evaluation matrix uses specialized tool endpoints to query live network layers instantly.</p>
          </div>

          <div className="space-y-2 p-2 rounded-xl hover:bg-slate-50/50 transition-colors">
            <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-950 shadow-sm mb-3">
              <Fingerprint className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950">Token Protection</h3>
            <p className="text-xs font-medium text-slate-400 leading-relaxed">Cryptographic authorization elements guarantee secure state distribution across local storage hooks.</p>
          </div>

        </div>
      </main>

      {/* 4. PREMIUM FOOTER SECTION LAYER */}
      <footer className="h-16 border-t border-slate-100 px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between text-[11px] font-semibold tracking-wide text-slate-400 bg-white shrink-0 uppercase">
        <div>© 2026 Agent Core Platform Inc. Secure architectural pipeline active.</div>
        <div className="flex items-center gap-6 mt-2 sm:mt-0 normal-case font-medium text-xs text-slate-400">
          <a href="#terms" className="hover:text-slate-700 transition-colors">Terms of Service</a>
          <a href="#privacy" className="hover:text-slate-700 transition-colors">Security Architecture Privacy</a>
        </div>
      </footer>

    </div>
  );
}