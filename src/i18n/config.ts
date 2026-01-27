export const locales = ['ru', 'kg', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ru';

export const localeNames: Record<Locale, string> = {
  ru: 'Русский',
  kg: 'Кыргызча',
  en: 'English',
};

export const localeFlags: Record<Locale, string> = {
  ru: '🇷🇺',
  kg: '🇰🇬',
  en: '🇬🇧',
};
