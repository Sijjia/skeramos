'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useZone } from '@/contexts/ZoneContext';

interface SThreadProps {
  /** Position of the thread */
  position?: 'left' | 'right' | 'center';
  /** Size multiplier (1 = 100%) */
  scale?: number;
  /** Opacity (0-1) */
  opacity?: number;
  /** Additional className */
  className?: string;
  /** Whether to animate on scroll */
  animateOnScroll?: boolean;
  /** Fixed color override (otherwise uses zone color) */
  color?: string;
}

/**
 * S-Thread Animation - The letter S as a connecting thread
 * Represents the continuous creative flow of Skeramos
 */
export function SThreadAnimation({
  position = 'left',
  scale = 1,
  opacity = 0.15,
  className = '',
  animateOnScroll = true,
  color,
}: SThreadProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { zone } = useZone();
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Animate path drawing based on scroll
  const pathLength = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const pathOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Zone-based colors
  const zoneColor = color || (zone === 'creativity' ? '#a93b24' : '#216b5e');

  const positionClasses = {
    left: 'left-0 -translate-x-1/2',
    right: 'right-0 translate-x-1/2',
    center: 'left-1/2 -translate-x-1/2',
  };

  const baseSize = 400 * scale;

  if (shouldReduceMotion && animateOnScroll) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={`absolute top-0 bottom-0 pointer-events-none z-0 ${positionClasses[position]} ${className}`}
      style={{ width: baseSize }}
    >
      <motion.svg
        viewBox="0 0 100 400"
        className="w-full h-full"
        style={{ opacity: animateOnScroll ? pathOpacity : opacity }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Glow filter */}
        <defs>
          <filter id="s-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="s-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={zoneColor} stopOpacity="0.8" />
            <stop offset="50%" stopColor={zoneColor} stopOpacity="1" />
            <stop offset="100%" stopColor={zoneColor} stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* The S-shaped thread path */}
        <motion.path
          d="M 50 20
             C 80 20, 90 60, 70 100
             C 50 140, 20 160, 30 200
             C 40 240, 80 260, 70 300
             C 60 340, 20 360, 50 380"
          fill="none"
          stroke="url(#s-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#s-glow)"
          style={{
            pathLength: animateOnScroll ? pathLength : 1,
          }}
        />

        {/* Decorative dots along the path */}
        <motion.circle
          cx="50"
          cy="20"
          r="4"
          fill={zoneColor}
          style={{ opacity: animateOnScroll ? pathOpacity : opacity }}
        />
        <motion.circle
          cx="70"
          cy="100"
          r="3"
          fill={zoneColor}
          style={{ opacity: animateOnScroll ? pathOpacity : opacity * 0.8 }}
        />
        <motion.circle
          cx="30"
          cy="200"
          r="4"
          fill={zoneColor}
          style={{ opacity: animateOnScroll ? pathOpacity : opacity }}
        />
        <motion.circle
          cx="70"
          cy="300"
          r="3"
          fill={zoneColor}
          style={{ opacity: animateOnScroll ? pathOpacity : opacity * 0.8 }}
        />
        <motion.circle
          cx="50"
          cy="380"
          r="4"
          fill={zoneColor}
          style={{ opacity: animateOnScroll ? pathOpacity : opacity }}
        />
      </motion.svg>
    </div>
  );
}

/**
 * Horizontal S-Thread for section dividers
 */
export function SThreadDivider({
  className = '',
  color,
}: {
  className?: string;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { zone } = useZone();
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const pathLength = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);
  const zoneColor = color || (zone === 'creativity' ? '#a93b24' : '#216b5e');

  return (
    <div ref={ref} className={`w-full py-8 ${className}`}>
      <svg viewBox="0 0 400 60" className="w-full h-12 md:h-16" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="s-divider-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={zoneColor} stopOpacity="0" />
            <stop offset="20%" stopColor={zoneColor} stopOpacity="0.5" />
            <stop offset="50%" stopColor={zoneColor} stopOpacity="1" />
            <stop offset="80%" stopColor={zoneColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor={zoneColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal S wave */}
        <motion.path
          d="M 0 30
             C 50 10, 100 50, 150 30
             C 200 10, 250 50, 300 30
             C 350 10, 400 50, 400 30"
          fill="none"
          stroke="url(#s-divider-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            pathLength: shouldReduceMotion ? 1 : pathLength,
          }}
        />

        {/* Center S logo shape */}
        <motion.path
          d="M 185 20 C 195 15, 210 25, 200 35 C 190 45, 205 55, 215 50"
          fill="none"
          stroke={zoneColor}
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
      </svg>
    </div>
  );
}

/**
 * Floating S particles for background decoration
 */
export function SParticles({
  count = 5,
  className = '',
}: {
  count?: number;
  className?: string;
}) {
  const { zone } = useZone();
  const zoneColor = zone === 'creativity' ? '#a93b24' : '#216b5e';

  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 20 + Math.random() * 40,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 10,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              d="M 12 4 C 16 4 18 8 14 12 C 10 16 14 20 12 20"
              fill="none"
              stroke={zoneColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.4"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
