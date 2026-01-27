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
      {/* Background with CSS transition */}
      <div
        className={`
          fixed inset-0 -z-10 transition-colors duration-300 ease-out
          ${currentZone === 'hotel' ? 'bg-hotel-950' : 'bg-creativity-950'}
        `}
      />

      {/* Simple pattern overlay - optimized */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-[0.02] bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='2' fill='%23ffffff'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Радиальное свечение сверху */}
      <div
        className={`
          fixed inset-0 -z-10 pointer-events-none
          transition-opacity duration-500
          ${currentZone === 'hotel'
            ? 'bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(196,45,84,0.12),transparent_50%)]'
            : 'bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(90,124,72,0.12),transparent_50%)]'
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
    primary: isHotel ? '#c42d54' : '#5a7c48',
    secondary: isHotel ? '#8b1e3c' : '#3d5530',
    bg: isHotel ? '#330a16' : '#0f160d',
    glow: isHotel ? 'rgba(196, 45, 84, 0.15)' : 'rgba(90, 124, 72, 0.15)',
  };
}
