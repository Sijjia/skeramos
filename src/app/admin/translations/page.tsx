'use client';

import { useState, useEffect } from 'react';
import { useToast, ToastContainer } from '@/components/admin/Toast';

type TranslationValue = string | Record<string, unknown>;
type TranslationSection = Record<string, TranslationValue>;
type LanguageTranslations = Record<string, TranslationSection>;
type AllTranslations = Record<string, LanguageTranslations>;

const LANGUAGES = [
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'kg', label: 'Кыргызча', flag: '🇰🇬' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

const SECTION_LABELS: Record<string, string> = {
  common: 'Общие',
  zones: 'Зоны',
  landing: 'Главная страница',
  creativity: 'Творческая зона',
  hotel: 'Отель',
  header: 'Меню',
  onboarding: 'Подсказки',
  footer: 'Футер',
  contacts: 'Контакты',
};

export default function TranslationsAdmin() {
  const [translations, setTranslations] = useState<AllTranslations>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('common');
  const [activeLang, setActiveLang] = useState<string>('ru');
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  const loadTranslations = async () => {
    try {
      const res = await fetch('/api/admin/translations');
      const data = await res.json();
      setTranslations(data);
    } catch (error) {
      console.error('Error loading translations:', error);
      toast.error('Ошибка загрузки переводов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTranslations();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/translations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(translations),
      });

      if (res.ok) {
        toast.success('Переводы сохранены!');
      } else {
        const err = await res.json();
        toast.error('Ошибка: ' + err.error);
      }
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const updateTranslation = (lang: string, section: string, key: string, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [section]: {
          ...(prev[lang]?.[section] as TranslationSection || {}),
          [key]: value,
        },
      },
    }));
  };

  const getSections = (): string[] => {
    const ruTranslations = translations.ru || {};
    return Object.keys(ruTranslations);
  };

  const getKeys = (section: string): string[] => {
    const ruSection = translations.ru?.[section];
    if (!ruSection || typeof ruSection !== 'object') return [];
    return Object.keys(ruSection as TranslationSection);
  };

  const getValue = (lang: string, section: string, key: string): string => {
    const sectionData = translations[lang]?.[section];
    if (!sectionData || typeof sectionData !== 'object') return '';
    const value = (sectionData as TranslationSection)[key];
    return typeof value === 'string' ? value : '';
  };

  const getTranslationStatus = (section: string, key: string) => {
    const ruValue = getValue('ru', section, key);
    const kgValue = getValue('kg', section, key);
    const enValue = getValue('en', section, key);
    return {
      hasRu: !!ruValue,
      hasKg: !!kgValue,
      hasEn: !!enValue,
    };
  };

  const filteredKeys = getKeys(activeSection).filter((key) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const ruValue = getValue('ru', activeSection, key).toLowerCase();
    return key.toLowerCase().includes(query) || ruValue.includes(query);
  });

  if (loading) {
    return <div className="text-white text-center py-8">Загрузка...</div>;
  }

  return (
    <div>
      <ToastContainer toasts={toast.toasts} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Переводы</h1>
          <p className="text-neutral-400 mt-1">Статические тексты сайта (кнопки, заголовки, меню)</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-neutral-600 text-white rounded-lg transition-colors"
        >
          {saving ? 'Сохранение...' : 'Сохранить всё'}
        </button>
      </div>

      {/* Секции */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {getSections().map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeSection === section
                ? 'bg-amber-600 text-white'
                : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
            }`}
          >
            {SECTION_LABELS[section] || section}
          </button>
        ))}
      </div>

      {/* Поиск и язык */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по ключу или тексту..."
          className="flex-1 px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
        />
        <div className="flex gap-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setActiveLang(lang.code)}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                activeLang === lang.code
                  ? 'bg-amber-600 text-white'
                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.code.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Таблица переводов */}
      <div className="bg-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-700">
            <tr>
              <th className="text-left p-4 text-neutral-300 font-medium w-48">Ключ</th>
              <th className="text-left p-4 text-neutral-300 font-medium">
                {LANGUAGES.find((l) => l.code === activeLang)?.flag}{' '}
                {LANGUAGES.find((l) => l.code === activeLang)?.label}
              </th>
              <th className="text-center p-4 text-neutral-300 font-medium w-32">Статус</th>
            </tr>
          </thead>
          <tbody>
            {filteredKeys.map((key) => {
              const status = getTranslationStatus(activeSection, key);
              const ruValue = getValue('ru', activeSection, key);
              const currentValue = getValue(activeLang, activeSection, key);

              return (
                <tr key={key} className="border-t border-neutral-700">
                  <td className="p-4">
                    <div className="text-white font-mono text-sm">{key}</div>
                    {activeLang !== 'ru' && ruValue && (
                      <div className="text-neutral-500 text-xs mt-1 truncate max-w-xs" title={ruValue}>
                        RU: {ruValue}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e) =>
                        updateTranslation(activeLang, activeSection, key, e.target.value)
                      }
                      placeholder={activeLang !== 'ru' ? ruValue : ''}
                      className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-1">
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          status.hasRu ? 'bg-green-600/30 text-green-400' : 'bg-red-600/30 text-red-400'
                        }`}
                      >
                        🇷🇺
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          status.hasKg ? 'bg-green-600/30 text-green-400' : 'bg-neutral-600/30 text-neutral-500'
                        }`}
                      >
                        🇰🇬
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          status.hasEn ? 'bg-green-600/30 text-green-400' : 'bg-neutral-600/30 text-neutral-500'
                        }`}
                      >
                        🇬🇧
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredKeys.length === 0 && (
          <div className="p-8 text-center text-neutral-400">
            {searchQuery ? 'Ничего не найдено' : 'Нет ключей в этой секции'}
          </div>
        )}
      </div>

      <p className="text-neutral-500 text-sm mt-4">
        После сохранения изменения вступят в силу после перезагрузки страницы сайта.
      </p>
    </div>
  );
}
