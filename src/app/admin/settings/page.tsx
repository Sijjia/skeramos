'use client';

import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

interface GalleryCategory {
  value: string;
  label: string;
}

interface AdvantageItem {
  icon: string;
  title: string;
  description: string;
}

interface WhatYouGetItem {
  icon: string;
  title: string;
  description: string;
}

interface HotelAdvantageItem {
  icon: string;
  title: string;
  description: string;
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
  { value: 'works', label: 'Работы' },
  { value: 'masterclasses', label: 'Мастер-классы' },
  { value: 'events', label: 'Мероприятия' },
  { value: 'interior', label: 'Интерьер' },
  { value: 'hotel', label: 'Отель' },
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

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'gallery' | 'content'>('general');

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/admin/data/settings');
      const data = await res.json();
      // Initialize with defaults if not set
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
      // Set defaults on error
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
        { value: `category_${Date.now()}`, label: 'Новая категория' },
      ],
    });
  };

  const removeCategory = (index: number) => {
    if (!settings?.galleryCategories) return;
    const updated = [...settings.galleryCategories];
    updated.splice(index, 1);
    setSettings({ ...settings, galleryCategories: updated });
  };

  const updateCategory = (index: number, field: 'value' | 'label', value: string) => {
    if (!settings?.galleryCategories) return;
    const updated = [...settings.galleryCategories];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({ ...settings, galleryCategories: updated });
  };

  // Advantages helpers
  const addAdvantage = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      advantages: [
        ...(settings.advantages || []),
        { icon: 'star', title: '', description: '' },
      ],
    });
  };

  const removeAdvantage = (index: number) => {
    if (!settings?.advantages) return;
    const updated = [...settings.advantages];
    updated.splice(index, 1);
    setSettings({ ...settings, advantages: updated });
  };

  const updateAdvantage = (index: number, field: keyof AdvantageItem, value: string) => {
    if (!settings?.advantages) return;
    const updated = [...settings.advantages];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({ ...settings, advantages: updated });
  };

  // What You Get helpers
  const addWhatYouGet = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      whatYouGet: [
        ...(settings.whatYouGet || []),
        { icon: 'star', title: '', description: '' },
      ],
    });
  };

  const removeWhatYouGet = (index: number) => {
    if (!settings?.whatYouGet) return;
    const updated = [...settings.whatYouGet];
    updated.splice(index, 1);
    setSettings({ ...settings, whatYouGet: updated });
  };

  const updateWhatYouGet = (index: number, field: keyof WhatYouGetItem, value: string) => {
    if (!settings?.whatYouGet) return;
    const updated = [...settings.whatYouGet];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({ ...settings, whatYouGet: updated });
  };

  // Hotel Advantages helpers
  const addHotelAdvantage = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      hotelAdvantages: [
        ...(settings.hotelAdvantages || []),
        { icon: 'bed', title: '', description: '' },
      ],
    });
  };

  const removeHotelAdvantage = (index: number) => {
    if (!settings?.hotelAdvantages) return;
    const updated = [...settings.hotelAdvantages];
    updated.splice(index, 1);
    setSettings({ ...settings, hotelAdvantages: updated });
  };

  const updateHotelAdvantage = (index: number, field: keyof HotelAdvantageItem, value: string) => {
    if (!settings?.hotelAdvantages) return;
    const updated = [...settings.hotelAdvantages];
    updated[index] = { ...updated[index], [field]: value };
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
      <div className="flex gap-2 mb-8">
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
                  onChange={(e) => updateCategory(index, 'value', e.target.value)}
                  className="flex-1 px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  placeholder="Ключ (eng)"
                />
                <input
                  type="text"
                  value={cat.label}
                  onChange={(e) => updateCategory(index, 'label', e.target.value)}
                  className="flex-1 px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  placeholder="Название"
                />
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
                      onChange={(e) => updateAdvantage(index, 'icon', e.target.value)}
                      className="px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateAdvantage(index, 'title', e.target.value)}
                        className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                        placeholder="Заголовок"
                      />
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateAdvantage(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                        placeholder="Описание"
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
                      onChange={(e) => updateWhatYouGet(index, 'icon', e.target.value)}
                      className="px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateWhatYouGet(index, 'title', e.target.value)}
                        className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                        placeholder="Заголовок"
                      />
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateWhatYouGet(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                        placeholder="Описание"
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
                      onChange={(e) => updateHotelAdvantage(index, 'icon', e.target.value)}
                      className="px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateHotelAdvantage(index, 'title', e.target.value)}
                        className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                        placeholder="Заголовок (напр. Уютные номера)"
                      />
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateHotelAdvantage(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                        placeholder="Описание"
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
