// Analytics module for GA4, retargeting pixels, and UTM tracking
// Exports tracking functions and UTM utilities

import { getStoredUTMParams, type UTMParams } from './utm';

// Re-export UTM utilities
export * from './utm';

// Types
type EventName =
  | 'cta_click'
  | 'zone_switch'
  | 'page_view'
  | 'form_submit'
  | 'outbound_link'
  | 'scroll_depth'
  | 'video_play';

interface EventParams {
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  zone?: string;
  from_zone?: string;
  to_zone?: string;
  cta_type?: string;
  page_path?: string;
  page_title?: string;
  [key: string]: string | number | boolean | undefined;
}

// Declare gtag types
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    VK?: { Retargeting: { Hit: () => void; Event: (name: string) => void } };
    ttq?: { track: (event: string, params?: unknown) => void };
  }
}

/**
 * Track custom events to GA4 and retargeting pixels
 */
export function trackEvent(name: EventName, params?: EventParams) {
  // Attach UTM params to all events
  const utm = getStoredUTMParams();
  const enrichedParams = {
    ...params,
    ...(utm && {
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
    }),
  };

  // GA4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, enrichedParams);
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', name, enrichedParams);
  }
}

/**
 * Track CTA clicks (phone, whatsapp, telegram, instagram)
 */
export function trackCTAClick(
  ctaType: 'phone' | 'whatsapp' | 'telegram' | 'instagram',
  zone: 'creativity' | 'hotel',
  page?: string
) {
  trackEvent('cta_click', {
    category: 'CTA',
    action: 'click',
    cta_type: ctaType,
    label: ctaType,
    zone,
    page_path: page || (typeof window !== 'undefined' ? window.location.pathname : ''),
  });

  // Facebook Pixel conversion event
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Contact', { content_name: ctaType });
  }

  // VK Pixel conversion event
  if (typeof window !== 'undefined' && window.VK?.Retargeting) {
    window.VK.Retargeting.Event('contact_click');
  }

  // TikTok Pixel conversion event
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track('Contact', { content_type: ctaType });
  }
}

/**
 * Track zone switches between creativity and hotel
 */
export function trackZoneSwitch(
  fromZone: 'creativity' | 'hotel',
  toZone: 'creativity' | 'hotel'
) {
  trackEvent('zone_switch', {
    category: 'Navigation',
    action: 'zone_switch',
    from_zone: fromZone,
    to_zone: toZone,
  });
}

/**
 * Track page views (for SPA navigation)
 */
export function trackPageView(path: string, title: string) {
  // GA4 tracks page views automatically, but we can send custom ones
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: path,
      page_title: title,
    });
  }

  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }

  // VK Pixel
  if (typeof window !== 'undefined' && window.VK?.Retargeting) {
    window.VK.Retargeting.Hit();
  }
}

/**
 * Get analytics config from environment
 */
export function getAnalyticsConfig() {
  return {
    gaId: process.env.NEXT_PUBLIC_GA_ID || '',
    facebookPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID || '',
    vkPixelId: process.env.NEXT_PUBLIC_VK_PIXEL_ID || '',
    tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || '',
    isEnabled: process.env.NODE_ENV === 'production',
  };
}
