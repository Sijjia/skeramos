'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

// Optimized animation variants - removed blur for better performance
const variants = {
  creativity: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  hotel: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
};

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  const pathname = usePathname();
  const isHotel = pathname.includes('/hotel');
  const variant = isHotel ? variants.hotel : variants.creativity;

  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variant}
      transition={{
        duration: 0.2,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Обёртка с AnimatePresence для layout
interface TransitionProviderProps {
  children: ReactNode;
}

export function TransitionProvider({ children }: TransitionProviderProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={pathname}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Переход с морфингом цвета между зонами
export function ZoneTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHotel = pathname.includes('/hotel');

  return (
    <motion.div
      key={pathname}
      initial={{
        opacity: 0,
        '--zone-500': isHotel ? '#5a7c48' : '#c42d54',
      } as any}
      animate={{
        opacity: 1,
        '--zone-500': isHotel ? '#c42d54' : '#5a7c48',
      } as any}
      exit={{
        opacity: 0,
      }}
      transition={{
        duration: 0.6,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}
