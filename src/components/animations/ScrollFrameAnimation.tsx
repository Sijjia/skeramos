'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

interface ScrollFrameAnimationProps {
  framePath: string;
  frameCount: number;
  filePrefix?: string;
  extension?: string;
  className?: string;
  opacity?: number;
  scrollRange?: [number, number];
}

/**
 * Optimized scroll-driven frame animation
 * Uses single img element with preloaded images for maximum performance
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
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const lastFrameRef = useRef(-1);

  const { scrollYProgress } = useScroll();

  const frameIndex = useTransform(
    scrollYProgress,
    scrollRange,
    [0, frameCount - 1]
  );

  // Generate frame URL
  const getFrameUrl = (index: number) => {
    const frameNumber = String(index + 1).padStart(3, '0');
    return `${framePath}/${filePrefix}${frameNumber}.${extension}`;
  };

  // Preload all images into memory
  useEffect(() => {
    let loadedCount = 0;
    const images = imagesRef.current;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);

      img.onload = () => {
        images.set(i, img);
        loadedCount++;

        // Show after first 10 frames loaded
        if (loadedCount === 10) {
          setCurrentSrc(getFrameUrl(0));
          setIsLoaded(true);
        }
      };
    }

    return () => {
      images.clear();
    };
  }, [frameCount, framePath, filePrefix, extension]);

  // Update frame on scroll
  useMotionValueEvent(frameIndex, 'change', (latest) => {
    const index = Math.max(0, Math.min(Math.round(latest), frameCount - 1));

    if (index !== lastFrameRef.current) {
      lastFrameRef.current = index;
      const url = getFrameUrl(index);
      setCurrentSrc(url);
    }
  });

  if (!isLoaded) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <img
        ref={imgRef}
        src={currentSrc}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          willChange: 'contents',
        }}
      />
    </div>
  );
}
