'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

interface SidePotteryAnimationProps {
  framePath: string;
  frameCount: number;
  filePrefix?: string;
  extension?: string;
  position?: 'left' | 'right';
  size?: number; // размер в пикселях
  mobileSize?: number;
  mobileFrameCount?: number;
}

/**
 * Боковая анимация керамики, которая крутится при скролле
 */
export function SidePotteryAnimation({
  framePath,
  frameCount,
  filePrefix = 'frame-',
  extension = 'webp',
  position = 'left',
  size = 300,
  mobileSize = 150,
  mobileFrameCount,
}: SidePotteryAnimationProps) {
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameRef = useRef(-1);

  const { scrollYProgress } = useScroll();

  const actualFrameCount = isMobile && mobileFrameCount ? mobileFrameCount : frameCount;
  const frameStep = isMobile && mobileFrameCount ? Math.floor(frameCount / mobileFrameCount) : 1;
  const actualSize = isMobile ? mobileSize : size;

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, actualFrameCount - 1]);

  // Check if client and mobile
  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate frame URL
  const getFrameUrl = useCallback((index: number, step: number = 1) => {
    const actualIndex = index * step;
    const frameNumber = String(actualIndex + 1).padStart(3, '0');
    return `${framePath}/${filePrefix}${frameNumber}.${extension}`;
  }, [framePath, filePrefix, extension]);

  // Draw frame to canvas
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imagesRef.current[index];

    if (!canvas || !ctx || !img) return;
    if (index === lastFrameRef.current) return;
    lastFrameRef.current = index;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image centered
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;
    const offsetX = (canvas.width - drawWidth) / 2;
    const offsetY = (canvas.height - drawHeight) / 2;

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Set up canvas size
  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = actualSize * dpr;
    canvas.height = actualSize * dpr;
    canvas.style.width = `${actualSize}px`;
    canvas.style.height = `${actualSize}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, [actualSize, isClient]);

  // Preload images
  useEffect(() => {
    if (!isClient) return;

    let loadedCount = 0;
    const images: HTMLImageElement[] = [];
    let cancelled = false;

    const loadImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = getFrameUrl(index, frameStep);

        img.onload = () => {
          if (!cancelled) {
            images[index] = img;
            loadedCount++;
            setLoadingProgress(Math.round((loadedCount / actualFrameCount) * 100));

            if (loadedCount === actualFrameCount) {
              imagesRef.current = images;
              setIsFullyLoaded(true);
            }
          }
          resolve();
        };

        img.onerror = () => {
          loadedCount++;
          resolve();
        };
      });
    };

    const loadAllImages = async () => {
      const promises = [];
      for (let i = 0; i < actualFrameCount; i++) {
        promises.push(loadImage(i));
      }
      await Promise.all(promises);
    };

    loadAllImages();

    return () => {
      cancelled = true;
    };
  }, [actualFrameCount, frameStep, getFrameUrl, isClient]);

  // Update frame on scroll
  useMotionValueEvent(frameIndex, 'change', (latest) => {
    if (!isFullyLoaded) return;
    const index = Math.max(0, Math.min(Math.round(latest), actualFrameCount - 1));
    drawFrame(index);
  });

  // Draw initial frame
  useEffect(() => {
    if (isFullyLoaded && isClient) {
      drawFrame(0);
    }
  }, [isFullyLoaded, isClient, drawFrame]);

  if (!isClient) return null;

  const positionClasses = position === 'left'
    ? 'left-4 md:left-8'
    : 'right-4 md:right-8';

  return (
    <motion.div
      className={`fixed ${positionClasses} top-1/2 -translate-y-1/2 z-30 pointer-events-none`}
      initial={{ opacity: 0, x: position === 'left' ? -100 : 100 }}
      animate={{ opacity: isFullyLoaded ? 1 : 0, x: isFullyLoaded ? 0 : (position === 'left' ? -100 : 100) }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Glow effect behind pottery */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-30"
        style={{
          background: 'radial-gradient(circle, var(--zone-500) 0%, transparent 70%)',
          transform: 'scale(1.5)'
        }}
      />

      {/* Loading indicator */}
      {!isFullyLoaded && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ width: actualSize, height: actualSize }}
        >
          <div className="text-center">
            <motion.div
              className="w-12 h-12 border-4 border-zone-500/30 border-t-zone-500 rounded-full mx-auto mb-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <span className="text-xs text-zone-500">{loadingProgress}%</span>
          </div>
        </div>
      )}

      {/* Canvas for animation */}
      <canvas
        ref={canvasRef}
        className="relative drop-shadow-2xl"
        style={{
          width: actualSize,
          height: actualSize,
          filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.3))'
        }}
      />

      {/* Decorative ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-zone-500/20"
        style={{ width: actualSize, height: actualSize }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}
