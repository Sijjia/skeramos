'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

interface ScrollFrameAnimationProps {
  framePath: string;
  frameCount: number;
  filePrefix?: string;
  extension?: string;
  className?: string;
  opacity?: number;
  scrollRange?: [number, number];
  mobileFrameCount?: number; // Уменьшенное количество фреймов для мобильных
}

/**
 * Optimized scroll-driven frame animation using Canvas
 * - Uses canvas for direct pixel manipulation (no React re-renders)
 * - Works on mobile with reduced frame count for performance
 * - Preloads all frames before displaying
 */
export function ScrollFrameAnimation({
  framePath,
  frameCount,
  filePrefix = 'frame-',
  extension = 'webp',
  className = '',
  opacity = 0.15,
  scrollRange = [0, 1],
  mobileFrameCount,
}: ScrollFrameAnimationProps) {
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameRef = useRef(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();

  // Используем меньше фреймов на мобильных для производительности
  const actualFrameCount = isMobile && mobileFrameCount ? mobileFrameCount : frameCount;
  // Шаг для выборки фреймов на мобильных
  const frameStep = isMobile && mobileFrameCount ? Math.floor(frameCount / mobileFrameCount) : 1;

  const frameIndex = useTransform(
    scrollYProgress,
    scrollRange,
    [0, actualFrameCount - 1]
  );

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

  // Generate frame URL (с учетом шага для мобильных)
  const getFrameUrl = useCallback((index: number, step: number = 1) => {
    const actualIndex = index * step;
    const frameNumber = String(actualIndex + 1).padStart(3, '0');
    return `${framePath}/${filePrefix}${frameNumber}.${extension}`;
  }, [framePath, filePrefix, extension]);

  // Draw frame to canvas - direct manipulation, no React state
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imagesRef.current[index];

    if (!canvas || !ctx || !img) return;

    // Only draw if frame changed
    if (index === lastFrameRef.current) return;
    lastFrameRef.current = index;

    // Draw image to cover canvas (like object-cover)
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth: number;
    let drawHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (imgRatio > canvasRatio) {
      // Image is wider - fit height, crop width
      drawHeight = canvas.height;
      drawWidth = img.width * (canvas.height / img.height);
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    } else {
      // Image is taller - fit width, crop height
      drawWidth = canvas.width;
      drawHeight = img.height * (canvas.width / img.width);
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Set up canvas size
  useEffect(() => {
    if (!isFullyLoaded || !isClient) return;

    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Use device pixel ratio for sharp rendering (меньше на мобильных для производительности)
      const dpr = isMobile ? Math.min(window.devicePixelRatio || 1, 2) : (window.devicePixelRatio || 1);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      // Redraw current frame after resize
      if (lastFrameRef.current >= 0) {
        lastFrameRef.current = -1; // Force redraw
        drawFrame(lastFrameRef.current + 1);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [isMobile, isFullyLoaded, isClient, drawFrame]);

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

    // Load all images in parallel for faster loading
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

  // Update frame on scroll - direct canvas update, no state
  useMotionValueEvent(frameIndex, 'change', (latest) => {
    if (!isFullyLoaded) return;
    const index = Math.max(0, Math.min(Math.round(latest), actualFrameCount - 1));
    drawFrame(index);
  });

  // Draw initial frame when loaded
  useEffect(() => {
    if (isFullyLoaded && isClient) {
      drawFrame(0);
    }
  }, [isFullyLoaded, isClient, drawFrame]);

  // Don't render until loaded on client
  if (!isClient || !isFullyLoaded) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
