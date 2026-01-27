'use client';

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

const UTM_STORAGE_KEY = 'skeramos_utm';
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

/**
 * Extract UTM parameters from URL and save to sessionStorage
 */
export function captureUTMParams(): UTMParams | null {
  if (typeof window === 'undefined') return null;

  const searchParams = new URLSearchParams(window.location.search);
  const utmParams: UTMParams = {};
  let hasUTM = false;

  for (const param of UTM_PARAMS) {
    const value = searchParams.get(param);
    if (value) {
      utmParams[param as keyof UTMParams] = value;
      hasUTM = true;
    }
  }

  if (hasUTM) {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmParams));
    return utmParams;
  }

  return null;
}

/**
 * Get stored UTM parameters from sessionStorage
 */
export function getStoredUTMParams(): UTMParams | null {
  if (typeof window === 'undefined') return null;

  const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Get UTM source description for WhatsApp/Telegram messages
 */
export function getUTMSourceDescription(): string {
  const utm = getStoredUTMParams();
  if (!utm?.utm_source) return '';

  const sourceMap: Record<string, string> = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    google: 'Google',
    yandex: 'Яндекс',
    '2gis': '2GIS',
    telegram: 'Telegram',
  };

  const sourceName = sourceMap[utm.utm_source.toLowerCase()] || utm.utm_source;
  return ` (пришёл из ${sourceName})`;
}

/**
 * Append UTM info to WhatsApp message
 */
export function appendUTMToMessage(message: string): string {
  const utmDescription = getUTMSourceDescription();
  return message + utmDescription;
}

/**
 * Build WhatsApp link with UTM tracking
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  const messageWithUTM = appendUTMToMessage(message);
  return `https://wa.me/${phone}?text=${encodeURIComponent(messageWithUTM)}`;
}

/**
 * Build Telegram link with UTM tracking
 */
export function buildTelegramLink(username: string, message?: string): string {
  const baseUrl = `https://t.me/${username}`;
  if (message) {
    const messageWithUTM = appendUTMToMessage(message);
    return `${baseUrl}?text=${encodeURIComponent(messageWithUTM)}`;
  }
  return baseUrl;
}
