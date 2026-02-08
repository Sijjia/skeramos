'use client';

import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';

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
  const [isConnected, setIsConnected] = useState(false);
  const [positions, setPositions] = useState({
    dividerX: 0,
    dividerY: 0,
    leftX: 0,
    leftY: 0,
    rightX: 0,
    rightY: 0,
    screenHeight: 0,
  });

  // Spring configs
  const gentleSpring = { stiffness: 80, damping: 18, mass: 0.8 };
  const quickSpring = { stiffness: 150, damping: 20 };

  // Connection progress (0 = S logo, 1 = threads connected)
  const connectionProgress = useMotionValue(0);
  const smoothProgress = useSpring(connectionProgress, gentleSpring);

  // Sway for physics
  const swayValue = useMotionValue(0);
  const smoothSway = useSpring(swayValue, { stiffness: 100, damping: 10 });

  // Update positions based on actual DOM elements
  const updatePositions = useCallback(() => {
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;

    // Get divider position (right edge of left section)
    let dividerX = screenWidth / 2;
    if (leftSectionRef.current) {
      const rect = leftSectionRef.current.getBoundingClientRect();
      dividerX = rect.right;
    }

    const dividerY = screenHeight / 2;

    // Get text positions
    let leftX = dividerX - 100;
    let leftY = dividerY;
    let rightX = dividerX + 100;
    let rightY = dividerY;

    if (leftTextRef.current) {
      const rect = leftTextRef.current.getBoundingClientRect();
      // Connect to the right side of the left text (end of word)
      leftX = rect.right + 10;
      leftY = rect.top + rect.height / 2;
    }

    if (rightTextRef.current) {
      const rect = rightTextRef.current.getBoundingClientRect();
      // Connect to the left side of the right text (start of word)
      rightX = rect.left - 10;
      rightY = rect.top + rect.height / 2;
    }

    setPositions({
      dividerX,
      dividerY,
      leftX,
      leftY,
      rightX,
      rightY,
      screenHeight,
    });
  }, [leftTextRef, rightTextRef, leftSectionRef]);

  // Update positions on mount, resize, and when hover changes
  useEffect(() => {
    updatePositions();
    window.addEventListener('resize', updatePositions);

    // Also update after a small delay to catch animation changes
    const timer = setInterval(updatePositions, 50);
    const cleanup = setTimeout(() => clearInterval(timer), 1000);

    return () => {
      window.removeEventListener('resize', updatePositions);
      clearInterval(timer);
      clearTimeout(cleanup);
    };
  }, [updatePositions, hoveredZone]);

  // Handle hover state
  useEffect(() => {
    if (hoveredZone) {
      connectionProgress.set(1);
      const timer = setTimeout(() => setIsConnected(true), 400);
      return () => clearTimeout(timer);
    } else {
      connectionProgress.set(0);
      setIsConnected(false);
    }
  }, [hoveredZone, connectionProgress]);

  // Gentle swaying when connected
  useEffect(() => {
    if (!isConnected) {
      swayValue.set(0);
      return;
    }

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.03;
      const sway = Math.sin(time * 1.2) * 12 + Math.sin(time * 2.1) * 6;
      swayValue.set(sway);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isConnected, swayValue]);

  // S logo path (centered at divider)
  const sLogoSize = 40;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30"
      style={{ overflow: 'visible' }}
    >
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{ overflow: 'visible' }}
      >
        {/* S Logo at the divider - fades out when connecting */}
        <motion.g
          style={{
            opacity: useTransform(smoothProgress, [0, 0.3], [1, 0]),
          }}
        >
          <motion.path
            d={`
              M ${positions.dividerX} ${positions.dividerY - sLogoSize}
              C ${positions.dividerX + sLogoSize * 0.7} ${positions.dividerY - sLogoSize},
                ${positions.dividerX + sLogoSize * 0.7} ${positions.dividerY - sLogoSize * 0.3},
                ${positions.dividerX} ${positions.dividerY}
              C ${positions.dividerX - sLogoSize * 0.7} ${positions.dividerY + sLogoSize * 0.3},
                ${positions.dividerX - sLogoSize * 0.7} ${positions.dividerY + sLogoSize},
                ${positions.dividerX} ${positions.dividerY + sLogoSize}
            `}
            fill="none"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Left thread - from divider to left text */}
        <RopeThread
          startX={positions.dividerX}
          startY={positions.dividerY}
          endX={positions.leftX}
          endY={positions.leftY}
          progress={smoothProgress}
          sway={smoothSway}
          direction="left"
          isHoveredSide={hoveredZone === 'creativity'}
        />

        {/* Right thread - from divider to right text */}
        <RopeThread
          startX={positions.dividerX}
          startY={positions.dividerY}
          endX={positions.rightX}
          endY={positions.rightY}
          progress={smoothProgress}
          sway={smoothSway}
          direction="right"
          isHoveredSide={hoveredZone === 'hotel'}
        />

        {/* Connection knots */}
        <motion.circle
          r="5"
          fill="rgba(255, 255, 255, 0.9)"
          style={{
            cx: useTransform(smoothProgress, [0, 1], [positions.dividerX, positions.leftX]),
            cy: useTransform(smoothProgress, [0, 1], [positions.dividerY, positions.leftY]),
            opacity: useTransform(smoothProgress, [0, 0.7, 1], [0, 0, 1]),
            scale: useTransform(smoothProgress, [0.7, 1], [0, 1]),
          }}
        />
        <motion.circle
          r="5"
          fill="rgba(255, 255, 255, 0.9)"
          style={{
            cx: useTransform(smoothProgress, [0, 1], [positions.dividerX, positions.rightX]),
            cy: useTransform(smoothProgress, [0, 1], [positions.dividerY, positions.rightY]),
            opacity: useTransform(smoothProgress, [0, 0.7, 1], [0, 0, 1]),
            scale: useTransform(smoothProgress, [0.7, 1], [0, 1]),
          }}
        />

        {/* Center knot at divider */}
        <motion.circle
          cx={positions.dividerX}
          cy={positions.dividerY}
          r="6"
          fill="rgba(255, 255, 255, 0.9)"
          style={{
            opacity: useTransform(smoothProgress, [0, 0.2, 1], [0, 1, 1]),
            scale: useTransform(smoothProgress, [0, 0.2], [0, 1]),
          }}
        />
      </svg>
    </div>
  );
}

