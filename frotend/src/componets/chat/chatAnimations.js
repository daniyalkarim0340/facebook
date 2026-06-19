export const STAGGER = {
  fast: 0.06,
  normal: 0.1,
  slow: 0.14,
};

export const sidebarVariants = {
  open: { x: 0, transition: { type: 'spring', stiffness: 380, damping: 35, delay: 0.05 } },
  closed: { x: '-100%', transition: { type: 'spring', stiffness: 380, damping: 35 } },
};

export const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 360, damping: 30, delay },
  },
});

export const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: 'easeOut', delay },
  },
});

export const slideFromLeft = (delay = 0) => ({
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 340, damping: 28, delay },
  },
});

export const slideFromRight = (delay = 0) => ({
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 340, damping: 28, delay },
  },
});

export const scaleIn = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 26, delay },
  },
});

export const staggerContainer = (staggerChildren = STAGGER.normal, delayChildren = 0.08) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren, delayChildren },
  },
});

export const messageVariants = {
  hidden: (custom) => ({
    opacity: 0,
    y: 16,
    x: custom?.isUser ? 20 : -20,
    scale: 0.97,
  }),
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 360,
      damping: 28,
      mass: 0.85,
      delay: (custom?.index ?? 0) * 0.06,
    },
  }),
};

export const blobFloat = (duration = 8, delay = 0) => ({
  animate: {
    x: [0, 12, -8, 0],
    y: [0, -10, 6, 0],
    scale: [1, 1.04, 0.98, 1],
  },
  transition: { duration, repeat: Infinity, ease: 'easeInOut', delay },
});
