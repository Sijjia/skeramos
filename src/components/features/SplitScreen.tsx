'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useZone } from '@/contexts/ZoneContext';
import type { Zone } from '@/types/zone';

// Крутящаяся спираль - классическая Архимедова
function SpinningSpiral() {
  // Генерируем точки спирали
  const generateSpiralPath = () => {
    const centerX = 50;
    const centerY = 50;
    const turns = 4.5;
    const maxRadius = 42;
    const points: string[] = [];
    const totalPoints = 180;

    for (let i = 0; i <= totalPoints; i++) {
      const angle = (i / totalPoints) * turns * 2 * Math.PI;
      const radius = (i / totalPoints) * maxRadius;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      if (i === 0) {
        points.push(`M ${x} ${y}`);
      } else {
        points.push(`L ${x} ${y}`);
      }
    }

    return points.join(' ');
  };

  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 100 100"
      className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 w-9 h-9 md:w-12 md:h-12 animate-spin-slow"
    >
      <path
        d={generateSpiralPath()}
        fill="none"
        stroke="#2a9d8f"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Декоративные фоновые элементы для светлого фона
function BackgroundElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Анимированные градиентные пятна */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-[0.08]"
        style={{
          top: '-50%',
          left: '-20%',
          background: 'radial-gradient(circle, #c9553d 0%, transparent 70%)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-[0.08]"
        style={{
          top: '-50%',
          right: '-20%',
          background: 'radial-gradient(circle, #2a9d8f 0%, transparent 70%)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Плавающие кольца с вращением */}
      <motion.div
        className="absolute w-16 md:w-24 h-16 md:h-24 rounded-full border-2 border-hotel-400/15"
        style={{ top: '5%', left: '5%' }}
        animate={{
          y: [0, -12, 0],
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-12 md:w-20 h-12 md:h-20 rounded-full border-2 border-creativity-400/15"
        style={{ top: '10%', right: '8%' }}
        animate={{
          y: [0, 10, 0],
          rotate: [360, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Летающие частицы */}
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-gradient-to-br from-hotel-400 to-hotel-500"
        style={{ top: '20%', left: '10%' }}
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-creativity-400 to-creativity-500"
        style={{ top: '15%', right: '15%' }}
        animate={{
          y: [0, 15, 0],
          x: [0, -8, 0],
          opacity: [0.25, 0.5, 0.25],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div
        className="absolute w-1.5 h-1.5 rounded-full bg-hotel-500"
        style={{ top: '60%', left: '20%' }}
        animate={{
          y: [0, -15, 0],
          x: [0, 8, 0],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-creativity-500"
        style={{ top: '50%', right: '12%' }}
        animate={{
          y: [0, 12, 0],
          x: [0, -6, 0],
          opacity: [0.2, 0.45, 0.2]
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />

      {/* Мерцающие звёздочки */}
      <motion.div
        className="absolute w-1 h-1 rounded-full bg-hotel-400"
        style={{ top: '35%', left: '30%' }}
        animate={{
          opacity: [0, 0.8, 0],
          scale: [0.5, 1.5, 0.5]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-1 h-1 rounded-full bg-creativity-400"
        style={{ top: '40%', right: '25%' }}
        animate={{
          opacity: [0, 0.7, 0],
          scale: [0.5, 1.5, 0.5]
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />
      <motion.div
        className="absolute w-1 h-1 rounded-full bg-hotel-300"
        style={{ top: '70%', left: '40%' }}
        animate={{
          opacity: [0, 0.6, 0],
          scale: [0.5, 1.3, 0.5]
        }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />
      <motion.div
        className="absolute w-1 h-1 rounded-full bg-creativity-300"
        style={{ top: '25%', right: '35%' }}
        animate={{
          opacity: [0, 0.65, 0],
          scale: [0.5, 1.4, 0.5]
        }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Пульсирующие круги */}
      <motion.div
        className="absolute w-8 h-8 rounded-full border-2 border-hotel-300/25"
        style={{ top: '45%', left: '3%' }}
        animate={{
          scale: [1, 2.5, 1],
          opacity: [0.3, 0, 0.3]
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.div
        className="absolute w-10 h-10 rounded-full border-2 border-creativity-300/25"
        style={{ top: '30%', right: '5%' }}
        animate={{
          scale: [1, 2.5, 1],
          opacity: [0.25, 0, 0.25]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
      />

      {/* Плавающие волнистые линии */}
      <motion.div
        className="absolute h-px w-20 md:w-32 bg-gradient-to-r from-transparent via-hotel-400/30 to-transparent"
        style={{ top: '30%', left: '5%' }}
        animate={{
          x: [0, 30, 0],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute h-px w-16 md:w-28 bg-gradient-to-r from-transparent via-creativity-400/30 to-transparent"
        style={{ top: '60%', right: '8%' }}
        animate={{
          x: [0, -25, 0],
          opacity: [0.15, 0.4, 0.15]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Вертикальные плавающие линии */}
      <motion.div
        className="absolute w-px h-12 md:h-20 bg-gradient-to-b from-transparent via-hotel-300/25 to-transparent"
        style={{ top: '20%', left: '15%' }}
        animate={{
          y: [0, 15, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-px h-10 md:h-16 bg-gradient-to-b from-transparent via-creativity-300/25 to-transparent"
        style={{ top: '35%', right: '18%' }}
        animate={{
          y: [0, -12, 0],
          opacity: [0.15, 0.35, 0.15]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Маленькие вращающиеся элементы */}
      <motion.div
        className="absolute w-4 h-4 border border-hotel-400/20 rounded-sm"
        style={{ top: '55%', left: '8%' }}
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-3 h-3 border border-creativity-400/20 rounded-sm"
        style={{ top: '20%', right: '22%' }}
        animate={{
          rotate: [360, 180, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

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
      slogan: t('creativitySlogan'),
      bgImage: '/uploads/shingle-4133935_1280.jpg',
    },
    {
      zone: 'hotel' as Zone,
      title: t('hotelTitle'),
      subtitle: t('hotelSubtitle'),
      slogan: t('hotelSlogan'),
      bgImage: '/uploads/free-rugged-charcoal-stucco-texture-989_2.webp',
    },
  ];

  const handleZoneClick = (zone: Zone) => {
    setZone(zone);
    router.push(`/${locale}/${zone}`);
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ height: '100dvh' }}>
      {/* Верхняя секция с логотипом */}
      <div className="relative h-24 md:h-40 flex-shrink-0 bg-neutral-50 flex items-center justify-center">
        <BackgroundElements />
        <SpinningSpiral />

        {/* Логотип SKERAMOS и адрес */}
        <div className="flex flex-col items-center mt-4 md:mt-6">
          <motion.h1
            className="text-2xl md:text-4xl lg:text-5xl font-display font-black tracking-[0.15em] text-creativity-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            SKERAMOS
          </motion.h1>
          <motion.p
            className="text-[10px] md:text-xs text-neutral-400 tracking-[0.2em] uppercase mt-1 md:mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Кыргызстан, г. Бишкек, ул. Шукурова 8
          </motion.p>
        </div>

        {/* Нижняя линия-разделитель с градиентом */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-creativity-400/40 via-neutral-200 to-hotel-400/40" />
      </div>

      {/* Основной сплит-экран */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {zones.map(({ zone, title, subtitle, slogan, bgImage }, index) => {
        const isHovered = hoveredZone === zone;
        const isOtherHovered = hoveredZone !== null && hoveredZone !== zone;
        const isCreativity = zone === 'creativity';

        return (
          <motion.button
            key={zone}
            className={`
              relative flex items-center justify-center
              overflow-hidden cursor-pointer flex-1 md:flex-initial
              focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-inset
              active:scale-[0.98] transition-transform
            `}
            style={{ flex: 1 }}
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

            {/* Content - simplified */}
            <motion.div
              className="relative z-10 text-center text-white px-8 max-w-md"
              animate={{
                scale: isHovered ? 1.05 : 1,
                opacity: isOtherHovered ? 0.5 : 1,
                y: isHovered ? -10 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.h2
                className="text-2xl md:text-4xl lg:text-5xl font-display font-semibold mb-4 uppercase leading-tight"
                animate={{
                  y: isHovered ? -5 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                {title.split(' ').map((word, i) => (
                  <span key={i} className="block md:inline">
                    {word}{' '}
                  </span>
                ))}
              </motion.h2>

              <motion.p
                className="text-base md:text-lg text-white/70"
                animate={{
                  opacity: isHovered ? 1 : 0.7,
                }}
                transition={{ duration: 0.3 }}
              >
                {slogan}
              </motion.p>

              {/* Кнопка - всегда видна */}
              <motion.div
                className="mt-6 md:mt-8"
                animate={{
                  scale: isHovered ? 1.05 : 1,
                  y: isHovered ? -3 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <span className={`
                  inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg font-medium
                  transition-all duration-300
                  ${isCreativity
                    ? 'bg-creativity-500 hover:bg-creativity-400 shadow-lg shadow-creativity-500/30'
                    : 'bg-hotel-500 hover:bg-hotel-400 shadow-lg shadow-hotel-500/30'
                  }
                `}>
                  {tCommon('enter')}
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    animate={{ x: isHovered ? 3 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </span>
              </motion.div>
            </motion.div>

            {/* Анимированные декоративные углы */}
            <motion.div
              className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-white/20 rounded-tl-lg"
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-white/20 rounded-tr-lg"
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.div
              className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-white/20 rounded-bl-lg"
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div
              className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-white/20 rounded-br-lg"
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            />

            {/* Плавающие декоративные элементы */}
            <motion.div
              className="absolute top-1/4 left-8 w-2 h-2 rounded-full bg-white/20"
              animate={{
                y: [0, -15, 0],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/3 right-10 w-3 h-3 rounded-full bg-white/15"
              animate={{
                y: [0, 12, 0],
                opacity: [0.15, 0.4, 0.15]
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.div
              className="absolute bottom-1/3 left-12 w-1.5 h-1.5 rounded-full bg-white/25"
              animate={{
                y: [0, -10, 0],
                x: [0, 5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div
              className="absolute bottom-1/4 right-8 w-2 h-2 rounded-full bg-white/20"
              animate={{
                y: [0, 8, 0],
                x: [0, -4, 0]
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            />

            {/* Вертикальные плавающие линии */}
            <motion.div
              className="absolute top-1/4 left-4 w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent"
              animate={{
                opacity: [0.1, 0.3, 0.1],
                y: [0, 10, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-1/4 right-4 w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent"
              animate={{
                opacity: [0.1, 0.25, 0.1],
                y: [0, -8, 0]
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </motion.button>
        );
      })}

        {/* Bottom text */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white/60 text-sm">{tCommon('chooseDirection')}</p>
        </motion.div>
      </div>
    </div>
  );
}
