'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from 'framer-motion';

interface HeroImage {
  src: string;
  alt: string;
  /** Optional focus point for parallax (0-1, default 0.5) */
  focusX?: number;
  focusY?: number;
}

interface ParallaxHeroProps {
  /** Array of images to cycle through */
  images: HeroImage[];
  /** Auto-rotate interval in ms (default 5000) */
  interval?: number;
  /** Parallax intensity (0-1, default 0.3) */
  parallaxIntensity?: number;
  /** Children to render over the hero */
  children?: React.ReactNode;
  /** Additional className for the container */
  className?: string;
  /** Minimum height (default 100vh) */
  minHeight?: string;
  /** Overlay gradient type */
  overlay?: 'dark' | 'light' | 'gradient' | 'none';
  /** Show navigation dots */
  showDots?: boolean;
  /** Show progress bar */
  showProgress?: boolean;
}

export function ParallaxHero({
  images,
  interval = 5000,
  parallaxIntensity = 0.3,
  children,
  className = '',
  minHeight = '100vh',
  overlay = 'gradient',
  showDots = true,
  showProgress = true,
}: ParallaxHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transform for background
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [0, 200 * parallaxIntensity]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [1, 1] : [1, 1.1]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  // Auto-rotate images
  useEffect(() => {
    if (images.length <= 1) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((current) => (current + 1) % images.length);
          return 0;
        }
        return prev + (100 / (interval / 50));
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [images.length, interval]);

  // Reset progress when manually changing slide
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  }, []);

  const currentImage = images[currentIndex];

  const overlayClasses = {
    dark: 'bg-black/50',
    light: 'bg-white/30',
    gradient: 'bg-gradient-to-b from-background/80 via-background/40 to-background',
    none: '',
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight }}
    >
      {/* Parallax Image Container */}
      <motion.div
        className="absolute inset-0"
        style={{ y, scale }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              priority={currentIndex === 0}
              className="object-cover"
              style={{
                objectPosition: `${(currentImage.focusX ?? 0.5) * 100}% ${(currentImage.focusY ?? 0.5) * 100}%`,
              }}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Overlay */}
      {overlay !== 'none' && (
        <motion.div
          className={`absolute inset-0 ${overlayClasses[overlay]}`}
          style={{ opacity }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>

      {/* Navigation Dots */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${index === currentIndex
                  ? 'w-8 bg-white'
                  : 'bg-white/40 hover:bg-white/60'
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {showProgress && images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
          <motion.div
            className="h-full bg-white/50"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.05 }}
          />
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-8 right-8 z-20 text-white/60 text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

/**
 * Simple parallax background for sections (not hero)
 */
export function ParallaxBackground({
  src,
  alt = '',
  intensity = 0.2,
  overlay = true,
  children,
  className = '',
}: {
  src: string;
  alt?: string;
  intensity?: number;
  overlay?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [-100 * intensity, 100 * intensity]
  );

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 -top-20 -bottom-20"
        style={{ y }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
      </motion.div>

      {overlay && (
        <div className="absolute inset-0 bg-background/70" />
      )}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

/**
 * Ken Burns effect for hero images
 */
export function KenBurnsHero({
  images,
  interval = 6000,
  children,
  className = '',
  minHeight = '100vh',
}: {
  images: HeroImage[];
  interval?: number;
  children?: React.ReactNode;
  className?: string;
  minHeight?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  // Alternating Ken Burns directions
  const kenBurnsVariants = [
    { scale: [1, 1.1], x: [0, 20], y: [0, 10] },
    { scale: [1.1, 1], x: [20, 0], y: [10, 0] },
    { scale: [1, 1.15], x: [0, -20], y: [0, -10] },
    { scale: [1.15, 1], x: [-20, 0], y: [-10, 0] },
  ];

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ minHeight }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            ...kenBurnsVariants[currentIndex % kenBurnsVariants.length],
          }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1 },
            scale: { duration: interval / 1000, ease: 'linear' },
            x: { duration: interval / 1000, ease: 'linear' },
            y: { duration: interval / 1000, ease: 'linear' },
          }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            fill
            priority={currentIndex === 0}
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />

      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}
