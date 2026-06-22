import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../app/datastore';
import Heading from '../componets/heading';
import Paragraph from '../componets/paragraph';
import Input from '../componets/input';
import Button from '../componets/button';
import AuthBackground, { useMouseParallax } from '../componets/auth/AuthBackground';
import { authContainerVariants, authItemVariants } from '../componets/auth/authAnimations';

const LoginForm = () => {
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const { mousePos, handleMouseMove } = useMouseParallax();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // FIX: Route guard protection. Prevents logged-in users from accessing the login page.
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('userSession');
    if (token) {
      navigate('/ai');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData);
    if (success) {
      setIsSuccess(true);
      setTimeout(() => navigate('/ai'), 1500);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-slate-50 px-4 overflow-hidden selection:bg-cyan-500/20"
      onMouseMove={handleMouseMove}
    >
      {/* 1. Core Background Matrix Layer */}
      <AuthBackground mousePos={mousePos} />

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <div className="relative group w-full max-w-md z-10">
            {/* 2. Ambient Fluid Backglow Mesh Aura - Softened for Light Mode visibility */}
            <motion.div 
              animate={{
                scale: [1, 1.02, 1],
                opacity: [0.15, 0.22, 0.15],
                rotate: [0, 4, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -inset-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 rounded-2xl blur-2xl pointer-events-none transition duration-1000"
            />

            <motion.form
              key="login-form"
              variants={authContainerVariants}
              initial="hidden"
              animate="visible"
              exit={{ 
                opacity: 0, 
                scale: 0.94, 
                filter: 'blur(12px)', 
                transition: { duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] } 
              }}
              onSubmit={handleSubmit}
              className="relative bg-white/75 backdrop-blur-3xl w-full p-8 rounded-2xl border border-slate-200/80 shadow-[0_20px_50px_-12px_rgba(6,182,212,0.08)] overflow-hidden"
            >
              {/* Subtle tech grid border accent */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

              {/* Header block configuration */}
              <motion.div variants={authItemVariants} className="text-center mb-8">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 mb-4 shadow-lg shadow-cyan-500/10"
                >
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span className="absolute inset-0 rounded-2xl border border-white/20 animate-pulse" />
                </motion.div>

                {/* Shimmer text interpolator adapted to light mode contrast specs */}
                <Heading className="text-slate-900 tracking-tight font-bold">
                  <motion.span
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="bg-gradient-to-r from-slate-950 via-slate-700 to-cyan-700 bg-[length:200%_auto] bg-clip-text text-transparent"
                  >
                    Welcome Back
                  </motion.span>
                </Heading>
                <Paragraph className="text-slate-500 mt-1.5 text-sm">Securely access your AI workspace</Paragraph>
              </motion.div>

              {/* Form Payload Field Rows */}
              <div className="space-y-5 mb-6">
                {/* Email Field Container */}
                <motion.div 
                  variants={authItemVariants}
                  className="relative rounded-xl transition-all duration-300"
                >
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-white/90 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500/60 focus:ring-4 focus:ring-cyan-500/5 transition-all duration-300 rounded-xl py-3 px-4"
                  />
                  {focusedField === 'email' && (
                    <motion.div layoutId="input-glow" className="absolute -inset-[1px] rounded-xl border border-cyan-400 pointer-events-none z-10 opacity-50 shadow-[0_0_10px_rgba(34,211,238,0.15)]" />
                  )}
                </motion.div>

                {/* Password Field Container */}
                <motion.div 
                  variants={authItemVariants}
                  className="relative rounded-xl transition-all duration-300"
                >
                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-white/90 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500/60 focus:ring-4 focus:ring-cyan-500/5 transition-all duration-300 rounded-xl py-3 px-4"
                  />
                  {focusedField === 'password' && (
                    <motion.div layoutId="input-glow" className="absolute -inset-[1px] rounded-xl border border-cyan-400 pointer-events-none z-10 opacity-50 shadow-[0_0_10px_rgba(34,211,238,0.15)]" />
                  )}
                </motion.div>
              </div>

              {/* System Messages Block */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="mb-5 overflow-hidden"
                  >
                    <p className="text-rose-600 text-xs font-medium text-center bg-rose-50 py-2.5 rounded-xl border border-rose-200 shadow-inner">
                      {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Interactive Submit CTA Action Wrapper */}
              <motion.div 
                variants={authItemVariants} 
                whileHover={{ scale: 1.01, y: -0.5 }} 
                whileTap={{ scale: 0.99 }}
                className="relative overflow-hidden rounded-xl"
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-3.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white font-semibold rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-cyan-500/20 border-0 tracking-wide"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2.5">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Verifying Token Matrix...
                    </span>
                  ) : (
                    'Connect Matrix'
                  )}
                </Button>
              </motion.div>

              {/* Utility Auxiliary Link Paths */}
              <motion.p variants={authItemVariants} className="text-center text-xs text-slate-400 mt-6 tracking-wide">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="text-cyan-600 font-semibold hover:text-cyan-700 transition-colors underline-offset-4 hover:underline decoration-cyan-500/30">
                  Initialize registration
                </Link>
              </motion.p>
            </motion.form>
          </div>
        ) : (
          /* 3. Success Feedback Panel */
          <motion.div
            key="login-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex flex-col items-center justify-center z-20 relative"
          >
            <motion.div 
              initial={{ scale: 0.6, opacity: 0.5 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute w-32 h-32 rounded-full border border-cyan-400 pointer-events-none"
            />
            <motion.div 
              initial={{ scale: 0.4, opacity: 0.4 }}
              animate={{ scale: 3.0, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
              className="absolute w-32 h-32 rounded-full border border-blue-400 pointer-events-none"
            />

            <motion.div
              initial={{ scale: 0, rotate: -220 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.4, delay: 0.1, duration: 0.6 }}
              className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-6 relative group"
            >
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.4, ease: "easeInOut" }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div className="absolute inset-0 rounded-2xl bg-white/10 animate-ping opacity-25" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.45, type: 'spring', stiffness: 200 }}
              className="text-3xl font-black tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-cyan-700 bg-clip-text text-transparent"
            >
              Access Granted
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="text-cyan-600 font-medium mt-2 text-xs tracking-wider uppercase flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
              Synchronizing Dashboard Nodes
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginForm;