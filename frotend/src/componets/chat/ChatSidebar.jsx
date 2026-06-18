import { motion } from 'framer-motion';
import { MessageSquare, Plus, X, Trash2, LogOut, Settings, Sparkles } from 'lucide-react';
import useChatStore from '../../app/usechat.store';
import { sidebarVariants, staggerContainer, slideFromLeft } from './chatAnimations';

export default function ChatSidebar({
  darkMode,
  sidebarOpen,
  windowWidth,
  history,
  currentSessionId,
  user,
  onClose,
  onNewChat,
  onDeleteSession,
  onLogout,
}) {
  return (
    <motion.div
      initial={false}
      animate={sidebarOpen || windowWidth >= 768 ? 'open' : 'closed'}
      variants={sidebarVariants}
      className={`fixed md:relative inset-y-0 left-0 z-40 w-72 border-r flex flex-col shadow-xl md:shadow-none transition-colors duration-300 ${
        darkMode ? 'bg-[#121215] border-zinc-800/80' : 'bg-white border-zinc-200/80'
      }`}
    >
      <motion.div
        variants={slideFromLeft(0.1)}
        initial="hidden"
        animate="visible"
        className={`h-16 flex items-center justify-between px-5 border-b transition-colors duration-300 ${
          darkMode ? 'border-zinc-800/80' : 'border-zinc-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <Sparkles className={`w-4 h-4 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />
          </motion.div>
          <span className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
            History Stream
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className={`p-1.5 rounded-lg md:hidden transition-colors ${
            darkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'
          }`}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </motion.div>

      <motion.div
        variants={slideFromLeft(0.2)}
        initial="hidden"
        animate="visible"
        className="p-4"
      >
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewChat}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all shadow-xs ${
            darkMode
              ? 'border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800/80 hover:border-zinc-700'
              : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-300'
          }`}
        >
          <Plus className={`w-4 h-4 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
          New Session Chat
        </motion.button>
      </motion.div>

      <motion.div
        variants={staggerContainer(0.08, 0.25)}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto px-3 space-y-1"
      >
        {history.length === 0 ? (
          <motion.div variants={slideFromLeft(0)} className="px-4 py-10 text-center text-xs italic text-zinc-400">
            No historical data tracks found
          </motion.div>
        ) : (
          history.map((chat, i) => (
            <motion.button
              key={chat._id}
              variants={slideFromLeft(i * 0.04)}
              whileHover={{ x: 4, transition: { delay: 0.05 } }}
              onClick={() => {
                useChatStore.setState({ currentSessionId: chat._id });
                onClose();
              }}
              className={`w-full text-left px-3 py-3 rounded-xl group flex items-center justify-between text-sm truncate transition-all ${
                currentSessionId === chat._id
                  ? (darkMode ? 'bg-zinc-800 text-white font-semibold' : 'bg-zinc-100 text-zinc-950 font-semibold')
                  : (darkMode ? 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900')
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <MessageSquare className={`w-4 h-4 flex-shrink-0 transition-colors ${
                  currentSessionId === chat._id ? 'text-amber-500' : 'text-zinc-400'
                }`} />
                <span className="truncate text-xs tracking-wide">{chat.title || 'Untitled Session'}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.15, color: '#ef4444' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(chat._id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 flex-shrink-0 transition-all delay-75"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </motion.button>
            </motion.button>
          ))
        )}
      </motion.div>

      <motion.div
        variants={staggerContainer(0.1, 0.35)}
        initial="hidden"
        animate="visible"
        className={`border-t p-4 space-y-1 transition-colors duration-300 ${
          darkMode ? 'border-zinc-800/80 bg-[#0d0d10]' : 'border-zinc-100 bg-zinc-50/80'
        }`}
      >
        <motion.button
          variants={slideFromLeft(0)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
            darkMode ? 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
          }`}
        >
          <Settings className="w-4 h-4 text-zinc-400" />
          <span>Settings Panel</span>
        </motion.button>
        <motion.button
          variants={slideFromLeft(0.08)}
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
            darkMode ? 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
          }`}
        >
          <LogOut className="w-4 h-4 text-zinc-400" />
          <span>Disconnect Session</span>
        </motion.button>

        <motion.div
          variants={slideFromLeft(0.16)}
          className={`mt-3 px-3 py-3 rounded-xl border transition-colors duration-300 ${
            darkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
          }`}
        >
          <p className={`font-bold text-xs truncate ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
            {user?.name || 'Daniyal'}
          </p>
          <p className={`text-[10px] truncate mt-0.5 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {user?.email || 'daniyal@example.com'}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
