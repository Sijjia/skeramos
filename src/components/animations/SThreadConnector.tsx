'use client';

import { motion, useSpring, useTransform, useMotionValue, MotionValue } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';

type Zone = 'creativity' | 'hotel' | null;

interface SThreadConnectorProps {
  hoveredZone: Zone;
  leftTextRef: React.RefObject<HTMLElement | null>;
  rightTextRef: React.RefObject<HTMLElement | null>;
  leftSectionRef: React.RefObject<HTMLElement | null>;
}

// Default positions for SSR - will be updated on mount
const DEFAULT_POSITIONS = {
  dividerX: 500,
  dividerY: 400,
  leftX: 350,
  leftY: 400,
  rightX: 650,
  rightY: 400,
  isVertical: false
};

export function SThreadConnector({
  hoveredZone,
  leftTextRef,
  rightTextRef,
  leftSectionRef,
}: SThreadConnectorProps) {
  const [positions, setPositions] = useState(DEFAULT_POSITIONS);
  const [isMounted, setIsMounted] = useState(false);

  // Connection progress
  const connectionProgress = useMotionValue(0);
  const smoothProgress = useSpring(connectionProgress, {
    stiffness: 60,
    damping: 15,
    mass: 0.5
  });

  // Simple sway value
  const swayPhase = useMotionValue(0);

  // Update positions - tracks the moving split divider
  const updatePositions = useCallback(() => {
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;

    // Detect if layout is vertical (mobile) or horizontal (desktop)
    // Mobile breakpoint is 768px (md: in Tailwind)
    const isVertical = screenWidth < 768;

    let dividerX: number;
    let dividerY: number;

    if (isVertical) {
      // Vertical layout: divider is horizontal line between top and bottom sections
      dividerX = screenWidth / 2;
      if (leftSectionRef.current) {
        const rect = leftSectionRef.current.getBoundingClientRect();
        dividerY = rect.bottom; // Bottom edge of top section
      } else {
        dividerY = screenHeight / 2;
      }
    } else {
      // Horizontal layout: divider is vertical line between left and right sections
      if (leftSectionRef.current) {
        const rect = leftSectionRef.current.getBoundingClientRect();
        dividerX = rect.right;
      } else {
        dividerX = screenWidth / 2;
      }
      dividerY = screenHeight / 2;
    }

    let leftX = dividerX - 150;
    let leftY = dividerY;
    let rightX = dividerX + 150;
    let rightY = dividerY;

    if (leftTextRef.current) {
      const rect = leftTextRef.current.getBoundingClientRect();
      if (isVertical) {
        // Attach to bottom center of top text
        leftX = rect.left + rect.width / 2;
        leftY = rect.bottom;
      } else {
        // Attach to the right edge of left text, vertically centered
        leftX = rect.right;
        leftY = rect.top + rect.height / 2;
      }
    }

    if (rightTextRef.current) {
      const rect = rightTextRef.current.getBoundingClientRect();
      if (isVertical) {
        // Attach to top center of bottom text
        rightX = rect.left + rect.width / 2;
        rightY = rect.top;
      } else {
        // Attach to the left edge of right text, vertically centered
        rightX = rect.left;
        rightY = rect.top + rect.height / 2;
      }
    }

    setPositions({ dividerX, dividerY, leftX, leftY, rightX, rightY, isVertical });
  }, [leftTextRef, rightTextRef, leftSectionRef]);

  // Mark as mounted and set initial positions
  useEffect(() => {
    setIsMounted(true);
    updatePositions();

    // Small delay to ensure DOM is ready
    const initTimer = setTimeout(updatePositions, 50);

    window.addEventListener('resize', updatePositions);
    return () => {
      window.removeEventListener('resize', updatePositions);
      clearTimeout(initTimer);
    };
  }, [updatePositions]);

  // Continuously update positions during hover animation
  useEffect(() => {
    let animationId: number;
    let frameCount = 0;
    const maxFrames = 60; // ~1 second of tracking at 60fps

    const trackPosition = () => {
      updatePositions();
      frameCount++;
      if (frameCount < maxFrames) {
        animationId = requestAnimationFrame(trackPosition);
      }
    };

    // Start tracking when hover state changes
    animationId = requestAnimationFrame(trackPosition);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
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

  const sLogoSize = 30;

  // Proper S letter path - adapts to layout orientation
  const x = positions.dividerX;
  const y = positions.dividerY;

  // For vertical layout, rotate S by 90 degrees
  const sPath = positions.isVertical
    ? `
      M ${x - sLogoSize} ${y + sLogoSize * 0.5}
      C ${x - sLogoSize} ${y - sLogoSize * 0.6}, ${x - sLogoSize * 0.1} ${y - sLogoSize * 0.6}, ${x} ${y}
      C ${x + sLogoSize * 0.1} ${y + sLogoSize * 0.6}, ${x + sLogoSize} ${y + sLogoSize * 0.6}, ${x + sLogoSize} ${y - sLogoSize * 0.5}
    `
    : `
      M ${x + sLogoSize * 0.5} ${y - sLogoSize}
      C ${x - sLogoSize * 0.6} ${y - sLogoSize}, ${x - sLogoSize * 0.6} ${y - sLogoSize * 0.1}, ${x} ${y}
      C ${x + sLogoSize * 0.6} ${y + sLogoSize * 0.1}, ${x + sLogoSize * 0.6} ${y + sLogoSize}, ${x - sLogoSize * 0.5} ${y + sLogoSize}
    `;

  const sLogoOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const centerKnotOpacity = useTransform(smoothProgress, [0, 0.3], [0, 1]);
  const endKnotOpacity = useTransform(smoothProgress, [0.5, 1], [0, 1]);

  // Don't render until mounted to avoid hydration issues
  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      <svg
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Shadow filter for thread */}
          <filter id="thread-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.3)" />
          </filter>
        </defs>

        {/* S Logo made of thread - fades when connecting */}
        <motion.g style={{ opacity: sLogoOpacity }}>
          {/* Shadow */}
          <path
            d={sPath}
            fill="none"
            stroke="rgba(0, 0, 0, 0.25)"
            strokeWidth="5"
            strokeLinecap="round"
            style={{ transform: 'translate(1px, 2px)', filter: 'blur(2px)' }}
          />
          {/* Core thread base */}
          <path
            d={sPath}
            fill="none"
            stroke="rgba(200, 180, 160, 0.5)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Main fiber 1 */}
          <path
            d={sPath}
            fill="none"
            stroke="rgba(255, 250, 245, 0.95)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Main fiber 2 - slightly offset */}
          <path
            d={sPath}
            fill="none"
            stroke="rgba(240, 235, 225, 0.7)"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{ transform: 'translate(0.5px, 0.5px)' }}
          />
          {/* Highlight */}
          <path
            d={sPath}
            fill="none"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="1"
            strokeLinecap="round"
            style={{ transform: 'translate(-0.5px, -0.5px)' }}
          />
        </motion.g>

        {/* Left/Top thread */}
        <ThreadRope
          startX={positions.dividerX}
          startY={positions.dividerY}
          endX={positions.leftX}
          endY={positions.leftY}
          progress={smoothProgress}
          swayPhase={swayPhase}
          isActive={!!hoveredZone}
          isVertical={positions.isVertical}
        />

        {/* Right/Bottom thread */}
        <ThreadRope
          startX={positions.dividerX}
          startY={positions.dividerY}
          endX={positions.rightX}
          endY={positions.rightY}
          progress={smoothProgress}
          swayPhase={swayPhase}
          isActive={!!hoveredZone}
          swayOffset={Math.PI * 0.3}
          isVertical={positions.isVertical}
        />

        {/* Center knot */}
        <motion.circle
          cx={positions.dividerX}
          cy={positions.dividerY}
          r="4"
          fill="rgba(255, 255, 255, 0.9)"
          style={{
            opacity: centerKnotOpacity,
          }}
        />

        {/* End knots */}
        <motion.circle
          cx={positions.leftX}
          cy={positions.leftY}
          r="3"
          fill="rgba(255, 255, 255, 0.85)"
          style={{
            opacity: endKnotOpacity,
          }}
        />
        <motion.circle
          cx={positions.rightX}
          cy={positions.rightY}
          r="3"
          fill="rgba(255, 255, 255, 0.85)"
          style={{
            opacity: endKnotOpacity,
          }}
        />
      </svg>
    </div>
  );
}

