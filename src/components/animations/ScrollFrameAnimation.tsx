'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

interface ScrollFrameAnimationProps {
  /** Folder path containing frame images (e.g., '/frames/pottery') */
  framePath: string;
  /** Total number of frames */
  frameCount: number;
  /** Frame file prefix (default: 'frame-') */
  filePrefix?: string;
  /** Frame file extension (default: 'webp') */
  extension?: string;
  /** Additional CSS classes */
  className?: string;
  /** Opacity of the background (0-1) */
  opacity?: number;
  /** Scroll range to animate through [start, end] as viewport fractions */
  scrollRange?: [number, number];
}

/**
 * Optimized scroll-driven frame animation
 * Uses preloaded images with CSS visibility switching for maximum performance
 */
export function ScrollFrameAnimation({
  framePath,
  frameCount,
  filePrefix = 'frame-',
  extension = 'webp',
  className = '',
  opacity = 0.15,
  scrollRange = [0, 1],
}: ScrollFrameAnimationProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const loadedCountRef = useRef(0);
  const lastFrameRef = useRef(0);

  const { scrollYProgress } = useScroll();

  // Transform scroll to frame index
  const frameIndex = useTransform(
    scrollYProgress,
    scrollRange,
    [0, frameCount - 1]
  );

  // Generate frame URLs
  const frameUrls = useMemo(() => {
    return Array.from({ length: frameCount }, (_, i) => {
      const frameNumber = String(i + 1).padStart(3, '0');
      return `${framePath}/${filePrefix}${frameNumber}.${extension}`;
    });
  }, [framePath, frameCount, filePrefix, extension]);

  // Preload images
  useEffect(() => {
    loadedCountRef.current = 0;

    frameUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCountRef.current++;
        // Show after first 5 frames loaded
        if (loadedCountRef.current >= 5) {
          setIsLoaded(true);
        }
      };
    });
  }, [frameUrls]);

  // Update frame on scroll - throttled
  useMotionValueEvent(frameIndex, 'change', (latest) => {
    const index = Math.max(0, Math.min(Math.round(latest), frameCount - 1));
    // Only update if frame actually changed
    if (index !== lastFrameRef.current) {
      lastFrameRef.current = index;
      setCurrentFrame(index);
    }
  });

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{
        opacity: isLoaded ? opacity : 0,
        transition: 'opacity 0.5s ease-out',
      }}
      aria-hidden="true"
    >
      {/* Preload all frames as hidden images, show only current */}
      {frameUrls.map((url, index) => (
        <img
          key={url}
          src={url}
          alt=""
          loading={index < 10 ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: index === currentFrame ? 1 : 0,
            // Use visibility to completely hide non-active frames
            visibility: Math.abs(index - currentFrame) <= 1 ? 'visible' : 'hidden',
          }}
        />
      ))}
    </div>
  );
}
