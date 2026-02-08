'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';

interface ScrollFrameAnimationProps {
  /** Folder path containing frame images (e.g., '/frames/pottery') */
  framePath: string;
  /** Total number of frames */
  frameCount: number;
  /** Frame file extension (default: 'webp') */
  extension?: string;
  /** Additional CSS classes */
  className?: string;
  /** Opacity of the background (0-1) */
  opacity?: number;
  /** Scroll range to animate through [start, end] as viewport fractions */
  scrollRange?: [number, number];
  /** Smoothing factor for animation (higher = smoother but slower response) */
  smoothness?: number;
}

/**
 * Scroll-driven frame animation component
 * Displays frames based on scroll position for smooth video-like effect
 */
export function ScrollFrameAnimation({
  framePath,
  frameCount,
  extension = 'webp',
  className = '',
  opacity = 0.15,
  scrollRange = [0, 0.5],
  smoothness = 50,
}: ScrollFrameAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const currentFrameRef = useRef(0);

  const { scrollYProgress } = useScroll();

  // Transform scroll to frame index
  const rawFrameIndex = useTransform(
    scrollYProgress,
    scrollRange,
    [0, frameCount - 1]
  );

  // Add spring smoothing for buttery smooth animation
  const frameIndex = useSpring(rawFrameIndex, {
    stiffness: smoothness,
    damping: 20,
    mass: 0.5,
  });

  // Preload all frames
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const preloadImages = () => {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        // Frame naming: frame-001.webp, frame-002.webp, etc.
        const frameNumber = String(i).padStart(3, '0');
        img.src = `${framePath}/frame-${frameNumber}.${extension}`;

        img.onload = () => {
          loadedCount++;
          loadedImages[i - 1] = img;

          // Mark as loaded when first 10 frames are ready (for faster initial render)
          if (loadedCount >= Math.min(10, frameCount)) {
            setIsLoaded(true);
          }

          if (loadedCount === frameCount) {
            setImages(loadedImages);
          }
        };

        img.onerror = () => {
          console.warn(`Failed to load frame: ${img.src}`);
          loadedCount++;
        };
      }
    };

    preloadImages();
  }, [framePath, frameCount, extension]);

  // Draw frame on canvas
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = images[index];

    if (!canvas || !ctx || !img) return;

    // Set canvas size to match container
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    // Clear and draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate cover sizing
    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;

    let drawWidth, drawHeight, drawX, drawY;

    if (imgRatio > canvasRatio) {
      drawHeight = canvas.height;
      drawWidth = drawHeight * imgRatio;
      drawX = (canvas.width - drawWidth) / 2;
      drawY = 0;
    } else {
      drawWidth = canvas.width;
      drawHeight = drawWidth / imgRatio;
      drawX = 0;
      drawY = (canvas.height - drawHeight) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }, [images]);

  // Update frame on scroll - smooth continuous updates
  useMotionValueEvent(frameIndex, 'change', (latest) => {
    const index = Math.max(0, Math.min(Math.round(latest), frameCount - 1));
    if (images[index]) {
      currentFrameRef.current = index;
      drawFrame(index);
    }
  });

  // Initial draw when loaded
  useEffect(() => {
    if (isLoaded && images[0]) {
      drawFrame(0);
    }
  }, [isLoaded, images, drawFrame]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (images[currentFrameRef.current]) {
        drawFrame(currentFrameRef.current);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [images, drawFrame]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full object-cover pointer-events-none ${className}`}
      style={{
        opacity: isLoaded ? opacity : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
      aria-hidden="true"
    />
  );
}
