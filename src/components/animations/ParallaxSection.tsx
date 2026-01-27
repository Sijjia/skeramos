'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface ParallaxLayer {
  /** Image or SVG path */
  src: string;
  /** Speed multiplier (0-1, higher = faster movement) */
  speed: number;
  /** Opacity (0-1) */
  opacity?: number;
  /** Z-index for layering */
  zIndex?: number;
  /** Position: 'left', 'right', 'center', 'full' */
  position?: 'left' | 'right' | 'center' | 'full';
}

interface ParallaxSectionProps {
  children: ReactNode;
  /** Background layers for parallax effect */
  layers?: ParallaxLayer[];
  /** Parallax intensity (0-1, default 0.3) */
  intensity?: number;
  /** Direction of parallax movement */
  direction?: 'up' | 'down';
  /** Background color */
  bgColor?: string;
  /** Additional className */
  className?: string;
  /** Minimum height */
  minHeight?: string;
}

// Default Kyrgyz ethno pattern SVG (inline for performance)
const DEFAULT_PATTERN = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <pattern id="ethno" patternUnits="userSpaceOnUse" width="50" height="50">
      <path fill="currentColor" fill-opacity="0.1" d="M25 0L50 25L25 50L0 25z"/>
      <circle cx="25" cy="25" r="5" fill="currentColor" fill-opacity="0.15"/>
    </pattern>
  </defs>
  <rect width="100" height="100" fill="url(#ethno)"/>
</svg>
`)}`;

export function ParallaxSection({
  children,
  layers = [],
  intensity = 0.3,
  direction = 'up',
  bgColor = 'transparent',
  className = '',
  minHeight = '100vh',
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // If reduced motion, disable parallax
  const effectiveIntensity = shouldReduceMotion ? 0 : intensity;

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight, backgroundColor: bgColor }}
    >
      {/* Parallax layers */}
      {layers.map((layer, index) => (
        <ParallaxLayer
          key={index}
          layer={layer}
          scrollYProgress={scrollYProgress}
          intensity={effectiveIntensity}
          direction={direction}
        />
      ))}

      {/* Default decorative patterns if no layers provided */}
      {layers.length === 0 && (
        <>
          <ParallaxLayer
            layer={{
              src: DEFAULT_PATTERN,
              speed: 0.2,
              opacity: 0.5,
              position: 'left',
            }}
            scrollYProgress={scrollYProgress}
            intensity={effectiveIntensity}
            direction={direction}
          />
          <ParallaxLayer
            layer={{
              src: DEFAULT_PATTERN,
              speed: 0.4,
              opacity: 0.3,
              position: 'right',
            }}
            scrollYProgress={scrollYProgress}
            intensity={effectiveIntensity}
            direction={direction}
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}

interface ParallaxLayerProps {
  layer: ParallaxLayer;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  intensity: number;
  direction: 'up' | 'down';
}

function ParallaxLayer({
  layer,
  scrollYProgress,
  intensity,
  direction,
}: ParallaxLayerProps) {
  const { src, speed, opacity = 0.5, zIndex = 0, position = 'full' } = layer;

  // Calculate Y transform based on scroll
  const yRange = 100 * intensity * speed;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'up' ? [yRange, -yRange] : [-yRange, yRange]
  );

  const positionClasses = {
    left: 'left-0 w-1/3',
    right: 'right-0 w-1/3',
    center: 'left-1/2 -translate-x-1/2 w-1/2',
    full: 'inset-0 w-full',
  };

  return (
    <motion.div
      className={`absolute top-0 bottom-0 pointer-events-none ${positionClasses[position]}`}
      style={{
        y,
        zIndex,
        opacity,
        willChange: 'transform',
      }}
    >
      <div
        className="absolute inset-0 bg-repeat"
        style={{
          backgroundImage: `url("${src}")`,
          backgroundSize: position === 'full' ? '200px 200px' : '150px 150px',
        }}
      />
    </motion.div>
  );
}

// Pre-made ethno pattern SVGs for Kyrgyz ornaments
export const ETHNO_PATTERNS = {
  // Diamond pattern (traditional Kyrgyz)
  diamond: `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
      <path fill="currentColor" fill-opacity="0.08" d="M30 0L60 30L30 60L0 30z"/>
      <path fill="currentColor" fill-opacity="0.12" d="M30 10L50 30L30 50L10 30z"/>
    </svg>
  `)}`,

  // Spiral pattern (shyrdak inspired)
  spiral: `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
      <circle cx="30" cy="30" r="25" fill="none" stroke="currentColor" stroke-opacity="0.1" stroke-width="2"/>
      <circle cx="30" cy="30" r="15" fill="none" stroke="currentColor" stroke-opacity="0.08" stroke-width="2"/>
      <circle cx="30" cy="30" r="5" fill="currentColor" fill-opacity="0.1"/>
    </svg>
  `)}`,

  // Horns pattern (kochkor - ram horns)
  horns: `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 40">
      <path fill="none" stroke="currentColor" stroke-opacity="0.1" stroke-width="2"
            d="M10 30 Q10 10 30 10 Q50 10 50 30 Q50 10 70 10 Q90 10 90 30"/>
    </svg>
  `)}`,
};
