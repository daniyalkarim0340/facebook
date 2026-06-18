import { useState } from 'react';
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
      className="relative min-h-screen flex items-center justify-center bg-slate-950 px-4 overflow-hidden selection:bg-cyan-500/30"
      onMouseMove={handleMouseMove}
    >
      <AuthBackground mousePos={mousePos} />

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="login-form"
            variants={authContainerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)', transition: { duration: 0.45 } }}
            onSubmit={handleSubmit}
            className="relative bg-slate-900/70 backdrop-blur-2xl w-full max-w-md p-8 rounded-2xl border border-slate-700/60 shadow-[0_0_60px_-12px_rgba(6,182,212,0.25)] z-10"
          >
            <motion.div variants={authItemVariants} className="text-center mb-8">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 mb-4 shadow-lg shadow-cyan-500/30"
              >
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </motion.div>
              <Heading className="text-white tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Welcome Back
              </Heading>
              <Paragraph className="text-slate-400 mt-1">Securely access your AI workspace</Paragraph>
            </motion.div>

            <motion.div variants={authItemVariants}>
              <Input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-950/60 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 rounded-xl"
              />
            </motion.div>

            <motion.div variants={authItemVariants}>
              <Input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-950/60 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 rounded-xl"
              />
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0, y: -8 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-rose-400 text-xs font-medium text-center bg-rose-500/10 py-2.5 rounded-lg border border-rose-500/20"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div variants={authItemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={loading}
                className="relative w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 border-0"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  'Connect Matrix'
                )}
              </Button>
            </motion.div>

            <motion.p variants={authItemVariants} className="text-center text-sm text-slate-500 mt-6">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors underline-offset-4 hover:underline">
                Initialize registration
              </Link>
            </motion.p>
          </motion.form>        ) : (
          <motion.div
            key="login-success"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="flex flex-col items-center justify-center z-20"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.45, delay: 0.1 }}
              className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.55)] mb-6"
            >
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold text-white tracking-wide"
            >
              Access Granted
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-cyan-400 mt-2"
            >
              Loading dashboard...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginForm;
