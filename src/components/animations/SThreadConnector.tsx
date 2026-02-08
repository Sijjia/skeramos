'use client';

import { motion, useSpring, useTransform, useMotionValue, MotionValue } from 'framer-motion';
import { useEffect, useState, useCallback, useMemo } from 'react';

type Zone = 'creativity' | 'hotel' | null;

interface SThreadConnectorProps {
  hoveredZone: Zone;
  leftTextRef: React.RefObject<HTMLElement | null>;
  rightTextRef: React.RefObject<HTMLElement | null>;
  leftSectionRef: React.RefObject<HTMLElement | null>;
}

export function SThreadConnector({
  hoveredZone,
  leftTextRef,
  rightTextRef,
  leftSectionRef,
}: SThreadConnectorProps) {
  const [positions, setPositions] = useState({
    dividerX: 0,
    dividerY: 0,
    leftX: 0,
    leftY: 0,
    rightX: 0,
    rightY: 0,
  });

  // Connection progress
  const connectionProgress = useMotionValue(0);
  const smoothProgress = useSpring(connectionProgress, {
    stiffness: 60,
    damping: 15,
    mass: 0.5
  });

  // Simple sway value
  const swayPhase = useMotionValue(0);

  // Update positions - optimized, only on resize and hover change
  const updatePositions = useCallback(() => {
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;

    let dividerX = screenWidth / 2;
    if (leftSectionRef.current) {
      const rect = leftSectionRef.current.getBoundingClientRect();
      dividerX = rect.right;
    }

    const dividerY = screenHeight / 2;

    let leftX = dividerX - 150;
    let leftY = dividerY;
    let rightX = dividerX + 150;
    let rightY = dividerY;

    if (leftTextRef.current) {
      const rect = leftTextRef.current.getBoundingClientRect();
      leftX = rect.right + 8;
      leftY = rect.top + rect.height / 2;
    }

    if (rightTextRef.current) {
      const rect = rightTextRef.current.getBoundingClientRect();
      rightX = rect.left - 8;
      rightY = rect.top + rect.height / 2;
    }

    setPositions({ dividerX, dividerY, leftX, leftY, rightX, rightY });
  }, [leftTextRef, rightTextRef, leftSectionRef]);

  // Initial update and resize listener
  useEffect(() => {
    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, [updatePositions]);

  // Update positions when hover changes (with small delay for animation)
  useEffect(() => {
    const timer = setTimeout(updatePositions, 100);
    const timer2 = setTimeout(updatePositions, 300);
    const timer3 = setTimeout(updatePositions, 500);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [hoveredZone, updatePositions]);

  // Handle connection state
  useEffect(() => {
    connectionProgress.set(hoveredZone ? 1 : 0);
  }, [hoveredZone, connectionProgress]);

  // Gentle sway animation - lightweight
  useEffect(() => {
    if (!hoveredZone) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.015;
      swayPhase.set(time);
      animationId = requestAnimationFrame(animate);
    };

    // Start after connection animation
    const startTimer = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 500);

    return () => {
      clearTimeout(startTimer);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [hoveredZone, swayPhase]);

  const sLogoSize = 35;

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      <svg
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Thread texture filter for realistic look */}
          <filter id="thread-texture" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
          </filter>
        </defs>

        {/* S Logo - fades when connecting */}
        <motion.path
          d={`
            M ${positions.dividerX} ${positions.dividerY - sLogoSize}
            Q ${positions.dividerX + sLogoSize * 0.8} ${positions.dividerY - sLogoSize * 0.5},
              ${positions.dividerX} ${positions.dividerY}
            Q ${positions.dividerX - sLogoSize * 0.8} ${positions.dividerY + sLogoSize * 0.5},
              ${positions.dividerX} ${positions.dividerY + sLogoSize}
          `}
          fill="none"
          stroke="rgba(255, 255, 255, 0.75)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            opacity: useTransform(smoothProgress, [0, 0.2], [1, 0]),
          }}
        />

        {/* Left thread */}
        <ThreadRope
          startX={positions.dividerX}
          startY={positions.dividerY}
          endX={positions.leftX}
          endY={positions.leftY}
          progress={smoothProgress}
          swayPhase={swayPhase}
          isActive={!!hoveredZone}
        />

        {/* Right thread */}
        <ThreadRope
          startX={positions.dividerX}
          startY={positions.dividerY}
          endX={positions.rightX}
          endY={positions.rightY}
          progress={smoothProgress}
          swayPhase={swayPhase}
          isActive={!!hoveredZone}
          swayOffset={Math.PI * 0.3}
        />

        {/* Center knot */}
        <motion.circle
          cx={positions.dividerX}
          cy={positions.dividerY}
          r="4"
          fill="rgba(255, 255, 255, 0.9)"
          style={{
            opacity: useTransform(smoothProgress, [0, 0.3], [0, 1]),
          }}
        />

        {/* End knots */}
        <motion.circle
          r="3"
          fill="rgba(255, 255, 255, 0.85)"
          style={{
            cx: useTransform(smoothProgress, [0, 1], [positions.dividerX, positions.leftX]),
            cy: useTransform(smoothProgress, [0, 1], [positions.dividerY, positions.leftY]),
            opacity: useTransform(smoothProgress, [0.5, 1], [0, 1]),
          }}
        />
        <motion.circle
          r="3"
          fill="rgba(255, 255, 255, 0.85)"
          style={{
            cx: useTransform(smoothProgress, [0, 1], [positions.dividerX, positions.rightX]),
            cy: useTransform(smoothProgress, [0, 1], [positions.dividerY, positions.rightY]),
            opacity: useTransform(smoothProgress, [0.5, 1], [0, 1]),
          }}
        />
      </svg>
    </div>
  );
}

/**
 * Smooth rope thread with catenary curve
 */
function ThreadRope({
  startX,
  startY,
  endX,
  endY,
  progress,
  swayPhase,
  isActive,
  swayOffset = 0,
}: {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: MotionValue<number>;
  swayPhase: MotionValue<number>;
  isActive: boolean;
  swayOffset?: number;
}) {
  // Calculate smooth catenary path
  const pathD = useTransform(
    [progress, swayPhase],
    ([p, phase]) => {
      const prog = Number(p);
      const t = Number(phase);

      if (prog < 0.02) return '';

      // Current endpoint
      const curEndX = startX + (endX - startX) * prog;
      const curEndY = startY + (endY - startY) * prog;

      // Distance for sag calculation
      const dist = Math.abs(curEndX - startX);

      // Natural rope sag (catenary approximation)
      const baseSag = Math.min(dist * 0.12, 35);

      // Gentle sway when connected
      const sway = isActive && prog > 0.9
        ? Math.sin(t * 1.5 + swayOffset) * 8 + Math.sin(t * 2.3 + swayOffset) * 4
        : 0;

      const totalSag = baseSag * prog + sway;

      // Control point for quadratic bezier - creates smooth arc
      const ctrlX = (startX + curEndX) / 2;
      const ctrlY = Math.max(startY, curEndY) + totalSag;

      // Simple quadratic bezier for smooth curve
      return `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${curEndX} ${curEndY}`;
    }
  );

  const opacity = useTransform(progress, [0, 0.1], [0, 0.85]);

  return (
    <>
      {/* Shadow for depth */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="rgba(0, 0, 0, 0.2)"
        strokeWidth="3"
        strokeLinecap="round"
        style={{
          opacity,
          transform: 'translate(1px, 2px)',
        }}
      />
      {/* Main thread */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ opacity }}
      />
    </>
  );
}