/**
 * Realistic thread with multiple twisted fibers
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
  isVertical = false,
}: {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: MotionValue<number>;
  swayPhase: MotionValue<number>;
  isActive: boolean;
  swayOffset?: number;
  isVertical?: boolean;
}) {
  // Generate multiple fiber paths for realistic thread look
  const generateFiberPath = (prog: number, t: number, fiberIndex: number, totalFibers: number) => {
    if (prog < 0.02) return '';

    // Current endpoint
    const curEndX = startX + (endX - startX) * prog;
    const curEndY = startY + (endY - startY) * prog;

    // Distance for sag calculation - use appropriate axis based on orientation
    const dist = isVertical
      ? Math.abs(curEndY - startY)
      : Math.abs(curEndX - startX);

    // Natural rope sag (catenary approximation)
    const baseSag = Math.min(dist * 0.15, 40);

    // Gentle sway when connected
    const sway = isActive && prog > 0.9
      ? Math.sin(t * 1.5 + swayOffset) * 6 + Math.sin(t * 2.3 + swayOffset) * 3
      : 0;

    const totalSag = baseSag * prog + sway;

    // Fiber offset for twisted effect
    const fiberPhase = (fiberIndex / totalFibers) * Math.PI * 2;
    const twistFrequency = 8; // Number of twists along the thread

    // Generate points along the curve
    const points: { x: number; y: number }[] = [];
    const segments = 20;

    for (let i = 0; i <= segments; i++) {
      const tParam = i / segments;

      // Base position along quadratic bezier - control point perpendicular to line direction
      let ctrlX: number;
      let ctrlY: number;

      if (isVertical) {
        // Vertical: sag goes to the right
        ctrlX = Math.max(startX, curEndX) + totalSag;
        ctrlY = (startY + curEndY) / 2;
      } else {
        // Horizontal: sag goes down
        ctrlX = (startX + curEndX) / 2;
        ctrlY = Math.max(startY, curEndY) + totalSag;
      }

      // Quadratic bezier formula
      const baseX = (1 - tParam) * (1 - tParam) * startX + 2 * (1 - tParam) * tParam * ctrlX + tParam * tParam * curEndX;
      const baseY = (1 - tParam) * (1 - tParam) * startY + 2 * (1 - tParam) * tParam * ctrlY + tParam * tParam * curEndY;

      // Add twist offset perpendicular to the curve
      const twistAmount = Math.sin(tParam * twistFrequency * Math.PI + fiberPhase + t * 2) * 1.5;

      // Calculate perpendicular direction based on orientation
      const perpX = isVertical ? twistAmount : 0;
      const perpY = isVertical ? 0 : twistAmount;

      points.push({
        x: baseX + perpX,
        y: baseY + perpY,
      });
    }

    // Create smooth path through points
    if (points.length < 2) return '';

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }

    return d;
  };

  // Main path for shadow and glow
  const mainPathD = useTransform(
    [progress, swayPhase],
    ([p, phase]) => {
      const prog = Number(p);
      const t = Number(phase);

      if (prog < 0.02) return '';

      const curEndX = startX + (endX - startX) * prog;
      const curEndY = startY + (endY - startY) * prog;
      const dist = isVertical
        ? Math.abs(curEndY - startY)
        : Math.abs(curEndX - startX);
      const baseSag = Math.min(dist * 0.15, 40);
      const sway = isActive && prog > 0.9
        ? Math.sin(t * 1.5 + swayOffset) * 6 + Math.sin(t * 2.3 + swayOffset) * 3
        : 0;
      const totalSag = baseSag * prog + sway;

      let ctrlX: number;
      let ctrlY: number;

      if (isVertical) {
        ctrlX = Math.max(startX, curEndX) + totalSag;
        ctrlY = (startY + curEndY) / 2;
      } else {
        ctrlX = (startX + curEndX) / 2;
        ctrlY = Math.max(startY, curEndY) + totalSag;
      }

      return `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${curEndX} ${curEndY}`;
    }
  );

  // Individual fiber paths
  const fiber1 = useTransform([progress, swayPhase], ([p, phase]) => generateFiberPath(Number(p), Number(phase), 0, 3));
  const fiber2 = useTransform([progress, swayPhase], ([p, phase]) => generateFiberPath(Number(p), Number(phase), 1, 3));
  const fiber3 = useTransform([progress, swayPhase], ([p, phase]) => generateFiberPath(Number(p), Number(phase), 2, 3));

  const opacity = useTransform(progress, [0, 0.1], [0, 1]);

  return (
    <motion.g style={{ opacity }}>
      {/* Shadow for depth */}
      <motion.path
        d={mainPathD}
        fill="none"
        stroke="rgba(0, 0, 0, 0.3)"
        strokeWidth="5"
        strokeLinecap="round"
        style={{
          transform: 'translate(1px, 2px)',
          filter: 'blur(2px)',
        }}
      />

      {/* Core thread - slightly thicker base */}
      <motion.path
        d={mainPathD}
        fill="none"
        stroke="rgba(200, 180, 160, 0.6)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Twisted fibers for texture */}
      <motion.path
        d={fiber1}
        fill="none"
        stroke="rgba(255, 250, 245, 0.9)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <motion.path
        d={fiber2}
        fill="none"
        stroke="rgba(240, 235, 225, 0.8)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <motion.path
        d={fiber3}
        fill="none"
        stroke="rgba(255, 252, 248, 0.85)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      {/* Highlight on top */}
      <motion.path
        d={mainPathD}
        fill="none"
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="1"
        strokeLinecap="round"
        style={{
          transform: 'translate(0, -1px)',
        }}
      />
    </motion.g>
  );
}
