'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useZone, useOnboarding } from '@/contexts/ZoneContext';

interface OnboardingHintProps {
  delay?: number; // Delay in ms before showing hint
}

export function OnboardingHint({ delay = 3000 }: OnboardingHintProps) {
  const { zone } = useZone();
  const { hasSeenOnboarding, markOnboardingComplete } = useOnboarding();
  const [showHint, setShowHint] = useState(false);
  const t = useTranslations('onboarding');
  const tZones = useTranslations('zones');

  const otherZone = zone === 'creativity' ? tZones('hotel') : tZones('creativity');

  useEffect(() => {
    if (hasSeenOnboarding) return;

    const timer = setTimeout(() => {
      setShowHint(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [hasSeenOnboarding, delay]);

  const handleDismiss = () => {
    setShowHint(false);
    markOnboardingComplete();
  };

  return (
    <AnimatePresence>
      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-24 right-4 z-50"
        >
          <div className="relative bg-white rounded-2xl shadow-xl px-6 py-4 max-w-xs">
            {/* Arrow pointing up to toggle */}
            <div className="absolute -top-2 right-6 w-4 h-4 bg-white rotate-45 shadow-lg" />

            <div className="relative">
              <p className="text-neutral-700 text-sm text-center">
                {t('switchHint', { zone: otherZone })}
              </p>

              <button
                onClick={handleDismiss}
                className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-100 hover:bg-neutral-200 rounded-full flex items-center justify-center transition-colors"
                aria-label="Закрыть подсказку"
              >
                <svg
                  className="w-3 h-3 text-neutral-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Animated pulse indicator */}
            <motion.div
              className="absolute -top-1 right-7 w-2 h-2 bg-zone-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
