'use client';

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

interface ScrollAnimationProps {
  /** Array of frame URLs (120 frames recommended) */
  frames: string[];
  /** Alt text for accessibility */
  alt: string;
  /** Fallback image when frames not loaded or reduced motion */
  fallbackImage: string;
  /** Scroll range as [start, end] in viewport units (0-1) */
  scrollRange?: [number, number];
  /** Additional className */
  className?: string;
  /** Aspect ratio (e.g., "16/9", "4/3", "1/1") */
  aspectRatio?: string;
}

/**
 * ScrollAnimation - Displays a PNG sequence synchronized with scroll progress.
 *
 * Usage:
 * 1. Generate AI video of pottery being made
 * 2. Export as PNG sequence (120 frames, e.g., frame-001.png to frame-120.png)
 * 3. Place in public/animations/pottery/
 * 4. Pass array of paths: ['/animations/pottery/frame-001.png', ...]
 *
 * The component will:
 * - Preload frames as they come into view
 * - Sync frame display with scroll position
 * - Fall back to static image for reduced motion or if frames fail to load
 */
export function ScrollAnimation({
  frames,
  alt,
  fallbackImage,
  scrollRange = [0.1, 0.9],
  className = '',
  aspectRatio = '16/9',
}: ScrollAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [currentFrame, setCurrentFrame] = useState(0);
  const [loadedFrames, setLoadedFrames] = useState<Set<number>>(new Set([0]));
  const [hasError, setHasError] = useState(false);

  // Scroll progress tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: [`start ${scrollRange[1]}`, `end ${scrollRange[0]}`],
  });

  // Map scroll progress to frame index
  const frameIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, frames.length - 1]
  );

  // Update current frame based on scroll
  useEffect(() => {
    if (shouldReduceMotion || hasError || frames.length === 0) return;

    const unsubscribe = frameIndex.on('change', (value) => {
      const index = Math.round(value);
      const clampedIndex = Math.max(0, Math.min(frames.length - 1, index));
      setCurrentFrame(clampedIndex);
    });

    return () => unsubscribe();
  }, [frameIndex, frames.length, shouldReduceMotion, hasError]);

  // Preload upcoming frames
  const preloadFrames = useCallback((centerIndex: number, range: number = 5) => {
    if (frames.length === 0) return;

    const toLoad: number[] = [];
    for (let i = centerIndex - range; i <= centerIndex + range; i++) {
      if (i >= 0 && i < frames.length && !loadedFrames.has(i)) {
        toLoad.push(i);
      }
    }

    if (toLoad.length > 0) {
      toLoad.forEach((index) => {
        const img = new window.Image();
        img.onload = () => {
          setLoadedFrames((prev) => new Set(prev).add(index));
        };
        img.onerror = () => {
          setHasError(true);
        };
        img.src = frames[index];
      });
    }
  }, [frames, loadedFrames]);

  // Preload frames around current frame
  useEffect(() => {
    preloadFrames(currentFrame, 5);
  }, [currentFrame, preloadFrames]);

  // Initial preload
  useEffect(() => {
    if (frames.length > 0) {
      preloadFrames(0, 10);
    }
  }, [frames, preloadFrames]);

  // Check if we should show static fallback
  const showFallback = (shouldReduceMotion ?? false) || hasError || frames.length === 0;
  const showProgress = !showFallback && frames.length > 0;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      {/* Current frame or fallback */}
      <motion.div
        className="absolute inset-0"
        style={{
          willChange: showFallback ? 'auto' : 'contents',
        }}
      >
        {showFallback ? (
          <Image
            src={fallbackImage}
            alt={alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : loadedFrames.has(currentFrame) ? (
          <Image
            src={frames[currentFrame]}
            alt={`${alt} - frame ${currentFrame + 1}`}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <Image
            src={fallbackImage}
            alt={alt}
            fill
            className="object-cover"
            sizes="100vw"
          />
        )}
      </motion.div>

      {/* Progress indicator (only when animating) */}
      {showProgress && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white/60 rounded-full"
              style={{
                width: `${((currentFrame + 1) / frames.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Helper function to generate frame paths
 * @param basePath - Base path like '/animations/pottery/frame-'
 * @param count - Number of frames (e.g., 120)
 * @param extension - File extension (default: 'png')
 * @param padding - Zero padding (default: 3 for frame-001.png)
 */
export function generateFramePaths(
  basePath: string,
  count: number,
  extension: string = 'png',
  padding: number = 3
): string[] {
  return Array.from({ length: count }, (_, i) => {
    const frameNumber = String(i + 1).padStart(padding, '0');
    return `${basePath}${frameNumber}.${extension}`;
  });
}
