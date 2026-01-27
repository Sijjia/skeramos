'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import type { Zone, ZoneContextValue } from '@/types/zone';
import { trackZoneSwitch } from '@/lib/analytics';

const ZONE_STORAGE_KEY = 'skeramos-zone';
const ONBOARDING_STORAGE_KEY = 'skeramos-onboarding-shown';

const ZoneContext = createContext<ZoneContextValue | null>(null);

interface ZoneProviderProps {
  children: ReactNode;
  defaultZone?: Zone;
}

export function ZoneProvider({ children, defaultZone = 'creativity' }: ZoneProviderProps) {
  const [zone, setZoneState] = useState<Zone>(defaultZone);
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();

  // Синхронизируем зону с URL
  useEffect(() => {
    if (pathname.includes('/hotel')) {
      setZoneState('hotel');
    } else if (pathname.includes('/creativity')) {
      setZoneState('creativity');
    }
  }, [pathname]);

  // Restore zone from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(ZONE_STORAGE_KEY);
    if (stored === 'creativity' || stored === 'hotel') {
      // Только если URL не указывает зону
      if (!pathname.includes('/hotel') && !pathname.includes('/creativity')) {
        setZoneState(stored);
      }
    }
    setIsHydrated(true);
  }, [pathname]);

  // Apply zone to document root and save to sessionStorage
  useEffect(() => {
    if (!isHydrated) return;

    document.documentElement.setAttribute('data-zone', zone);
    sessionStorage.setItem(ZONE_STORAGE_KEY, zone);
  }, [zone, isHydrated]);

  const setZone = useCallback(
    (newZone: Zone) => {
      if (newZone !== zone) {
        trackZoneSwitch(zone, newZone);
      }
      setZoneState(newZone);
    },
    [zone]
  );

  const toggleZone = useCallback(() => {
    setZoneState((current) => {
      const newZone = current === 'creativity' ? 'hotel' : 'creativity';
      trackZoneSwitch(current, newZone);
      return newZone;
    });
  }, []);

  return (
    <ZoneContext.Provider value={{ zone, setZone, toggleZone }}>
      {children}
    </ZoneContext.Provider>
  );
}

export function useZone(): ZoneContextValue {
  const context = useContext(ZoneContext);
  if (!context) {
    throw new Error('useZone must be used within a ZoneProvider');
  }
  return context;
}

// Hook for onboarding state
export function useOnboarding() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true); // Default true to prevent flash

  useEffect(() => {
    const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    setHasSeenOnboarding(stored === 'true');
  }, []);

  const markOnboardingComplete = useCallback(() => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    setHasSeenOnboarding(true);
  }, []);

  return { hasSeenOnboarding, markOnboardingComplete };
}

export { ZoneContext };
