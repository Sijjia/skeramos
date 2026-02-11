'use client';

import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { LocalizedValue, createLocalizedValue } from '@/components/admin/LocalizedInput';

interface GalleryCategory {
  value: string;
  label: LocalizedValue | string;
}

interface AdvantageItem {
  icon: string;
  title: LocalizedValue | string;
  description: LocalizedValue | string;
}

interface WhatYouGetItem {
  icon: string;
  title: LocalizedValue | string;
  description: LocalizedValue | string;
}

interface HotelAdvantageItem {
  icon: string;
  title: LocalizedValue | string;
  description: LocalizedValue | string;
}

interface Settings {
  siteName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
  social: {
    instagram: string;
    whatsapp: string;
    telegram: string;
    facebook: string;
    youtube: string;
    vk: string;
  };
  cinemaPrice: number;
  galleryCategories?: GalleryCategory[];
  advantages?: AdvantageItem[];
  whatYouGet?: WhatYouGetItem[];
  hotelAdvantages?: HotelAdvantageItem[];
}

const DEFAULT_GALLERY_CATEGORIES: GalleryCategory[] = [
  { value: 'works', label: createLocalizedValue('Работы') },
  { value: 'masterclasses', label: createLocalizedValue('Мастер-классы') },
  { value: 'events', label: createLocalizedValue('Мероприятия') },
  { value: 'interior', label: createLocalizedValue('Интерьер') },
  { value: 'hotel', label: createLocalizedValue('Отель') },
];

const ICON_OPTIONS = [
  { value: 'palette', label: '🎨 Палитра' },
  { value: 'graduation', label: '🎓 Образование' },
  { value: 'home', label: '🏠 Дом' },
  { value: 'gift', label: '🎁 Подарок' },
  { value: 'clock', label: '⏰ Время' },
  { value: 'users', label: '👥 Люди' },
  { value: 'sparkles', label: '✨ Искры' },
  { value: 'heart', label: '❤️ Сердце' },
  { value: 'camera', label: '📷 Камера' },
  { value: 'package', label: '📦 Пакет' },
  { value: 'award', label: '🏆 Награда' },
  { value: 'smile', label: '😊 Улыбка' },
  { value: 'coffee', label: '☕ Кофе' },
  { value: 'star', label: '⭐ Звезда' },
  { value: 'bed', label: '🛏️ Кровать' },
  { value: 'car', label: '🚗 Парковка' },
  { value: 'wifi', label: '📶 Wi-Fi' },
  { value: 'shield', label: '🛡️ Безопасность' },
  { value: 'key', label: '🔑 Ключ' },
  { value: 'sun', label: '☀️ Солнце' },
];

const LANGUAGES = [
  { code: 'ru', label: 'RU', flag: '🇷🇺' },
  { code: 'kg', label: 'KG', flag: '🇰🇬' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
] as const;

type LangCode = 'ru' | 'kg' | 'en';

// Helper functions
function getDisplayValue(val: LocalizedValue | string | undefined): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  return val.ru || '';
}

function normalizeToLocalized(val: LocalizedValue | string | undefined): LocalizedValue {
  if (!val) return createLocalizedValue();
  if (typeof val === 'string') return createLocalizedValue(val);
  return val;
}

function getLocalizedFieldValue(val: LocalizedValue | string | undefined, lang: LangCode): string {
  if (!val) return '';
  if (typeof val === 'string') return lang === 'ru' ? val : '';
  return val[lang] || '';
}

function setLocalizedFieldValue(val: LocalizedValue | string | undefined, lang: LangCode, newValue: string): LocalizedValue {
  const normalized = normalizeToLocalized(val);
  return { ...normalized, [lang]: newValue };
}

