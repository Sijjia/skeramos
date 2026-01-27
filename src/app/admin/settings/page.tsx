'use client';

import { useState, useEffect } from 'react';

interface Settings {
  siteName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
  social: {
    instagram: string;
    facebook: string;
    telegram: string;
  };
  cinemaPrice: number;
}

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/admin/data/settings');
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error('Error loading:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

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
                value={settings.social.instagram}
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
              <label className="block text-neutral-300 mb-2">Facebook</label>
              <input
                type="url"
                value={settings.social.facebook}
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
              <label className="block text-neutral-300 mb-2">Telegram</label>
              <input
                type="url"
                value={settings.social.telegram}
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
