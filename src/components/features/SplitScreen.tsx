'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useZone } from '@/contexts/ZoneContext';
import type { Zone } from '@/types/zone';

export function SplitScreen() {
  const [hoveredZone, setHoveredZone] = useState<Zone | null>(null);
  const { setZone } = useZone();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('landing');
  const tCommon = useTranslations('common');

  const zones = [
    {
      zone: 'creativity' as Zone,
      title: t('creativityTitle'),
      subtitle: t('creativitySubtitle'),
      bgImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1920&q=80',
      icon: '🎨',
    },
    {
      zone: 'hotel' as Zone,
      title: t('hotelTitle'),
      subtitle: t('hotelSubtitle'),
      bgImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1920&q=80',
      icon: '🏨',
    },
  ];

  const handleZoneClick = (zone: Zone) => {
    setZone(zone);
    router.push(`/${locale}/${zone}`);
  };

  return (
    <div className="fixed inset-0 flex flex-col md:flex-row overflow-hidden">
      {zones.map(({ zone, title, subtitle, bgImage, icon }) => {
        const isHovered = hoveredZone === zone;
        const isOtherHovered = hoveredZone !== null && hoveredZone !== zone;
        const isCreativity = zone === 'creativity';

        return (
          <motion.button
            key={zone}
            className={`
              relative flex-1 flex items-center justify-center
              overflow-hidden cursor-pointer
              focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-inset
            `}
            initial={false}
            animate={{
              flex: isHovered ? 1.5 : isOtherHovered ? 0.5 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 40,
            }}
            onMouseEnter={() => setHoveredZone(zone)}
            onMouseLeave={() => setHoveredZone(null)}
            onClick={() => handleZoneClick(zone)}
            aria-label={`${tCommon('enter')} ${title}`}
          >
            {/* Background image */}
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${bgImage})` }}
              animate={{
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.6 }}
            />

            {/* Gradient overlay */}
            <motion.div
              className={`absolute inset-0 ${
                isCreativity
                  ? 'bg-gradient-to-br from-creativity-950/90 via-creativity-800/70 to-creativity-600/50'
                  : 'bg-gradient-to-br from-hotel-950/90 via-hotel-800/70 to-hotel-600/50'
              }`}
              animate={{
                opacity: isHovered ? 0.85 : 0.95,
              }}
              transition={{ duration: 0.4 }}
            />

            {/* Animated pattern */}
            <motion.div
              className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1'%3E%3Ccircle cx='50' cy='50' r='20'/%3E%3Ccircle cx='50' cy='50' r='35'/%3E%3Cpath d='M50 15 L50 30 M50 70 L50 85 M15 50 L30 50 M70 50 L85 50'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '100px 100px',
              }}
              animate={{
                backgroundPosition: isHovered ? '50px 50px' : '0px 0px',
              }}
              transition={{ duration: 0.8 }}
            />

            {/* Content */}
            <motion.div
              className="relative z-10 text-center text-white px-8 max-w-md"
              animate={{
                scale: isHovered ? 1.05 : 1,
                opacity: isOtherHovered ? 0.5 : 1,
                y: isHovered ? -10 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Icon */}
              <motion.div
                className="text-5xl md:text-6xl mb-4"
                animate={{
                  scale: isHovered ? 1.2 : 1,
                  rotate: isHovered ? [0, -10, 10, 0] : 0,
                }}
                transition={{ duration: 0.4 }}
              >
                {icon}
              </motion.div>

              <motion.h2
                className="text-3xl md:text-5xl lg:text-6xl font-display font-medium mb-3"
                animate={{
                  y: isHovered ? -5 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                {title}
              </motion.h2>

              <motion.p
                className="text-base md:text-lg lg:text-xl text-white/80"
                animate={{
                  opacity: isHovered ? 1 : 0.7,
                }}
                transition={{ duration: 0.3 }}
              >
                {subtitle}
              </motion.p>

              {/* Hover button */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : 20,
                }}
                transition={{ duration: 0.3 }}
              >
                <span className={`
                  inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-medium
                  transition-all duration-300
                  ${isCreativity
                    ? 'bg-creativity-500 hover:bg-creativity-400 shadow-lg shadow-creativity-500/30'
                    : 'bg-hotel-500 hover:bg-hotel-400 shadow-lg shadow-hotel-500/30'
                  }
                `}>
                  {tCommon('enter')}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </motion.div>
            </motion.div>

            {/* Decorative corner elements */}
            <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-white/20 rounded-tl-lg" />
            <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-white/20 rounded-tr-lg" />
            <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-white/20 rounded-bl-lg" />
            <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-white/20 rounded-br-lg" />
          </motion.button>
        );
      })}

      {/* Center logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <motion.div
          className="relative w-24 h-24 md:w-32 md:h-32"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
            delay: 0.3,
          }}
        >
          {/* Glow behind logo */}
          <div className="absolute inset-0 bg-white/30 rounded-full blur-xl" />

          {/* Logo container */}
          <motion.div
            className="relative w-full h-full bg-white rounded-full shadow-2xl flex items-center justify-center p-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            <Image
              src="/logo.png"
              alt="Skeramos"
              fill
              className="object-contain p-4"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom text */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-white/60 text-sm">Выберите направление</p>
      </motion.div>
    </div>
  );
}