// Mini localized input component for inline use
function MiniLocalizedInput({
  value,
  onChange,
  placeholder,
  activeLang,
}: {
  value: LocalizedValue | string;
  onChange: (val: LocalizedValue) => void;
  placeholder?: string;
  activeLang: LangCode;
}) {
  const normalized = normalizeToLocalized(value);
  const currentValue = normalized[activeLang] || '';
  const ruValue = normalized.ru || '';

  return (
    <input
      type="text"
      value={currentValue}
      onChange={(e) => onChange(setLocalizedFieldValue(value, activeLang, e.target.value))}
      placeholder={activeLang !== 'ru' && ruValue ? `${ruValue}` : placeholder}
      className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
    />
  );
}

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'gallery' | 'content'>('general');
  const [activeLang, setActiveLang] = useState<LangCode>('ru');

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/admin/data/settings');
      const data = await res.json();
      setSettings({
        siteName: data.siteName || '',
        phone: data.phone || '',
        whatsapp: data.whatsapp || '',
        email: data.email || '',
        address: data.address || '',
        workingHours: data.workingHours || '',
        social: {
          instagram: data.social?.instagram || '',
          whatsapp: data.social?.whatsapp || '',
          telegram: data.social?.telegram || '',
          facebook: data.social?.facebook || '',
          youtube: data.social?.youtube || '',
          vk: data.social?.vk || '',
        },
        cinemaPrice: data.cinemaPrice || 0,
        galleryCategories: data.galleryCategories || DEFAULT_GALLERY_CATEGORIES,
        advantages: data.advantages || [],
        whatYouGet: data.whatYouGet || [],
        hotelAdvantages: data.hotelAdvantages || [],
      });
    } catch (error) {
      console.error('Error loading:', error);
      setSettings({
        siteName: '',
        phone: '',
        whatsapp: '',
        email: '',
        address: '',
        workingHours: '',
        social: {
          instagram: '',
          whatsapp: '',
          telegram: '',
          facebook: '',
          youtube: '',
          vk: '',
        },
        cinemaPrice: 0,
        galleryCategories: DEFAULT_GALLERY_CATEGORIES,
        advantages: [],
        whatYouGet: [],
        hotelAdvantages: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Gallery categories helpers
  const addCategory = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      galleryCategories: [
        ...(settings.galleryCategories || []),
        { value: `category_${Date.now()}`, label: createLocalizedValue('Новая категория') },
      ],
    });
  };

  const removeCategory = (index: number) => {
    if (!settings?.galleryCategories) return;
    const updated = [...settings.galleryCategories];
    updated.splice(index, 1);
    setSettings({ ...settings, galleryCategories: updated });
  };

  const updateCategoryValue = (index: number, value: string) => {
    if (!settings?.galleryCategories) return;
    const updated = [...settings.galleryCategories];
    updated[index] = { ...updated[index], value };
    setSettings({ ...settings, galleryCategories: updated });
  };

  const updateCategoryLabel = (index: number, label: LocalizedValue) => {
    if (!settings?.galleryCategories) return;
    const updated = [...settings.galleryCategories];
    updated[index] = { ...updated[index], label };
    setSettings({ ...settings, galleryCategories: updated });
  };

  // Advantages helpers
  const addAdvantage = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      advantages: [
        ...(settings.advantages || []),
        { icon: 'star', title: createLocalizedValue(), description: createLocalizedValue() },
      ],
    });
  };

  const removeAdvantage = (index: number) => {
    if (!settings?.advantages) return;
    const updated = [...settings.advantages];
    updated.splice(index, 1);
    setSettings({ ...settings, advantages: updated });
  };

  const updateAdvantageIcon = (index: number, icon: string) => {
    if (!settings?.advantages) return;
    const updated = [...settings.advantages];
    updated[index] = { ...updated[index], icon };
    setSettings({ ...settings, advantages: updated });
  };

  const updateAdvantageTitle = (index: number, title: LocalizedValue) => {
    if (!settings?.advantages) return;
    const updated = [...settings.advantages];
    updated[index] = { ...updated[index], title };
    setSettings({ ...settings, advantages: updated });
  };

  const updateAdvantageDesc = (index: number, description: LocalizedValue) => {
    if (!settings?.advantages) return;
    const updated = [...settings.advantages];
    updated[index] = { ...updated[index], description };
    setSettings({ ...settings, advantages: updated });
  };

  // What You Get helpers
  const addWhatYouGet = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      whatYouGet: [
        ...(settings.whatYouGet || []),
        { icon: 'star', title: createLocalizedValue(), description: createLocalizedValue() },
      ],
    });
  };

  const removeWhatYouGet = (index: number) => {
    if (!settings?.whatYouGet) return;
    const updated = [...settings.whatYouGet];
    updated.splice(index, 1);
    setSettings({ ...settings, whatYouGet: updated });
  };

  const updateWhatYouGetIcon = (index: number, icon: string) => {
    if (!settings?.whatYouGet) return;
    const updated = [...settings.whatYouGet];
    updated[index] = { ...updated[index], icon };
    setSettings({ ...settings, whatYouGet: updated });
  };

  const updateWhatYouGetTitle = (index: number, title: LocalizedValue) => {
    if (!settings?.whatYouGet) return;
    const updated = [...settings.whatYouGet];
    updated[index] = { ...updated[index], title };
    setSettings({ ...settings, whatYouGet: updated });
  };

  const updateWhatYouGetDesc = (index: number, description: LocalizedValue) => {
    if (!settings?.whatYouGet) return;
    const updated = [...settings.whatYouGet];
    updated[index] = { ...updated[index], description };
    setSettings({ ...settings, whatYouGet: updated });
  };

  // Hotel Advantages helpers
  const addHotelAdvantage = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      hotelAdvantages: [
        ...(settings.hotelAdvantages || []),
        { icon: 'bed', title: createLocalizedValue(), description: createLocalizedValue() },
      ],
    });
  };

  const removeHotelAdvantage = (index: number) => {
    if (!settings?.hotelAdvantages) return;
    const updated = [...settings.hotelAdvantages];
    updated.splice(index, 1);
    setSettings({ ...settings, hotelAdvantages: updated });
  };

  const updateHotelAdvantageIcon = (index: number, icon: string) => {
    if (!settings?.hotelAdvantages) return;
    const updated = [...settings.hotelAdvantages];
    updated[index] = { ...updated[index], icon };
    setSettings({ ...settings, hotelAdvantages: updated });
  };

  const updateHotelAdvantageTitle = (index: number, title: LocalizedValue) => {
    if (!settings?.hotelAdvantages) return;
    const updated = [...settings.hotelAdvantages];
    updated[index] = { ...updated[index], title };
    setSettings({ ...settings, hotelAdvantages: updated });
  };

  const updateHotelAdvantageDesc = (index: number, description: LocalizedValue) => {
    if (!settings?.hotelAdvantages) return;
    const updated = [...settings.hotelAdvantages];
    updated[index] = { ...updated[index], description };
    setSettings({ ...settings, hotelAdvantages: updated });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch('/api/admin/data/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="text-white text-center py-8">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Настройки сайта</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-neutral-600 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          {saving ? 'Сохранение...' : saved ? '✓ Сохранено' : 'Сохранить'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'general' ? 'bg-green-600 text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
          }`}
        >
          Общие
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'gallery' ? 'bg-green-600 text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
          }`}
        >
          Категории галереи
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'content' ? 'bg-green-600 text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
          }`}
        >
          Контент страниц
        </button>

        {/* Language switcher for gallery and content tabs */}
        {(activeTab === 'gallery' || activeTab === 'content') && (
          <div className="flex gap-1 ml-auto">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setActiveLang(lang.code)}
                className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-colors ${
                  activeLang === lang.code
                    ? 'bg-amber-600 text-white'
                    : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {activeTab === 'general' && (
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="bg-neutral-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📞</span> Контактная информация
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-neutral-300 mb-2">Название сайта</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) =>
                  setSettings({ ...settings, siteName: e.target.value })
                }
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 mb-2">Телефон</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                placeholder="+996 555 123 456"
              />
            </div>

            <div>
              <label className="block text-neutral-300 mb-2">WhatsApp (только цифры)</label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) =>
                  setSettings({ ...settings, whatsapp: e.target.value })
                }
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                placeholder="996555123456"
              />
            </div>

            <div>
              <label className="block text-neutral-300 mb-2">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 mb-2">Адрес</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 mb-2">Часы работы</label>
              <input
                type="text"
                value={settings.workingHours}
                onChange={(e) =>
                  setSettings({ ...settings, workingHours: e.target.value })
                }
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                placeholder="Пн-Вс: 10:00 - 22:00"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-neutral-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🌐</span> Социальные сети
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-neutral-300 mb-2">Instagram</label>
              <input
                type="url"
                value={settings.social?.instagram || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social: { ...settings.social, instagram: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                placeholder="https://instagram.com/skeramos"
              />
            </div>

            <div>
              <label className="block text-neutral-300 mb-2">WhatsApp (ссылка)</label>
              <input
                type="url"
                value={settings.social?.whatsapp || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social: { ...settings.social, whatsapp: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                placeholder="https://wa.me/996555123456"
              />
            </div>

            <div>
              <label className="block text-neutral-300 mb-2">Telegram</label>
              <input
                type="url"
                value={settings.social?.telegram || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social: { ...settings.social, telegram: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                placeholder="https://t.me/skeramos"
              />
            </div>

            <div>
              <label className="block text-neutral-300 mb-2">Facebook</label>
              <input
                type="url"
                value={settings.social?.facebook || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social: { ...settings.social, facebook: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                placeholder="https://facebook.com/skeramos"
              />
            </div>

            <div>
              <label className="block text-neutral-300 mb-2">YouTube</label>
              <input
                type="url"
                value={settings.social?.youtube || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social: { ...settings.social, youtube: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                placeholder="https://youtube.com/@skeramos"
              />
            </div>

            <div>
              <label className="block text-neutral-300 mb-2">VK</label>
              <input
                type="url"
                value={settings.social?.vk || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social: { ...settings.social, vk: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                placeholder="https://vk.com/skeramos"
              />
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mt-8 mb-6 flex items-center gap-2">
            <span>💰</span> Цены
          </h2>

          <div>
            <label className="block text-neutral-300 mb-2">Кинозал (сом/час)</label>
            <input
              type="number"
              value={settings.cinemaPrice}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  cinemaPrice: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
          </div>
        </div>
      </div>
      )}

      {/* Gallery Categories Tab */}
      {activeTab === 'gallery' && (
        <div className="bg-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🖼️</span> Категории галереи
              <span className="text-sm font-normal text-neutral-400 ml-2">
                ({LANGUAGES.find(l => l.code === activeLang)?.flag} {LANGUAGES.find(l => l.code === activeLang)?.label})
              </span>
            </h2>
            <button
              onClick={addCategory}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Добавить
            </button>
          </div>

          <div className="space-y-3">
            {settings.galleryCategories?.map((cat, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={cat.value}
                  onChange={(e) => updateCategoryValue(index, e.target.value)}
                  className="w-40 px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  placeholder="Ключ (eng)"
                />
                <div className="flex-1">
                  <MiniLocalizedInput
                    value={cat.label}
                    onChange={(label) => updateCategoryLabel(index, label)}
                    placeholder="Название категории"
                    activeLang={activeLang}
                  />
                </div>
                <button
                  onClick={() => removeCategory(index)}
                  className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <p className="mt-4 text-neutral-400 text-sm">
            💡 Ключ используется для фильтрации в галерее. Используйте латинские буквы без пробелов.
          </p>
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-8">
          <div className="text-neutral-400 text-sm mb-4">
            Редактирование: {LANGUAGES.find(l => l.code === activeLang)?.flag} {LANGUAGES.find(l => l.code === activeLang)?.label}
          </div>

          {/* Advantages */}
          <div className="bg-neutral-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>⭐</span> Преимущества (секция "Почему мы")
              </h2>
              <button
                onClick={addAdvantage}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Добавить
              </button>
            </div>

            <div className="space-y-4">
              {settings.advantages?.map((item, index) => (
                <div key={index} className="p-4 bg-neutral-700/50 rounded-lg">
                  <div className="flex gap-3 items-start">
                    <select
                      value={item.icon}
                      onChange={(e) => updateAdvantageIcon(index, e.target.value)}
                      className="px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="flex-1 space-y-2">
                      <MiniLocalizedInput
                        value={item.title}
                        onChange={(title) => updateAdvantageTitle(index, title)}
                        placeholder="Заголовок"
                        activeLang={activeLang}
                      />
                      <MiniLocalizedInput
                        value={item.description}
                        onChange={(desc) => updateAdvantageDesc(index, desc)}
                        placeholder="Описание"
                        activeLang={activeLang}
                      />
                    </div>
                    <button
                      onClick={() => removeAdvantage(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {(!settings.advantages || settings.advantages.length === 0) && (
                <p className="text-neutral-400 text-center py-8">
                  Нет преимуществ. Нажмите "Добавить" чтобы создать первое.
                </p>
              )}
            </div>
          </div>

          {/* What You Get */}
          <div className="bg-neutral-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🎁</span> Что вы получите
              </h2>
              <button
                onClick={addWhatYouGet}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Добавить
              </button>
            </div>

            <div className="space-y-4">
              {settings.whatYouGet?.map((item, index) => (
                <div key={index} className="p-4 bg-neutral-700/50 rounded-lg">
                  <div className="flex gap-3 items-start">
                    <select
                      value={item.icon}
                      onChange={(e) => updateWhatYouGetIcon(index, e.target.value)}
                      className="px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="flex-1 space-y-2">
                      <MiniLocalizedInput
                        value={item.title}
                        onChange={(title) => updateWhatYouGetTitle(index, title)}
                        placeholder="Заголовок"
                        activeLang={activeLang}
                      />
                      <MiniLocalizedInput
                        value={item.description}
                        onChange={(desc) => updateWhatYouGetDesc(index, desc)}
                        placeholder="Описание"
                        activeLang={activeLang}
                      />
                    </div>
                    <button
                      onClick={() => removeWhatYouGet(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {(!settings.whatYouGet || settings.whatYouGet.length === 0) && (
                <p className="text-neutral-400 text-center py-8">
                  Нет элементов. Нажмите "Добавить" чтобы создать первый.
                </p>
              )}
            </div>
          </div>

          {/* Hotel Advantages */}
          <div className="bg-neutral-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🏨</span> Преимущества отеля
              </h2>
              <button
                onClick={addHotelAdvantage}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Добавить
              </button>
            </div>

            <div className="space-y-4">
              {settings.hotelAdvantages?.map((item, index) => (
                <div key={index} className="p-4 bg-neutral-700/50 rounded-lg">
                  <div className="flex gap-3 items-start">
                    <select
                      value={item.icon}
                      onChange={(e) => updateHotelAdvantageIcon(index, e.target.value)}
                      className="px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="flex-1 space-y-2">
                      <MiniLocalizedInput
                        value={item.title}
                        onChange={(title) => updateHotelAdvantageTitle(index, title)}
                        placeholder="Заголовок (напр. Уютные номера)"
                        activeLang={activeLang}
                      />
                      <MiniLocalizedInput
                        value={item.description}
                        onChange={(desc) => updateHotelAdvantageDesc(index, desc)}
                        placeholder="Описание"
                        activeLang={activeLang}
                      />
                    </div>
                    <button
                      onClick={() => removeHotelAdvantage(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {(!settings.hotelAdvantages || settings.hotelAdvantages.length === 0) && (
                <p className="text-neutral-400 text-center py-8">
                  Нет преимуществ отеля. Нажмите "Добавить" чтобы создать первое.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
        <p className="text-neutral-400 text-sm">
          💡 <strong className="text-white">Подсказка:</strong> После сохранения настроек
          обновите страницу сайта чтобы увидеть изменения.
        </p>
      </div>
    </div>
  );
}
