'use client';

import { useState } from 'react';

export type LocalizedValue = {
  ru: string;
  kg: string;
  en: string;
};

const LANGUAGES = [
  { code: 'ru', label: 'RU', flag: '🇷🇺', name: 'Русский' },
  { code: 'kg', label: 'KG', flag: '🇰🇬', name: 'Кыргызча' },
  { code: 'en', label: 'EN', flag: '🇬🇧', name: 'English' },
] as const;

type LanguageCode = 'ru' | 'kg' | 'en';

interface LocalizedInputProps {
  label: string;
  value: LocalizedValue | string;
  onChange: (value: LocalizedValue) => void;
  type?: 'input' | 'textarea';
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

export function LocalizedInput({
  label,
  value,
  onChange,
  type = 'input',
  placeholder = '',
  required = false,
  rows = 3,
}: LocalizedInputProps) {
  const [activeLang, setActiveLang] = useState<LanguageCode>('ru');

  // Нормализуем значение - если строка, конвертируем в объект
  const normalizedValue: LocalizedValue = typeof value === 'string'
    ? { ru: value, kg: '', en: '' }
    : value || { ru: '', kg: '', en: '' };

  const handleChange = (lang: LanguageCode, newValue: string) => {
    onChange({
      ...normalizedValue,
      [lang]: newValue,
    });
  };

  const getPlaceholder = (lang: LanguageCode) => {
    if (lang === 'ru') return placeholder;
    if (normalizedValue.ru) {
      return `Перевод: "${normalizedValue.ru.slice(0, 50)}${normalizedValue.ru.length > 50 ? '...' : ''}"`;
    }
    return placeholder;
  };

  const hasTranslation = (lang: LanguageCode) => {
    return normalizedValue[lang]?.trim().length > 0;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-neutral-300">
          {label} {required && <span className="text-red-400">*</span>}
        </label>

        {/* Language tabs */}
        <div className="flex gap-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setActiveLang(lang.code)}
              className={`px-2 py-1 text-xs rounded-md flex items-center gap-1 transition-colors ${
                activeLang === lang.code
                  ? 'bg-amber-600 text-white'
                  : hasTranslation(lang.code)
                    ? 'bg-green-600/30 text-green-400 hover:bg-green-600/40'
                    : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
              }`}
              title={lang.name}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
              {hasTranslation(lang.code) && activeLang !== lang.code && (
                <span className="text-green-400">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Input field */}
      {type === 'textarea' ? (
        <textarea
          value={normalizedValue[activeLang] || ''}
          onChange={(e) => handleChange(activeLang, e.target.value)}
          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500 resize-none"
          placeholder={getPlaceholder(activeLang)}
          rows={rows}
        />
      ) : (
        <input
          type="text"
          value={normalizedValue[activeLang] || ''}
          onChange={(e) => handleChange(activeLang, e.target.value)}
          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
          placeholder={getPlaceholder(activeLang)}
        />
      )}

      {/* Translation status hint */}
      {activeLang !== 'ru' && !hasTranslation(activeLang) && normalizedValue.ru && (
        <p className="text-neutral-500 text-xs mt-1">
          💡 Введите перевод на {LANGUAGES.find(l => l.code === activeLang)?.name}
        </p>
      )}
    </div>
  );
}

// Helper to get localized value for display
export function getLocalizedValue(
  value: LocalizedValue | string | undefined,
  locale: string
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;

  const lang = locale as LanguageCode;
  return value[lang] || value.ru || '';
}

// Helper to create empty localized value
export function createLocalizedValue(ruValue: string = ''): LocalizedValue {
  return { ru: ruValue, kg: '', en: '' };
}

// Helper to check if value needs migration (is still a plain string)
export function isLegacyValue(value: LocalizedValue | string | undefined): boolean {
  return typeof value === 'string';
}
