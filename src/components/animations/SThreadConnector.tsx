'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type Zone = 'creativity' | 'hotel' | null;

interface SThreadConnectorProps {
  hoveredZone: Zone;
  leftTextRef: React.RefObject<HTMLElement | null>;
  rightTextRef: React.RefObject<HTMLElement | null>;
}

/**
 * S-Thread Connector Animation
 * The S logo morphs into a thread that connects to the hovered section
 */
export function SThreadConnector({
  hoveredZone,
  leftTextRef,
  rightTextRef,
}: SThreadConnectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, centerX: 0, centerY: 0 });

  // Spring configs for smooth animations
  const springConfig = { stiffness: 100, damping: 20, mass: 1 };

  // Motion values for the thread endpoints
  const threadEndX = useMotionValue(0);
  const threadEndY = useMotionValue(0);
  const threadProgress = useMotionValue(0);

  // Springy versions
  const springEndX = useSpring(threadEndX, springConfig);
  const springEndY = useSpring(threadEndY, springConfig);
  const springProgress = useSpring(threadProgress, { stiffness: 80, damping: 25 });

  // Colors based on hovered zone
  const creativityColor = '#4a7c3f';
  const hotelColor = '#8b1538';
  const neutralColor = '#666666';

  // Update dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height,
          centerX: rect.width / 2,
          centerY: rect.height / 2,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Update thread endpoint based on hovered zone
  useEffect(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    if (hoveredZone === 'creativity' && leftTextRef.current) {
      const textRect = leftTextRef.current.getBoundingClientRect();
      const targetX = textRect.right - containerRect.left + 20;
      const targetY = textRect.top + textRect.height / 2 - containerRect.top;
      threadEndX.set(targetX);
      threadEndY.set(targetY);
      threadProgress.set(1);
    } else if (hoveredZone === 'hotel' && rightTextRef.current) {
      const textRect = rightTextRef.current.getBoundingClientRect();
      const targetX = textRect.left - containerRect.left - 20;
      const targetY = textRect.top + textRect.height / 2 - containerRect.top;
      threadEndX.set(targetX);
      threadEndY.set(targetY);
      threadProgress.set(1);
    } else {
      threadEndX.set(dimensions.centerX);
      threadEndY.set(dimensions.centerY);
      threadProgress.set(0);
    }
  }, [hoveredZone, dimensions, leftTextRef, rightTextRef, threadEndX, threadEndY, threadProgress]);

  // Generate the S path that morphs into a thread
  const generatePath = () => {
    const cx = dimensions.centerX;
    const cy = dimensions.centerY;
    const size = 60; // S logo size

    // Base S shape
    const sPath = `
      M ${cx} ${cy - size}
      C ${cx + size * 0.8} ${cy - size},
        ${cx + size * 0.8} ${cy - size * 0.2},
        ${cx} ${cy}
      C ${cx - size * 0.8} ${cy + size * 0.2},
        ${cx - size * 0.8} ${cy + size},
        ${cx} ${cy + size}
    `;

    return sPath;
  };

  // The current stroke color
  const strokeColor = hoveredZone === 'creativity'
    ? creativityColor
    : hoveredZone === 'hotel'
      ? hotelColor
      : neutralColor;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-30 overflow-visible"
    >
      <svg
        className="w-full h-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Glow filter */}
          <filter id="thread-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradient for the thread */}
          <linearGradient id="thread-gradient-left" x1="100%" y1="50%" x2="0%" y2="50%">
            <stop offset="0%" stopColor={creativityColor} stopOpacity="1" />
            <stop offset="100%" stopColor={creativityColor} stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="thread-gradient-right" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor={hotelColor} stopOpacity="1" />
            <stop offset="100%" stopColor={hotelColor} stopOpacity="0.3" />
          </linearGradient>

          {/* Animated dash pattern */}
          <pattern id="thread-dash" patternUnits="userSpaceOnUse" width="20" height="4">
            <motion.rect
              width="10"
              height="4"
              fill="white"
              animate={{ x: [0, 20] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          </pattern>
        </defs>

        {/* The S Logo that stays in center */}
        <motion.g
          animate={{
            scale: hoveredZone ? 0.6 : 1,
            opacity: hoveredZone ? 0.3 : 1,
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ transformOrigin: `${dimensions.centerX}px ${dimensions.centerY}px` }}
        >
          {/* S shape background glow */}
          <motion.path
            d={generatePath()}
            fill="none"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.2"
            filter="url(#thread-glow)"
          />

          {/* Main S shape */}
          <motion.path
            d={generatePath()}
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{
              stroke: strokeColor,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Animated dash overlay */}
          <motion.path
            d={generatePath()}
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="8 12"
            animate={{
              strokeDashoffset: [0, -40],
              opacity: hoveredZone ? 0 : 0.3,
            }}
            transition={{
              strokeDashoffset: { duration: 2, repeat: Infinity, ease: 'linear' },
              opacity: { duration: 0.3 },
            }}
          />
        </motion.g>

        {/* The Thread that extends to the text */}
        <ThreadLine
          startX={dimensions.centerX}
          startY={dimensions.centerY}
          endX={springEndX}
          endY={springEndY}
          progress={springProgress}
          color={hoveredZone === 'creativity' ? creativityColor : hotelColor}
          direction={hoveredZone === 'creativity' ? 'left' : 'right'}
          isActive={hoveredZone !== null}
        />

        {/* Particle effects at the connection point */}
        {hoveredZone && (
          <ConnectionParticles
            x={springEndX}
            y={springEndY}
            color={hoveredZone === 'creativity' ? creativityColor : hotelColor}
          />
        )}
      </svg>
    </div>
  );
}

