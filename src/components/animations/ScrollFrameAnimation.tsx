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
}

/**
 * Optimized scroll-driven frame animation
 * Preloads ALL frames before showing, then switches instantly
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
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameRef = useRef(-1);

  const { scrollYProgress } = useScroll();

  const frameIndex = useTransform(
    scrollYProgress,
    scrollRange,
    [0, frameCount - 1]
  );

  // Generate frame URL
  const getFrameUrl = useCallback((index: number) => {
    const frameNumber = String(index + 1).padStart(3, '0');
    return `${framePath}/${filePrefix}${frameNumber}.${extension}`;
  }, [framePath, filePrefix, extension]);

  // Preload ALL images before showing
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];
    let cancelled = false;

    const loadImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = getFrameUrl(index);

        img.onload = () => {
          if (!cancelled) {
            images[index] = img;
            loadedCount++;
            setLoadProgress(Math.round((loadedCount / frameCount) * 100));

            // All loaded
            if (loadedCount === frameCount) {
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

    // Load all images in parallel batches for speed
    const loadAllImages = async () => {
      const batchSize = 20;
      for (let i = 0; i < frameCount; i += batchSize) {
        const batch = [];
        for (let j = i; j < Math.min(i + batchSize, frameCount); j++) {
          batch.push(loadImage(j));
        }
        await Promise.all(batch);
      }
    };

    loadAllImages();

    return () => {
      cancelled = true;
    };
  }, [frameCount, getFrameUrl]);

  // Update frame on scroll - instant switching from preloaded images
  useMotionValueEvent(frameIndex, 'change', (latest) => {
    if (!isFullyLoaded) return;

    const index = Math.max(0, Math.min(Math.round(latest), frameCount - 1));

    if (index !== lastFrameRef.current && imagesRef.current[index]) {
      lastFrameRef.current = index;
      setCurrentFrame(index);
    }
  });

  // Don't show until fully loaded
  if (!isFullyLoaded) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{
        opacity,
        transition: 'opacity 0.3s ease-out',
      }}
      aria-hidden="true"
    >
      {/* Single img element - src changes instantly from preloaded cache */}
      <img
        src={imagesRef.current[currentFrame]?.src || getFrameUrl(0)}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          willChange: 'auto',
        }}
      />
    </div>
  );
}
