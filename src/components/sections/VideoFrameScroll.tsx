'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

interface VideoFrameScrollProps {
  frames: string[]; // массив путей к фреймам
  className?: string;
  height?: string; // высота секции для скролла
  overlay?: boolean; // добавить затемнение
  overlayOpacity?: number;
  title?: string;
  subtitle?: string;
  blend?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light';
}

export function VideoFrameScroll({
  frames,
  className = '',
  height = '300vh',
  overlay = true,
  overlayOpacity = 0.4,
  title,
  subtitle,
  blend = 'normal',
}: VideoFrameScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Меняем фрейм в зависимости от прогресса скролла
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (progress) => {
      const frameIndex = Math.min(
        Math.floor(progress * frames.length),
        frames.length - 1
      );
      setCurrentFrame(frameIndex);
    });
    return () => unsubscribe();
  }, [scrollYProgress, frames.length]);

  // Параллакс для текста
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], ['0%', '-20%', '-40%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1, 0.5, 0]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Фреймы */}
        <div className="absolute inset-0">
          {frames.map((frame, index) => (
            <div
              key={frame}
              className={`absolute inset-0 transition-opacity duration-100 ${
                index === currentFrame ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ mixBlendMode: blend }}
            >
              <Image
                src={frame}
                alt={`Frame ${index + 1}`}
                fill
                className="object-cover"
                priority={index < 3}
              />
            </div>
          ))}
        </div>

        {/* Затемняющий оверлей */}
        {overlay && (
          <div
            className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background/80"
            style={{ opacity: overlayOpacity }}
          />
        )}

        {/* Текст поверх */}
        {(title || subtitle) && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ y: textY, opacity: textOpacity }}
          >
            <div className="text-center px-4">
              {title && (
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium text-white mb-4 drop-shadow-lg">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-lg md:text-xl text-neutral-200 max-w-2xl mx-auto drop-shadow-md">
                  {subtitle}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Прогресс-индикатор */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1">
          {frames.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentFrame
                  ? 'bg-white w-6'
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Номер фрейма (для дебага) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 rounded text-white text-sm">
            Frame: {currentFrame + 1}/{frames.length}
          </div>
        )}
      </div>
    </div>
  );
}

// Компонент для галереи с крутящимися фреймами
interface RotatingFramesGalleryProps {
  series: {
    name: string;
    frames: string[];
  }[];
  className?: string;
}

export function RotatingFramesGallery({ series, className = '' }: RotatingFramesGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return (
    <div ref={containerRef} className={`relative py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {series.map((s, seriesIndex) => (
            <RotatingFrameCard
              key={s.name}
              frames={s.frames}
              index={seriesIndex}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface RotatingFrameCardProps {
  frames: string[];
  index: number;
  scrollProgress: any;
}

function RotatingFrameCard({ frames, index, scrollProgress }: RotatingFrameCardProps) {
  const [currentFrame, setCurrentFrame] = useState(0);

  // Каждая карточка меняет фреймы с разной скоростью
  useEffect(() => {
    const unsubscribe = scrollProgress.on('change', (progress: number) => {
      // Разная скорость для разных карточек
      const speed = 1 + (index % 3) * 0.5;
      const adjustedProgress = (progress * speed) % 1;
      const frameIndex = Math.min(
        Math.floor(adjustedProgress * frames.length),
        frames.length - 1
      );
      setCurrentFrame(frameIndex);
    });
    return () => unsubscribe();
  }, [scrollProgress, frames.length, index]);

  // Вращение карточки
  const rotation = useTransform(
    scrollProgress,
    [0, 1],
    [index % 2 === 0 ? -10 : 10, index % 2 === 0 ? 10 : -10]
  );

  const y = useTransform(
    scrollProgress,
    [0, 1],
    [(index % 3) * 20, -(index % 3) * 20]
  );

  return (
    <motion.div
      className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer"
      style={{ rotateZ: rotation, y }}
      whileHover={{ scale: 1.05, rotateZ: 0 }}
    >
      {/* Рамка */}
      <div className="absolute inset-0 border-2 border-white/20 rounded-2xl z-10 pointer-events-none" />

      {/* Фреймы */}
      {frames.map((frame, frameIndex) => (
        <div
          key={frame}
          className={`absolute inset-0 transition-opacity duration-150 ${
            frameIndex === currentFrame ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={frame}
            alt={`Frame ${frameIndex + 1}`}
            fill
            className="object-cover"
          />
        </div>
      ))}

      {/* Оверлей при наведении */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Декоративные уголки */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-zone-500/50 rounded-tl" />
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-zone-500/50 rounded-tr" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-zone-500/50 rounded-bl" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-zone-500/50 rounded-br" />
    </motion.div>
  );
}
