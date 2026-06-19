
// ==========================
// TIMING SYSTEM (clean + scalable)
// ==========================
export const STAGGER = {
  fast: 0.035,
  normal: 0.06,
  slow: 0.1,
};

const smoothEase = [0.22, 1, 0.36, 1];

// ==========================
// SIDEBAR (modern AI slide)
// ==========================
export const sidebarVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 38,
      mass: 0.9,
    },
  },
  closed: {
    x: "-105%",
    opacity: 0.85,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 38,
      mass: 0.9,
    },
  },
};

// ==========================
// HERO FADE (premium entrance)
// ==========================
export const fadeUp = (delay = 0) => ({
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.98,
    filter: "blur(14px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: smoothEase,
      delay,
    },
  },
});

// ==========================
// CLEAN FADE IN
// ==========================
export const fadeIn = (delay = 0) => ({
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: smoothEase,
      delay,
    },
  },
});

// ==========================
// SOFT SLIDE LEFT (AI feel)
// ==========================
export const slideFromLeft = (delay = 0) => ({
  hidden: {
    opacity: 0,
    x: -70,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: smoothEase,
      delay,
    },
  },
});

// ==========================
// SOFT SLIDE RIGHT (user messages)
// ==========================
export const slideFromRight = (delay = 0) => ({
  hidden: {
    opacity: 0,
    x: 70,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: smoothEase,
      delay,
    },
  },
});

// ==========================
// SCALE IN (glass pop effect)
// ==========================
export const scaleIn = (delay = 0) => ({
  hidden: {
    opacity: 0,
    scale: 0.8,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.75,
      ease: smoothEase,
      delay,
    },
  },
});

// ==========================
// STAGGER CONTAINER (clean flow)
// ==========================
export const staggerContainer = (
  staggerChildren = STAGGER.normal,
  delayChildren = 0.08
) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// ==========================
// 💬 CHAT MESSAGE (VERY IMPORTANT)
// ==========================
export const messageVariants = {
  hidden: (custom) => ({
    opacity: 0,
    y: 18,
    x: custom?.isUser ? 35 : -35,
    scale: 0.96,
    filter: "blur(8px)",
  }),

  visible: (custom) => ({
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 450,
      damping: 32,
      mass: 0.75,
      delay: (custom?.index ?? 0) * 0.035,
    },
  }),
};

// ==========================
// FLOATING AI ORB
// ==========================
export const floatingOrb = {
  animate: {
    y: [0, -18, 0],
    x: [0, 6, -6, 0],
    scale: [1, 1.06, 1],
    rotate: [0, 2, -2, 0],
  },
  transition: {
    duration: 7,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// ==========================
// SOFT GLOW PULSE (AI effect)
// ==========================
export const pulseGlow = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.55, 1, 0.55],
  },
  transition: {
    duration: 2.8,
    repeat: Infinity,
    ease: "easeInOut",
  },
};