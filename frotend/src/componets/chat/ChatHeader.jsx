import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Sun, Moon, Loader2 } from 'lucide-react';
import { slideFromLeft, slideFromRight } from './chatAnimations';

export default function ChatHeader({
  darkMode,
  loading,
  loadingStatusText,
  onToggleSidebar,
  onToggleTheme,
}) {
  return (
    <header className="h-16 flex items-center px-4 md:px-8 flex-shrink-0 justify-between z-30">
      <motion.div
        variants={slideFromLeft(0.05)}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSidebar}
          className={`p-2 border rounded-xl transition-colors shadow-xs md:hidden ${
            darkMode ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          <Menu className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, rotate: darkMode ? 15 : -15 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleTheme}
          className={`p-2.5 border rounded-xl transition-all shadow-xs flex items-center justify-center ${
            darkMode
              ? 'bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-800'
              : 'bg-white border-zinc-200 text-amber-600 hover:bg-zinc-50'
          }`}
          title="Toggle Environment Theme Mode"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={darkMode ? 'sun' : 'moon'}
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </motion.div>

      <motion.div
        variants={slideFromRight(0.12)}
        initial="hidden"
        animate="visible"
        className="text-xs font-medium tracking-wide"
      >
        <AnimatePresence mode="wait">
          {loading && (
            <motion.span
              key="header-loading"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ delay: 0.08 }}
              className={`flex items-center gap-2 ${darkMode ? 'text-amber-400/90' : 'text-amber-600'}`}
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ animationDelay: '0.15s' }} />
              <span className="italic shimmer-text">{loadingStatusText}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
