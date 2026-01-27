'use client';

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

interface PotteryItem {
  id: number;
  type: 'vase' | 'bowl' | 'cup' | 'plate';
  size: 'sm' | 'md' | 'lg';
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay: number;
  duration: number;
  direction: 'up' | 'down';
}

const POTTERY_ITEMS: PotteryItem[] = [
  { id: 1, type: 'vase', size: 'lg', position: { top: '15%', right: '5%' }, delay: 0, duration: 8, direction: 'up' },
  { id: 2, type: 'bowl', size: 'md', position: { top: '40%', left: '3%' }, delay: 1.5, duration: 10, direction: 'down' },
  { id: 3, type: 'cup', size: 'sm', position: { bottom: '20%', right: '10%' }, delay: 0.5, duration: 7, direction: 'up' },
  { id: 4, type: 'plate', size: 'md', position: { bottom: '30%', left: '8%' }, delay: 2, duration: 9, direction: 'down' },
  { id: 5, type: 'vase', size: 'sm', position: { top: '60%', right: '3%' }, delay: 1, duration: 11, direction: 'up' },
];

// SVG pottery shapes
const PotteryShapes: Record<string, React.FC<{ className?: string }>> = {
  vase: ({ className }) => (
    <svg viewBox="0 0 100 140" className={className} fill="currentColor">
      <path d="M35 0 C35 0 25 10 25 20 L25 30 C20 35 15 45 15 60 L15 100 C15 120 30 140 50 140 C70 140 85 120 85 100 L85 60 C85 45 80 35 75 30 L75 20 C75 10 65 0 65 0 L35 0 Z" />
    </svg>
  ),
  bowl: ({ className }) => (
    <svg viewBox="0 0 120 60" className={className} fill="currentColor">
      <path d="M0 10 C0 10 10 0 60 0 C110 0 120 10 120 10 L115 40 C110 55 90 60 60 60 C30 60 10 55 5 40 L0 10 Z" />
    </svg>
  ),
  cup: ({ className }) => (
    <svg viewBox="0 0 80 100" className={className} fill="currentColor">
      <path d="M10 0 L70 0 L65 70 C65 85 55 100 40 100 C25 100 15 85 15 70 L10 0 Z M70 20 L85 25 C90 35 90 50 85 60 L70 55" />
    </svg>
  ),
  plate: ({ className }) => (
    <svg viewBox="0 0 140 30" className={className} fill="currentColor">
      <ellipse cx="70" cy="15" rx="70" ry="15" />
      <ellipse cx="70" cy="12" rx="55" ry="10" fill="rgba(0,0,0,0.1)" />
    </svg>
  ),
};

const sizeMap = {
  sm: 'w-12 h-12 md:w-16 md:h-16',
  md: 'w-16 h-16 md:w-24 md:h-24',
  lg: 'w-24 h-24 md:w-32 md:h-32',
};

interface FloatingPotteryProps {
  zone?: 'creativity' | 'hotel';
  intensity?: 'light' | 'medium' | 'heavy';
}

export function FloatingPottery({ zone = 'creativity', intensity = 'medium' }: FloatingPotteryProps) {
  const [isMounted, setIsMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // SSR-safe: render empty on server, check motion preference on client
  if (!isMounted) return null;
  if (shouldReduceMotion) return null;

  const items = intensity === 'light'
    ? POTTERY_ITEMS.slice(0, 2)
    : intensity === 'heavy'
      ? POTTERY_ITEMS
      : POTTERY_ITEMS.slice(0, 3);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((item) => {
        const Shape = PotteryShapes[item.type];
        const color = zone === 'creativity'
          ? 'text-creativity-500/10'
          : 'text-hotel-500/10';

        return (
          <motion.div
            key={item.id}
            className={`absolute ${sizeMap[item.size]} ${color}`}
            style={item.position}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              y: item.direction === 'up' ? [0, -30, 0] : [0, 30, 0],
              rotate: [0, item.direction === 'up' ? 10 : -10, 0],
            }}
            transition={{
              delay: item.delay,
              duration: item.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Shape className="w-full h-full" />
          </motion.div>
        );
      })}
    </div>
  );
}

// Decorative pottery wheel component
export function PotteryWheel({ className = '' }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative ${className}`}>
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-zone-500/20"
        animate={shouldReduceMotion ? {} : { rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Inner ring */}
      <motion.div
        className="absolute inset-4 rounded-full border border-zone-400/30"
        animate={shouldReduceMotion ? {} : { rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />

      {/* Center */}
      <div className="absolute inset-8 rounded-full bg-gradient-to-br from-zone-500/20 to-transparent" />

      {/* Logo center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-1/3 h-1/3 relative"
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          <Image
            src="/logo.png"
            alt=""
            fill
            className="object-contain brightness-0 invert opacity-30"
          />
        </motion.div>
      </div>
    </div>
  );
}

// Spinning clay/pottery animation for backgrounds
export function SpinningClay({ className = '' }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`${className}`}
      animate={shouldReduceMotion ? {} : {
        rotate: 360,
        scale: [1, 1.05, 1],
      }}
      transition={{
        rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
        scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <radialGradient id="clayGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--zone-400)" stopOpacity="0.3" />
            <stop offset="70%" stopColor="var(--zone-600)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--zone-800)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="url(#clayGradient)" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="var(--zone-500)" strokeWidth="0.5" strokeOpacity="0.2" />
        <circle cx="100" cy="100" r="40" fill="none" stroke="var(--zone-400)" strokeWidth="0.5" strokeOpacity="0.3" />
        <circle cx="100" cy="100" r="20" fill="none" stroke="var(--zone-300)" strokeWidth="0.5" strokeOpacity="0.4" />
      </svg>
    </motion.div>
  );
}
