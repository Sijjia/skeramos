'use client';

import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';

type Zone = 'creativity' | 'hotel' | null;

interface SThreadConnectorProps {
  hoveredZone: Zone;
  leftTextRef: React.RefObject<HTMLElement | null>;
  rightTextRef: React.RefObject<HTMLElement | null>;
}

/**
 * S-Thread Connector Animation
 * Realistic thread that connects from center S to both section titles
 */
export function SThreadConnector({
  hoveredZone,
  leftTextRef,
  rightTextRef,
}: SThreadConnectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [positions, setPositions] = useState({
    centerX: 0,
    centerY: 0,
    leftX: 0,
    leftY: 0,
    rightX: 0,
    rightY: 0,
  });

  // Spring config for realistic rope physics
  const ropeSpring = { stiffness: 120, damping: 14, mass: 1 };
  const gentleSpring = { stiffness: 60, damping: 20, mass: 0.5 };

  // Motion values for thread sway (physics simulation)
  const swayOffset = useMotionValue(0);
  const leftSway = useSpring(swayOffset, ropeSpring);
  const rightSway = useSpring(swayOffset, ropeSpring);

  // Connection progress
  const connectionProgress = useMotionValue(0);
  const smoothProgress = useSpring(connectionProgress, gentleSpring);

  // S logo visibility
  const sLogoScale = useSpring(1, gentleSpring);
  const sLogoOpacity = useSpring(1, gentleSpring);

  // Update positions
  const updatePositions = useCallback(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;

    let leftX = centerX - 200;
    let leftY = centerY;
    let rightX = centerX + 200;
    let rightY = centerY;

    if (leftTextRef.current) {
      const textRect = leftTextRef.current.getBoundingClientRect();
      leftX = textRect.right - containerRect.left + 15;
      leftY = textRect.top + textRect.height / 2 - containerRect.top;
    }

    if (rightTextRef.current) {
      const textRect = rightTextRef.current.getBoundingClientRect();
      rightX = textRect.left - containerRect.left - 15;
      rightY = textRect.top + textRect.height / 2 - containerRect.top;
    }

    setPositions({ centerX, centerY, leftX, leftY, rightX, rightY });
  }, [leftTextRef, rightTextRef]);

  useEffect(() => {
    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, [updatePositions]);

  // Handle hover state changes
  useEffect(() => {
    if (hoveredZone) {
      // Start connection animation
      connectionProgress.set(1);
      sLogoScale.set(0.5);
      sLogoOpacity.set(0.3);

      // Delay before marking as connected (for sway physics)
      const timer = setTimeout(() => {
        setIsConnected(true);
      }, 600);

      return () => clearTimeout(timer);
    } else {
      // Disconnect
      connectionProgress.set(0);
      sLogoScale.set(1);
      sLogoOpacity.set(1);
      setIsConnected(false);
    }
  }, [hoveredZone, connectionProgress, sLogoScale, sLogoOpacity]);

  // Gentle swaying animation when connected
  useEffect(() => {
    if (!isConnected) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.02;
      // Subtle random-like sway
      const sway = Math.sin(time * 1.5) * 8 + Math.sin(time * 2.3) * 4;
      swayOffset.set(sway);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isConnected, swayOffset]);

  // Generate the S shape path
  const sPath = `
    M ${positions.centerX} ${positions.centerY - 35}
    C ${positions.centerX + 25} ${positions.centerY - 35},
      ${positions.centerX + 25} ${positions.centerY - 10},
      ${positions.centerX} ${positions.centerY}
    C ${positions.centerX - 25} ${positions.centerY + 10},
      ${positions.centerX - 25} ${positions.centerY + 35},
      ${positions.centerX} ${positions.centerY + 35}
  `;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-30"
      style={{ overflow: 'visible' }}
    >
      <svg
        className="w-full h-full"
        style={{ overflow: 'visible' }}
      >
        {/* The S Logo in center - fades when connected */}
        <motion.path
          d={sPath}
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            scale: sLogoScale,
            opacity: sLogoOpacity,
            transformOrigin: `${positions.centerX}px ${positions.centerY}px`,
          }}
        />

        {/* Left thread - from center to left text */}
        <ThreadWithPhysics
          startX={positions.centerX}
          startY={positions.centerY}
          endX={positions.leftX}
          endY={positions.leftY}
          progress={smoothProgress}
          sway={leftSway}
          direction="left"
        />

        {/* Right thread - from center to right text */}
        <ThreadWithPhysics
          startX={positions.centerX}
          startY={positions.centerY}
          endX={positions.rightX}
          endY={positions.rightY}
          progress={smoothProgress}
          sway={rightSway}
          direction="right"
        />

        {/* Small knot at connection points when connected */}
        <motion.circle
          cx={useTransform(smoothProgress, [0, 1], [positions.centerX, positions.leftX])}
          cy={useTransform(smoothProgress, [0, 1], [positions.centerY, positions.leftY])}
          r="4"
          fill="white"
          style={{
            opacity: useTransform(smoothProgress, [0, 0.8, 1], [0, 0, 1]),
          }}
        />
        <motion.circle
          cx={useTransform(smoothProgress, [0, 1], [positions.centerX, positions.rightX])}
          cy={useTransform(smoothProgress, [0, 1], [positions.centerY, positions.rightY])}
          r="4"
          fill="white"
          style={{
            opacity: useTransform(smoothProgress, [0, 0.8, 1], [0, 0, 1]),
          }}
        />
      </svg>
    </div>
  );
}

/**
 * Thread with physics-based sway
 */
function ThreadWithPhysics({
  startX,
  startY,
  endX,
  endY,
  progress,
  sway,
  direction,
}: {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: ReturnType<typeof useSpring>;
  sway: ReturnType<typeof useSpring>;
  direction: 'left' | 'right';
}) {
  // Calculate the hanging curve with sway
  const pathD = useTransform(
    [progress, sway],
    ([p, s]) => {
      const prog = Number(p);
      const swayAmount = Number(s);

      if (prog < 0.05) return '';

      // Current end position based on progress
      const currentEndX = startX + (endX - startX) * prog;
      const currentEndY = startY + (endY - startY) * prog;

      // Calculate the hanging curve (catenary-like)
      const distance = Math.abs(currentEndX - startX);
      const hangDepth = Math.min(distance * 0.15, 40) * prog; // How much it hangs down

      // Control points for the bezier curve
      const midX = (startX + currentEndX) / 2;
      const midY = Math.max(startY, currentEndY) + hangDepth + swayAmount;

      // Additional control points for smoother curve
      const ctrl1X = startX + (midX - startX) * 0.5;
      const ctrl1Y = startY + hangDepth * 0.3 + swayAmount * 0.5;

      const ctrl2X = midX + (currentEndX - midX) * 0.5;
      const ctrl2Y = currentEndY + hangDepth * 0.3 + swayAmount * 0.5;

      return `
        M ${startX} ${startY}
        Q ${ctrl1X} ${ctrl1Y + hangDepth * 0.5}, ${midX} ${midY}
        Q ${ctrl2X} ${ctrl2Y + hangDepth * 0.5}, ${currentEndX} ${currentEndY}
      `;
    }
  );

  const pathLength = useTransform(progress, [0, 1], [0, 1]);
  const opacity = useTransform(progress, [0, 0.1, 1], [0, 1, 1]);

  return (
    <motion.path
      d={pathD}
      fill="none"
      stroke="rgba(255, 255, 255, 0.9)"
      strokeWidth="2"
      strokeLinecap="round"
      style={{
        pathLength,
        opacity,
      }}
    />
  );
}
