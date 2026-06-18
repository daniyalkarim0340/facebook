import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../app/datastore';
import Heading from '../componets/heading';
import Paragraph from '../componets/paragraph';
import Input from '../componets/input';
import Button from '../componets/button';
import AuthBackground, { useMouseParallax } from '../componets/auth/AuthBackground';
import { authContainerVariants, authItemVariants } from '../componets/auth/authAnimations';

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: registerUser, loading, error: serverError } = useAuthStore();
  const navigate = useNavigate();
  const { mousePos, handleMouseMove } = useMouseParallax();

  const onSubmit = async (data) => {
    try {
      const res = await registerUser(data);
      if (res?.success) {
        navigate('/verify-otp', { state: { email: data.email } });
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const inputClass =
    'w-full bg-slate-950/60 border-slate-700 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/40 transition-all duration-300 rounded-xl';

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-slate-950 px-4 overflow-hidden selection:bg-violet-500/30"
      onMouseMove={handleMouseMove}
    >
      <AuthBackground mousePos={mousePos} />

      <motion.form
        variants={authContainerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit(onSubmit)}
        className="relative bg-slate-900/70 backdrop-blur-2xl w-full max-w-md p-8 rounded-2xl border border-slate-700/60 shadow-[0_0_60px_-12px_rgba(139,92,246,0.25)] z-10 space-y-4"
      >
        <motion.div variants={authItemVariants} className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-4 shadow-lg shadow-violet-500/30"
          >
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </motion.div>
          <Heading className="text-white tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Create Account
          </Heading>
          <Paragraph className="text-slate-400 mt-1">Join the AI workspace in seconds</Paragraph>
        </motion.div>

        <motion.div variants={authItemVariants}>
          <Input placeholder="Name" {...register('name', { required: 'Name is required' })} className={inputClass} />
          {errors.name && <p className="text-rose-400 text-xs mt-1.5 px-1">{errors.name.message}</p>}
        </motion.div>

        <motion.div variants={authItemVariants}>
          <Input
            placeholder="Email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
            })}
            className={inputClass}
          />
          {errors.email && <p className="text-rose-400 text-xs mt-1.5 px-1">{errors.email.message}</p>}
        </motion.div>

        <motion.div variants={authItemVariants}>
          <Input
            placeholder="Password"
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
            className={inputClass}
          />
          {errors.password && <p className="text-rose-400 text-xs mt-1.5 px-1">{errors.password.message}</p>}
        </motion.div>

        <AnimatePresence>
          {serverError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm py-2.5 px-3 rounded-lg text-center font-medium"
            >
              {serverError}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={authItemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            loading={loading}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-medium rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 border-0"
          >
            {loading ? 'Creating account...' : 'Start Your Journey'}
          </Button>
        </motion.div>

        <motion.p variants={authItemVariants} className="text-center text-sm text-slate-500 mt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-400 font-medium hover:text-violet-300 transition-colors underline-offset-4 hover:underline">
            Sign in here
          </Link>
        </motion.p>
      </motion.form>    </div>
  );
};

export default RegisterPage;
