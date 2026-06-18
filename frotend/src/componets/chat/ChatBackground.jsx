import { motion } from 'framer-motion';
import { blobFloat } from './chatAnimations';

export default function ChatBackground({ darkMode }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 transition-opacity duration-500 ${
      darkMode ? 'opacity-25' : 'opacity-60'
    }`}>
      <motion.div
        {...blobFloat(10, 0)}
        className={`absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full blur-[130px] ${
          darkMode
            ? 'bg-gradient-to-tr from-amber-900/10 via-transparent to-transparent'
            : 'bg-gradient-to-tr from-amber-200/40 via-orange-100/20 to-transparent'
        }`}
      />
      <motion.div
        {...blobFloat(12, 1.5)}
        className={`absolute bottom-[-5%] right-[-5%] w-[40vw] h-[40vw] rounded-full blur-[130px] ${
          darkMode
            ? 'bg-gradient-to-bl from-zinc-800/10 via-transparent to-transparent'
            : 'bg-gradient-to-bl from-zinc-200/50 via-neutral-100/20 to-transparent'
        }`}
      />
      <motion.div
        {...blobFloat(14, 0.8)}
        className={`absolute top-[40%] right-[20%] w-[25vw] h-[25vw] rounded-full blur-[100px] ${
          darkMode ? 'bg-amber-500/5' : 'bg-amber-100/30'
        }`}
      />
    </div>
  );
}
