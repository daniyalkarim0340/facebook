import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Image as ImageIcon, PenTool } from 'lucide-react';
import AiTypingIndicator from './AiTypingIndicator';
import { staggerContainer, fadeUp, scaleIn } from './chatAnimations';

const SUGGESTIONS = [
  {
    icon: ImageIcon,
    title: 'Synthesize Visual Vectors',
    description: 'Execute advanced diffusion model structures to produce tailored media assets.',
    prompt: '/image Architectural layout of a minimalist workspace overlooking a rainy futuristic metropolis, highly detailed blueprint',
  },
  {
    icon: PenTool,
    title: 'Refactor Algorithmic Logic',
    description: 'Map structural algorithmic runtimes and troubleshoot memory leak dependencies.',
    prompt: 'Explain optimization strategies for garbage collection cycles in heavy client-side applications.',
  },
];

export default function ChatEmptyState({ darkMode, user, loading, loadingStatusText, onSelectPrompt }) {
  const firstName = user?.name?.split(' ')[0] || 'Daniyal';

  return (
    <motion.div
      key="empty-state"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { delay: 0.1 } }}
      className="flex-1 flex flex-col items-center justify-center py-16"
    >
      <motion.div
        variants={staggerContainer(0.12, 0.1)}
        initial="hidden"
        animate="visible"
        className="w-full text-center space-y-6 max-w-2xl"
      >
        <motion.div variants={scaleIn(0)} className="flex justify-center">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-colors duration-300 ${
              darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-200'
            }`}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            >
              <Sparkles className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp(0.15)} className="space-y-2">
          <h1 className={`text-3xl md:text-4xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            Welcome Back, {firstName}
          </h1>
          <p className={`font-normal text-sm max-w-md mx-auto leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Deploy a semantic language matrix question, or design dynamic graphic textures with{' '}
            <code className={`px-1.5 py-0.5 rounded text-xs font-mono font-bold ${
              darkMode ? 'bg-zinc-800 text-amber-400' : 'bg-zinc-100 text-amber-700'
            }`}>/image [prompt]</code>
          </p>
        </motion.div>

        <AnimatePresence>
          {loading && (
            <motion.div variants={fadeUp(0.25)}>
              <AiTypingIndicator darkMode={darkMode} status={loadingStatusText} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={staggerContainer(0.14, 0.35)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 w-full"
        >
          {SUGGESTIONS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.title}
                variants={fadeUp(i * 0.1)}
                whileHover={{ scale: 1.02, y: -3, transition: { delay: 0.05 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectPrompt(item.prompt)}
                className={`p-5 rounded-2xl border text-left flex flex-col space-y-2 group transition-all shadow-xs ${
                  darkMode
                    ? 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  darkMode ? 'text-amber-400' : 'text-amber-600'
                }`} />
                <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{item.title}</p>
                <p className={`text-xs leading-relaxed ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  {item.description}
                </p>
              </motion.button>
            );
          })}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