/**
 * Animated thread line with wave effect
 */
function ThreadLine({
  startX,
  startY,
  endX,
  endY,
  progress,
  color,
  direction,
  isActive,
}: {
  startX: number;
  startY: number;
  endX: ReturnType<typeof useSpring>;
  endY: ReturnType<typeof useSpring>;
  progress: ReturnType<typeof useSpring>;
  color: string;
  direction: 'left' | 'right';
  isActive: boolean;
}) {
  const pathLength = useTransform(progress, [0, 1], [0, 1]);

  return (
    <motion.g
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Thread glow */}
      <motion.path
        d={useTransform(
          [endX, endY, progress],
          ([ex, ey, p]) => {
            const numP = Number(p);
            if (numP < 0.1) return '';
            const numEx = Number(ex);
            const numEy = Number(ey);

            // Create a wavy bezier curve
            const midX = (startX + numEx) / 2;
            const midY = startY;
            const waveOffset = direction === 'left' ? -30 : 30;
            const controlY1 = startY + waveOffset * Math.sin(numP * Math.PI);
            const controlY2 = numEy - waveOffset * Math.sin(numP * Math.PI * 0.5);

            return `M ${startX} ${startY}
                    Q ${midX} ${controlY1}, ${midX} ${midY}
                    Q ${midX} ${controlY2}, ${numEx} ${numEy}`;
          }
        )}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.3"
        filter="url(#thread-glow)"
        style={{ pathLength }}
      />

      {/* Main thread */}
      <motion.path
        d={useTransform(
          [endX, endY, progress],
          ([ex, ey, p]) => {
            const numP = Number(p);
            if (numP < 0.1) return '';
            const numEx = Number(ex);
            const numEy = Number(ey);

            const midX = (startX + numEx) / 2;
            const midY = startY;
            const waveOffset = direction === 'left' ? -30 : 30;
            const controlY1 = startY + waveOffset * Math.sin(numP * Math.PI);
            const controlY2 = numEy - waveOffset * Math.sin(numP * Math.PI * 0.5);

            return `M ${startX} ${startY}
                    Q ${midX} ${controlY1}, ${midX} ${midY}
                    Q ${midX} ${controlY2}, ${numEx} ${numEy}`;
          }
        )}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        style={{ pathLength }}
      />

      {/* Animated flowing dot along the thread */}
      <motion.circle
        r="5"
        fill="white"
        filter="url(#thread-glow)"
        cx={useTransform(
          [endX, progress],
          ([ex, p]) => {
            const numP = Number(p);
            const numEx = Number(ex);
            // Interpolate position along the path
            return startX + (numEx - startX) * numP;
          }
        )}
        cy={useTransform(
          [endY, progress],
          ([ey, p]) => {
            const numP = Number(p);
            const numEy = Number(ey);
            return startY + (numEy - startY) * numP;
          }
        )}
        animate={{
          opacity: isActive ? [0.6, 1, 0.6] : 0,
          scale: isActive ? [1, 1.3, 1] : 0,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.g>
  );
}

/**
 * Particle effects at connection point
 */
function ConnectionParticles({
  x,
  y,
  color,
}: {
  x: ReturnType<typeof useSpring>;
  y: ReturnType<typeof useSpring>;
  color: string;
}) {
  const particles = [0, 1, 2, 3, 4];

  return (
    <motion.g>
      {particles.map((i) => (
        <motion.circle
          key={i}
          r="3"
          fill={color}
          cx={x}
          cy={y}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 0.8, 0],
            x: [0, (Math.random() - 0.5) * 40],
            y: [0, (Math.random() - 0.5) * 40],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Pulsing ring */}
      <motion.circle
        cx={x}
        cy={y}
        r="8"
        fill="none"
        stroke={color}
        strokeWidth="2"
        animate={{
          scale: [1, 2, 1],
          opacity: [0.8, 0, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
    </motion.g>
  );
}
