'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Image from 'next/image';

interface TransitionContextType {
  isTransitioning: boolean;
  targetZone: 'creativity' | 'hotel' | null;
  startTransition: (zone: 'creativity' | 'hotel', callback: () => void) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  isTransitioning: false,
  targetZone: null,
  startTransition: () => {},
});

export function useZoneTransition() {
  return useContext(TransitionContext);
}

interface TransitionProviderProps {
  children: ReactNode;
}

export function ZoneTransitionProvider({ children }: TransitionProviderProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetZone, setTargetZone] = useState<'creativity' | 'hotel' | null>(null);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  const startTransition = useCallback((zone: 'creativity' | 'hotel', callback: () => void) => {
    setTargetZone(zone);
    setIsTransitioning(true);
    setPendingCallback(() => callback);
  }, []);

  const handleAnimationComplete = useCallback(() => {
    if (pendingCallback) {
      pendingCallback();
      setTimeout(() => {
        setIsTransitioning(false);
        setTargetZone(null);
        setPendingCallback(null);
      }, 800);
    }
  }, [pendingCallback]);

  return (
    <TransitionContext.Provider value={{ isTransitioning, targetZone, startTransition }}>
      {children}
      <AnimatePresence>
        {isTransitioning && targetZone && (
          <ZoneOverlay
            zone={targetZone}
            onAnimationComplete={handleAnimationComplete}
          />
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}

interface ZoneOverlayProps {
  zone: 'creativity' | 'hotel';
  onAnimationComplete: () => void;
}

function ZoneOverlay({ zone, onAnimationComplete }: ZoneOverlayProps) {
  const isHotel = zone === 'hotel';
  // Correct colors: Creativity = terracotta, Hotel = emerald
  const bgColor = isHotel ? '#092420' : '#2d110b';
  const accentColor = isHotel ? '#216b5e' : '#a93b24';

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: bgColor }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      onAnimationComplete={onAnimationComplete}
    >
      {/* Кыргызский этно-орнамент */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1'%3E%3Ccircle cx='50' cy='50' r='20'/%3E%3Ccircle cx='50' cy='50' r='10'/%3E%3Cpath d='M50 30 L50 38 M50 62 L50 70 M30 50 L38 50 M62 50 L70 50'/%3E%3Cpath d='M36 36 L42 42 M58 58 L64 64 M36 64 L42 58 M58 42 L64 36'/%3E%3Cpath d='M15 15 Q25 5 35 15 Q25 25 15 15'/%3E%3Cpath d='M85 15 Q75 5 65 15 Q75 25 85 15'/%3E%3Cpath d='M15 85 Q25 95 35 85 Q25 75 15 85'/%3E%3Cpath d='M85 85 Q75 95 65 85 Q75 75 85 85'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Анимированные волны/круги расходятся */}
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{ borderColor: accentColor }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{
            width: 200 + i * 150,
            height: 200 + i * 150,
            opacity: 0
          }}
          transition={{
            duration: 1.8,
            delay: i * 0.2,
            ease: 'easeOut'
          }}
        />
      ))}

      {/* Центральный логотип с вращением */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0.3, opacity: 0, rotate: -180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.3, opacity: 0, rotate: 180 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative w-24 h-24 md:w-28 md:h-28">
          {/* Glow */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: accentColor }}
            initial={{ opacity: 0, scale: 1.5 }}
            animate={{ opacity: 0.3, scale: 2 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
          {/* Logo */}
          <div className="relative w-full h-full">
            <Image
              src="/logo.png"
              alt=""
              fill
              className="object-contain brightness-0 invert drop-shadow-2xl"
            />
          </div>
        </div>
      </motion.div>

      {/* Название зоны */}
      <motion.div
        className="absolute bottom-1/3 flex flex-col items-center gap-2"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -30, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.25 }}
      >
        <span className="text-white/40 text-xs tracking-[0.3em] uppercase">
          зона
        </span>
        <span
          className="text-2xl md:text-3xl font-display font-medium tracking-wider"
          style={{ color: accentColor }}
        >
          {isHotel ? 'Отель' : 'Творчество'}
        </span>
      </motion.div>
    </motion.div>
  );
}
