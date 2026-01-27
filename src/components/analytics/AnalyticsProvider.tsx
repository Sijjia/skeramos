'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { GoogleAnalytics } from './GoogleAnalytics';
import { RetargetingPixels } from './RetargetingPixels';
import { captureUTMParams, getAnalyticsConfig } from '@/lib/analytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();
  const config = getAnalyticsConfig();

  // Capture UTM parameters on initial load
  useEffect(() => {
    captureUTMParams();
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag && config.gaId) {
      window.gtag('config', config.gaId, {
        page_path: pathname,
      });
    }
  }, [pathname, config.gaId]);

  return (
    <>
      {config.gaId && <GoogleAnalytics gaId={config.gaId} />}
      <RetargetingPixels
        facebookPixelId={config.facebookPixelId || undefined}
        vkPixelId={config.vkPixelId || undefined}
        tiktokPixelId={config.tiktokPixelId || undefined}
      />
      {children}
    </>
  );
}
