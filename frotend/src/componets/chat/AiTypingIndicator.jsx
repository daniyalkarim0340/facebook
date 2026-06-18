import { motion } from 'framer-motion';
import { scaleIn } from './chatAnimations';

export default function AiTypingIndicator({ darkMode, status = 'Thinking...' }) {
  return (
    <motion.div
      variants={scaleIn(0.12)}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.25, delay: 0.05 } }}
      className="flex gap-3 w-full justify-start items-start"
    >
      <div className="relative flex-shrink-0 mt-0.5">
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          className={`w-9 h-9 rounded-xl border flex items-center justify-center text-xs font-bold shadow-xs ${
            darkMode ? 'bg-zinc-900 border-zinc-700 text-amber-400' : 'bg-white border-zinc-200 text-zinc-900'
          }`}
        >
          AI
        </motion.div>
        <motion.span
          animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0.15, 0.35] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className={`absolute -inset-1 rounded-xl border ${
            darkMode ? 'border-amber-500/50' : 'border-amber-400/60'
          }`}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.18, type: 'spring', stiffness: 320, damping: 28 }}
        className="flex flex-col gap-1.5 min-w-0"
      >
        <div className={`rounded-2xl rounded-tl-md px-5 py-4 border shadow-xs flex items-center gap-3 ${
          darkMode
            ? 'bg-zinc-900/80 border-zinc-800 backdrop-blur-sm'
            : 'bg-white border-zinc-200/90 shadow-zinc-100/80'
        }`}>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full typing-dot ${darkMode ? 'bg-amber-400' : 'bg-amber-500'}`} style={{ animationDelay: '0s' }} />
            <span className={`w-2 h-2 rounded-full typing-dot ${darkMode ? 'bg-amber-400' : 'bg-amber-500'}`} style={{ animationDelay: '0.25s' }} />
            <span className={`w-2 h-2 rounded-full typing-dot ${darkMode ? 'bg-amber-400' : 'bg-amber-500'}`} style={{ animationDelay: '0.5s' }} />
          </div>
          <motion.span
            key={status}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className={`text-xs font-medium truncate max-w-[220px] sm:max-w-xs ${
              darkMode ? 'text-zinc-400' : 'text-zinc-500'
            }`}
          >
            {status}
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}
