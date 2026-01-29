'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface ZoneColorTransitionProps {
  children: ReactNode;
}

export function ZoneColorTransition({ children }: ZoneColorTransitionProps) {
  const pathname = usePathname();
  const [currentZone, setCurrentZone] = useState<'creativity' | 'hotel'>('creativity');

  useEffect(() => {
    if (pathname.includes('/hotel')) {
      setCurrentZone('hotel');
    } else if (pathname.includes('/creativity')) {
      setCurrentZone('creativity');
    }
  }, [pathname]);

  return (
    <div
      className="relative min-h-screen zone-bg-transition"
      data-zone={currentZone}
    >
      {/* Light background with texture */}
      <div
        className={`
          fixed inset-0 -z-10 transition-all duration-500 ease-out
          ${currentZone === 'hotel'
            ? 'bg-[#f8f6f4]'
            : 'bg-[#faf8f5]'
          }
        `}
      />

      {/* Texture overlay - saman for creativity, linen for hotel */}
      <div
        className={`
          fixed inset-0 -z-10 pointer-events-none transition-opacity duration-500
          ${currentZone === 'hotel' ? 'opacity-30' : 'opacity-25'}
        `}
        style={{
          backgroundImage: currentZone === 'hotel'
            ? `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3Cpattern id='linen' width='4' height='4' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 0h4v4H0z' fill='none' stroke='%23216b5e' stroke-width='0.3' opacity='0.1'/%3E%3C/pattern%3E%3Crect width='100%25' height='100%25' fill='url(%23linen)'/%3E%3C/svg%3E")`
            : `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3Cpattern id='saman' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='10' cy='10' r='0.5' fill='%23a93b24' opacity='0.08'/%3E%3C/pattern%3E%3Crect width='100%25' height='100%25' fill='url(%23saman)'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Subtle gradient overlay */}
      <div
        className={`
          fixed inset-0 -z-10 pointer-events-none
          transition-opacity duration-500
          ${currentZone === 'hotel'
            ? 'bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(33,107,94,0.08),transparent_50%)]'
            : 'bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(169,59,36,0.08),transparent_50%)]'
          }
        `}
      />

      {children}
    </div>
  );
}

// Хук для получения текущих цветов зоны
export function useZoneColors() {
  const pathname = usePathname();
  const isHotel = pathname.includes('/hotel');

  return {
    // Hotel: Emerald #216B5E, Creativity: Terracotta #A93B24
    primary: isHotel ? '#216b5e' : '#a93b24',
    secondary: isHotel ? '#194940' : '#8c3320',
    bg: isHotel ? '#f8f6f4' : '#faf8f5',
    bgDark: isHotel ? '#092c26' : '#3e150d',
    glow: isHotel ? 'rgba(33, 107, 94, 0.15)' : 'rgba(169, 59, 36, 0.15)',
    text: '#1a1816',
    textLight: '#faf9f7',
  };
}
