'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode, createContext, useContext } from 'react';

// Контекст для передачи информации о переходе страницы
const PageTransitionContext = createContext({
  isEntering: true,
});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

interface TemplateProps {
  children: ReactNode;
}

export default function Template({ children }: TemplateProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={{
          hidden: {
            opacity: 0,
          },
          visible: {
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: 'easeOut',
              when: 'beforeChildren',
              staggerChildren: 0.1,
            },
          },
          exit: {
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: 'easeIn',
            },
          },
        }}
        className="min-h-screen"
      >
        <PageTransitionContext.Provider value={{ isEntering: true }}>
          {/* Контент появляется с задержкой после фона */}
          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: 30,
                filter: 'blur(12px)',
              },
              visible: {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: {
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.15,
                },
              },
              exit: {
                opacity: 0,
                y: -20,
                filter: 'blur(8px)',
                transition: {
                  duration: 0.3,
                },
              },
            }}
          >
            {children}
          </motion.div>
        </PageTransitionContext.Provider>
      </motion.div>
    </AnimatePresence>
  );
}