/**
 * Rope-like thread with realistic hanging physics
 */
function RopeThread({
  startX,
  startY,
  endX,
  endY,
  progress,
  sway,
  direction,
  isHoveredSide,
}: {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: ReturnType<typeof useSpring>;
  sway: ReturnType<typeof useSpring>;
  direction: 'left' | 'right';
  isHoveredSide: boolean;
}) {
  // Create the rope path with hanging effect
  const pathD = useTransform(
    [progress, sway],
    ([p, s]) => {
      const prog = Number(p);
      const swayAmount = Number(s);

      if (prog < 0.05) return '';

      // Interpolate current end position
      const currentEndX = startX + (endX - startX) * prog;
      const currentEndY = startY + (endY - startY) * prog;

      // Calculate rope hanging (catenary curve approximation)
      const distance = Math.abs(currentEndX - startX);
      const verticalDiff = Math.abs(currentEndY - startY);

      // Rope sag amount - more sag for longer distances
      const sagAmount = Math.min(distance * 0.2, 50) * prog;

      // Add sway to the sag
      const totalSag = sagAmount + swayAmount * prog;

      // Mid point with sag
      const midX = (startX + currentEndX) / 2;
      const midY = Math.max(startY, currentEndY) + totalSag;

      // Control points for smooth bezier curve (rope-like)
      const cp1X = startX + (midX - startX) * 0.4;
      const cp1Y = startY + totalSag * 0.3;

      const cp2X = midX;
      const cp2Y = midY;

      const cp3X = currentEndX - (currentEndX - midX) * 0.4;
      const cp3Y = currentEndY + totalSag * 0.3;

      // Cubic bezier for smoother rope curve
      return `
        M ${startX} ${startY}
        C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${midX} ${midY}
        C ${cp2X} ${cp2Y}, ${cp3X} ${cp3Y}, ${currentEndX} ${currentEndY}
      `;
    }
  );

  const opacity = useTransform(progress, [0, 0.1, 1], [0, 0.9, 0.9]);

  return (
    <motion.path
      d={pathD}
      fill="none"
      stroke="rgba(255, 255, 255, 0.85)"
      strokeWidth={isHoveredSide ? "2.5" : "2"}
      strokeLinecap="round"
      style={{ opacity }}
    />
  );
}
