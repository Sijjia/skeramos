'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface FrameGalleryProps {
  images: {
    src: string;
    alt: string;
  }[];
  className?: string;
}

export function FrameGallery({ images, className = '' }: FrameGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  return (
    <div ref={containerRef} className={`relative py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <RotatingFrame
              key={index}
              src={image.src}
              alt={image.alt}
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface RotatingFrameProps {
  src: string;
  alt: string;
  index: number;
  scrollYProgress: any;
}

function RotatingFrame({ src, alt, index, scrollYProgress }: RotatingFrameProps) {
  // Разные скорости вращения для разных фреймов
  const baseRotation = (index % 2 === 0 ? 1 : -1) * 15;
  const rotateZ = useTransform(
    scrollYProgress,
    [0, 1],
    [baseRotation, -baseRotation]
  );

  // Параллакс по Y
  const yOffset = (index % 3) * 30;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [yOffset, -yOffset]
  );

  // Масштаб при появлении
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.9]
  );

  return (
    <motion.div
      className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer"
      style={{ rotateZ, y, scale }}
      whileHover={{ scale: 1.05, rotateZ: 0, zIndex: 10 }}
      transition={{ duration: 0.3 }}
    >
      {/* Декоративная рамка */}
      <div className="absolute inset-0 border-2 border-white/10 rounded-2xl z-10 pointer-events-none" />

      {/* Изображение */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Оверлей при наведении */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Уголки рамки */}
      <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-zone-500/50 rounded-tl" />
      <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-zone-500/50 rounded-tr" />
      <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-zone-500/50 rounded-bl" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-zone-500/50 rounded-br" />
    </motion.div>
  );
}

// Кинематографичная галерея с 3D эффектом
interface CinematicGalleryProps {
  images: string[];
  className?: string;
}

export function CinematicGallery({ images, className = '' }: CinematicGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [20, 0, -20]);
  const perspective = useTransform(scrollYProgress, [0, 0.5, 1], [1000, 1200, 1000]);

  return (
    <div ref={containerRef} className={`relative py-32 overflow-hidden ${className}`}>
      <motion.div
        className="flex justify-center gap-4"
        style={{
          rotateX,
          transformPerspective: perspective,
          transformStyle: 'preserve-3d',
        }}
      >
        {images.slice(0, 5).map((src, index) => {
          const offset = (index - 2) * 30;
          return (
            <motion.div
              key={index}
              className="relative w-64 h-80 rounded-xl overflow-hidden shadow-2xl"
              style={{
                z: 100 - Math.abs(index - 2) * 30,
                rotateY: offset,
              }}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

// Спиральная галерея
interface SpiralGalleryProps {
  images: string[];
  className?: string;
}

export function SpiralGallery({ images, className = '' }: SpiralGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <div ref={containerRef} className={`relative h-[600px] ${className}`}>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ rotate }}
      >
        {images.slice(0, 8).map((src, index) => {
          const angle = (index / 8) * 360;
          const radius = 200;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <motion.div
              key={index}
              className="absolute w-32 h-40 rounded-lg overflow-hidden shadow-xl"
              style={{
                x,
                y,
                rotate: -angle,
              }}
              whileHover={{ scale: 1.2, zIndex: 10 }}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Центральный элемент */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-24 h-24 rounded-full bg-zone-500/20 backdrop-blur-sm border border-zone-500/30 flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 80 80" fill="none" className="text-zone-500">
            <path
              d="M40 20 C55 20 60 35 60 40 C60 50 50 55 40 55 C32 55 27 48 27 40 C27 34 32 30 40 30 C46 30 50 35 50 40"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="40" cy="40" r="4" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
}
