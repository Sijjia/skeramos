'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedBorderProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedBorder({ children, className = '' }: AnimatedBorderProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Animated border container */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        {/* Top border */}
        <motion.div
          className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-zone-500/50 to-transparent"
          animate={{
            width: ['0%', '100%', '100%', '0%'],
            left: ['0%', '0%', '0%', '100%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Right border */}
        <motion.div
          className="absolute top-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-zone-500/50 to-transparent"
          animate={{
            height: ['0%', '100%', '100%', '0%'],
            top: ['0%', '0%', '0%', '100%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
            delay: 2,
          }}
        />

        {/* Bottom border */}
        <motion.div
          className="absolute bottom-0 right-0 h-[2px] bg-gradient-to-l from-transparent via-zone-500/50 to-transparent"
          animate={{
            width: ['0%', '100%', '100%', '0%'],
            right: ['0%', '0%', '0%', '100%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
            delay: 4,
          }}
        />

        {/* Left border */}
        <motion.div
          className="absolute bottom-0 left-0 w-[2px] bg-gradient-to-t from-transparent via-zone-500/50 to-transparent"
          animate={{
            height: ['0%', '100%', '100%', '0%'],
            bottom: ['0%', '0%', '0%', '100%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
            delay: 6,
          }}
        />

        {/* Corner accents */}
        <motion.div
          className="absolute top-0 left-0 w-8 h-8"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-zone-500/60" />
          <div className="absolute top-0 left-0 h-full w-[2px] bg-zone-500/60" />
        </motion.div>

        <motion.div
          className="absolute top-0 right-0 w-8 h-8"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <div className="absolute top-0 right-0 w-full h-[2px] bg-zone-500/60" />
          <div className="absolute top-0 right-0 h-full w-[2px] bg-zone-500/60" />
        </motion.div>

        <motion.div
          className="absolute bottom-0 right-0 w-8 h-8"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        >
          <div className="absolute bottom-0 right-0 w-full h-[2px] bg-zone-500/60" />
          <div className="absolute bottom-0 right-0 h-full w-[2px] bg-zone-500/60" />
        </motion.div>

        <motion.div
          className="absolute bottom-0 left-0 w-8 h-8"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
        >
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-zone-500/60" />
          <div className="absolute bottom-0 left-0 h-full w-[2px] bg-zone-500/60" />
        </motion.div>
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
