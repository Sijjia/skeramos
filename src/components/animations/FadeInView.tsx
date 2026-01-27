'use client';

import { type ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface FadeInViewProps {
  children: ReactNode;
  /** Direction of slide animation */
  direction?: Direction;
  /** Animation duration in seconds */
  duration?: number;
  /** Delay before animation starts in seconds */
  delay?: number;
  /** Distance to slide in pixels */
  distance?: number;
  /** Whether animation should only play once */
  once?: boolean;
  /** Viewport margin for trigger */
  margin?: string;
  /** Additional className */
  className?: string;
  /** HTML tag to use */
  as?: 'div' | 'section' | 'article' | 'span' | 'p' | 'header' | 'footer' | 'main' | 'aside' | 'nav';
}

const getVariants = (
  direction: Direction,
  distance: number,
  reducedMotion: boolean
): Variants => {
  if (reducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };
  }

  const directionOffset = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  return {
    hidden: {
      opacity: 0,
      ...directionOffset[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };
};

export function FadeInView({
  children,
  direction = 'up',
  duration = 0.6,
  delay = 0,
  distance = 20,
  once = true,
  margin = '-50px',
  className = '',
  as = 'div',
}: FadeInViewProps) {
  const shouldReduceMotion = useReducedMotion();
  const variants = getVariants(direction, distance, shouldReduceMotion ?? false);

  // Use motion.div for simplicity - the 'as' prop controls semantic HTML via className context
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      variants={variants}
      transition={{
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Staggered children animation wrapper
 * Animates children with a delay between each
 */
interface StaggerContainerProps {
  children: ReactNode;
  /** Delay between each child animation */
  staggerDelay?: number;
  /** Initial delay before first child */
  initialDelay?: number;
  /** Direction of slide animation for children */
  direction?: Direction;
  /** Whether animation should only play once */
  once?: boolean;
  /** Additional className */
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  initialDelay = 0,
  direction = 'up',
  once = true,
  className = '',
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
        delayChildren: shouldReduceMotion ? 0 : initialDelay,
      },
    },
  };

  const itemVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: {
          opacity: 0,
          y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0,
          x: direction === 'left' ? 20 : direction === 'right' ? -20 : 0,
        },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: {
            duration: 0.5,
            ease: 'easeOut',
          },
        },
      };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
      variants={containerVariants}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

/**
 * Scale fade animation - good for cards and images
 */
interface ScaleFadeProps {
  children: ReactNode;
  /** Initial scale (0-1) */
  initialScale?: number;
  /** Animation duration */
  duration?: number;
  /** Delay before animation */
  delay?: number;
  /** Whether animation should only play once */
  once?: boolean;
  /** Additional className */
  className?: string;
}

export function ScaleFade({
  children,
  initialScale = 0.95,
  duration = 0.5,
  delay = 0,
  once = true,
  className = '',
}: ScaleFadeProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, scale: initialScale },
        visible: { opacity: 1, scale: 1 },
      };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
      variants={variants}
      transition={{
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
