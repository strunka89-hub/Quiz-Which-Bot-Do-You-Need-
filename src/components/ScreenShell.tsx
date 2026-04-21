import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  direction?: 'forward' | 'backward';
  variant?: 'slide' | 'fade';
  className?: string;
}

const slideVariants: Variants = {
  enter: (dir: 'forward' | 'backward') => ({
    opacity: 0,
    x: dir === 'forward' ? 32 : -32,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (dir: 'forward' | 'backward') => ({
    opacity: 0,
    x: dir === 'forward' ? -32 : 32,
    transition: { duration: 0.26, ease: [0.4, 0, 1, 1] },
  }),
};

const fadeVariants: Variants = {
  enter: { opacity: 0, y: 8, scale: 0.98 },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: { duration: 0.24, ease: [0.4, 0, 1, 1] },
  },
};

export function ScreenShell({
  children,
  direction = 'forward',
  variant = 'slide',
  className = '',
}: Props) {
  const variants = variant === 'slide' ? slideVariants : fadeVariants;
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      className={`flex h-full w-full flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}
