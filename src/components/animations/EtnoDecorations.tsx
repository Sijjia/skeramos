'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Этно-декорации на чистом CSS
 * Без Framer Motion для максимальной производительности
 */

// ============================================================================
// FloatingOrbs - Парящие декоративные элементы (CSS-only)
// ============================================================================

interface FloatingOrbsProps {
  zone?: 'creativity' | 'hotel';
  count?: number;
}

export function FloatingOrbs({ zone = 'creativity', count = 2 }: FloatingOrbsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  if (shouldReduceMotion) return null;

  // Correct zone colors - terracotta for creativity, emerald for hotel
  const color = zone === 'creativity' ? '#a93b24' : '#216b5e';

  // Simplified - only 2 orbs for performance
  const orbs = [
    { size: 400, top: '10%', right: '-5%' },
    { size: 300, bottom: '20%', left: '-5%' },
  ].slice(0, count);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            bottom: orb.bottom,
            left: orb.left,
            right: orb.right,
            background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// EtnoPatternOverlay - Статичный этно-паттерн
// ============================================================================

interface EtnoPatternOverlayProps {
  pattern?: 'tunduk' | 'shyrdak' | 'kochkor' | 'mixed';
  opacity?: number;
  className?: string;
}

export function EtnoPatternOverlay({
  pattern = 'mixed',
  opacity = 0.03,
  className = '',
}: EtnoPatternOverlayProps) {
  const patterns = {
    tunduk: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='white' stroke-width='0.5'%3E%3Ccircle cx='60' cy='60' r='25'/%3E%3Ccircle cx='60' cy='60' r='15'/%3E%3Cpath d='M60 35 L60 45 M60 75 L60 85 M35 60 L45 60 M75 60 L85 60'/%3E%3Cpath d='M46 46 L52 52 M68 68 L74 74 M46 74 L52 68 M68 52 L74 46'/%3E%3C/g%3E%3C/svg%3E")`,
    shyrdak: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='white' stroke-width='0.5'%3E%3Cpath d='M40 10 L50 20 L40 30 L30 20 Z'/%3E%3Cpath d='M40 50 L50 60 L40 70 L30 60 Z'/%3E%3Ccircle cx='40' cy='40' r='8'/%3E%3C/g%3E%3C/svg%3E")`,
    kochkor: `url("data:image/svg+xml,%3Csvg width='100' height='50' viewBox='0 0 100 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='white' stroke-width='0.8'%3E%3Cpath d='M10 25 Q10 10 25 10 Q40 10 40 25 Q40 40 25 40'/%3E%3Cpath d='M90 25 Q90 10 75 10 Q60 10 60 25 Q60 40 75 40'/%3E%3C/g%3E%3C/svg%3E")`,
    mixed: `url("data:image/svg+xml,%3Csvg width='160' height='160' viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='white' stroke-width='0.5'%3E%3Ccircle cx='80' cy='80' r='30'/%3E%3Ccircle cx='80' cy='80' r='20'/%3E%3Cpath d='M80 50 L80 30 M80 110 L80 130 M50 80 L30 80 M110 80 L130 80'/%3E%3Cpath d='M20 20 Q35 5 50 20 Q35 35 20 20'/%3E%3Cpath d='M140 20 Q125 5 110 20 Q125 35 140 20'/%3E%3Cpath d='M20 140 Q35 155 50 140 Q35 125 20 140'/%3E%3Cpath d='M140 140 Q125 155 110 140 Q125 125 140 140'/%3E%3C/g%3E%3C/svg%3E")`,
  };

  const sizes = {
    tunduk: '120px',
    shyrdak: '80px',
    kochkor: '100px 50px',
    mixed: '160px',
  };

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: patterns[pattern],
        backgroundSize: sizes[pattern],
        opacity,
      }}
    />
  );
}

// ============================================================================
// ScrollProgressBar - Полоса прогресса скролла (SSR-safe)
// ============================================================================

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const h = document.documentElement;
          const scrollProgress = h.scrollTop / (h.scrollHeight - h.clientHeight);
          setProgress(isNaN(scrollProgress) ? 0 : scrollProgress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50">
      <div
        className="h-full bg-gradient-to-r from-zone-400 to-gold-500 origin-left transition-transform duration-100 ease-out"
        style={{
          transform: `scaleX(${progress})`,
        }}
      />
    </div>
  );
}

// ============================================================================
// SectionDivider - Декоративный разделитель между секциями
// ============================================================================

interface SectionDividerProps {
  variant?: 'wave' | 'diamond' | 'dots';
  className?: string;
}

export function SectionDivider({ variant = 'wave', className = '' }: SectionDividerProps) {
  const dividers = {
    wave: (
      <svg viewBox="0 0 1200 40" className="w-full h-10" preserveAspectRatio="none">
        <path
          d="M0 20 Q150 0 300 20 Q450 40 600 20 Q750 0 900 20 Q1050 40 1200 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-zone-500/20"
        />
        <circle cx="0" cy="20" r="3" className="fill-zone-500/30" />
        <circle cx="300" cy="20" r="3" className="fill-zone-500/30" />
        <circle cx="600" cy="20" r="3" className="fill-zone-500/30" />
        <circle cx="900" cy="20" r="3" className="fill-zone-500/30" />
        <circle cx="1200" cy="20" r="3" className="fill-zone-500/30" />
      </svg>
    ),
    diamond: (
      <div className="flex items-center justify-center gap-4 py-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zone-500/20 to-transparent" />
        <div className="w-3 h-3 rotate-45 border border-zone-500/30" />
        <div className="w-2 h-2 rotate-45 bg-zone-500/20" />
        <div className="w-3 h-3 rotate-45 border border-zone-500/30" />
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zone-500/20 to-transparent" />
      </div>
    ),
    dots: (
      <div className="flex items-center justify-center gap-2 py-4">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-zone-500/20"
            style={{ opacity: 1 - Math.abs(i - 3) * 0.2 }}
          />
        ))}
      </div>
    ),
  };

  return <div className={className}>{dividers[variant]}</div>;
}

// ============================================================================
// GlowingAccent - Свечение для акцентов
// ============================================================================

interface GlowingAccentProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  zone?: 'creativity' | 'hotel';
  size?: number;
  className?: string;
}

export function GlowingAccent({
  position,
  zone = 'creativity',
  size = 400,
  className = '',
}: GlowingAccentProps) {
  // Correct zone colors - terracotta for creativity, emerald for hotel
  const color = zone === 'creativity' ? '#a93b24' : '#216b5e';

  const positions = {
    'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
    'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
    'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  return (
    <div
      className={`absolute rounded-full pointer-events-none ${positions[position]} ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        filter: 'blur(40px)',
      }}
    />
  );
}
