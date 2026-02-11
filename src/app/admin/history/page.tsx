'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useToast, ToastContainer } from '@/components/admin/Toast';
import { LocalizedInput, LocalizedValue, createLocalizedValue } from '@/components/admin/LocalizedInput';

interface HistoryItem {
  id: string;
  year: number;
  month: string;
  title: LocalizedValue | string;
  description: LocalizedValue | string;
  image: string;
  milestone: 'founding' | 'achievement' | 'expansion' | 'award' | 'event';
  active: boolean;
}

const EMPTY_ITEM: Omit<HistoryItem, 'id'> = {
  year: new Date().getFullYear(),
  month: 'Январь',
  title: createLocalizedValue(),
  description: createLocalizedValue(),
  image: '',
  milestone: 'event',
  active: true,
};

function getDisplayValue(val: LocalizedValue | string): string {
  if (typeof val === 'string') return val;
  return val?.ru || '';
}

function normalizeForEdit(item: HistoryItem): HistoryItem {
  return {
    ...item,
    title: typeof item.title === 'string' ? createLocalizedValue(item.title) : item.title || createLocalizedValue(),
    description: typeof item.description === 'string' ? createLocalizedValue(item.description) : item.description || createLocalizedValue(),
  };
}

function getTranslationStatus(item: HistoryItem) {
  const title = item.title;
  const desc = item.description;
  if (typeof title === 'string' || typeof desc === 'string') return { hasKg: false, hasEn: false };
  return {
    hasKg: !!(title?.kg && desc?.kg),
    hasEn: !!(title?.en && desc?.en),
  };
}

const MILESTONE_TYPES = [
  { value: 'founding', label: 'Основание', color: 'bg-amber-500' },
  { value: 'achievement', label: 'Достижение', color: 'bg-green-500' },
  { value: 'expansion', label: 'Расширение', color: 'bg-blue-500' },
  { value: 'award', label: 'Награда', color: 'bg-purple-500' },
  { value: 'event', label: 'Событие', color: 'bg-neutral-500' },
];

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export default function HistoryAdmin() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<HistoryItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const loadItems = async () => {
    try {
      const res = await fetch('/api/admin/data/history');
      const data = await res.json();
      // Сортируем по году (новые сверху)
      const sorted = Array.isArray(data)
        ? data.sort((a, b) => b.year - a.year)
        : [];
      setItems(sorted);
    } catch (error) {
      console.error('Error loading:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleNew = () => {
    setEditingItem({ id: '', ...EMPTY_ITEM });
    setIsNew(true);
  };

  const handleEdit = (item: HistoryItem) => {
    setEditingItem(normalizeForEdit(item));
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editingItem) return;
    setSaving(true);

    try {
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/data/history', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });

      if (res.ok) {
        await loadItems();
        setEditingItem(null);
        toast.success('Сохранено!');
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

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот момент истории?')) return;

    try {
      const res = await fetch(`/api/admin/data/history?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await loadItems();
        toast.success('Удалено');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Ошибка удаления');
    }
  };

  if (loading) {
    return <div className="text-white text-center py-8">Загрузка...</div>;
  }

  return (
    <div>
      <ToastContainer toasts={toast.toasts} />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">История компании</h1>
          <p className="text-neutral-400 mt-1">Важные моменты и достижения</p>
        </div>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
        >
          + Добавить момент
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`bg-neutral-800 rounded-xl overflow-hidden flex ${!item.active ? 'opacity-50' : ''}`}
          >
            {/* Image */}
            {item.image && (
              <div className="relative w-40 h-32 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={getDisplayValue(item.title)}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-bold text-amber-400">{item.year}</span>
                    <span className="text-neutral-500">|</span>
                    <span className="text-neutral-400">{item.month}</span>
                    <span className={`px-2 py-0.5 rounded text-xs text-white ml-2 ${
                      MILESTONE_TYPES.find(t => t.value === item.milestone)?.color || 'bg-neutral-500'
                    }`}>
                      {MILESTONE_TYPES.find(t => t.value === item.milestone)?.label}
                    </span>
                    {(() => {
                      const status = getTranslationStatus(item);
                      return (
                        <div className="flex gap-1 ml-2">
                          <span className="text-xs px-1.5 py-0.5 rounded bg-green-600/30 text-green-400">🇷🇺</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${status.hasKg ? 'bg-green-600/30 text-green-400' : 'bg-neutral-600/30 text-neutral-500'}`}>🇰🇬</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${status.hasEn ? 'bg-green-600/30 text-green-400' : 'bg-neutral-600/30 text-neutral-500'}`}>🇬🇧</span>
                        </div>
                      );
                    })()}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{getDisplayValue(item.title)}</h3>
                  <p className="text-neutral-400 text-sm line-clamp-2 mt-1">{getDisplayValue(item.description)}</p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 text-blue-400 hover:text-blue-300"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 text-red-400 hover:text-red-300"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="bg-neutral-800 rounded-xl p-8 text-center text-neutral-400">
            Нет истории. Добавьте первый важный момент!
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">
              {isNew ? 'Новый момент истории' : 'Редактирование'}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 mb-2">Год *</label>
                  <input
                    type="number"
                    value={editingItem.year}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, year: parseInt(e.target.value) || 2024 })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    min="2000"
                    max="2030"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-2">Месяц</label>
                  <select
                    value={editingItem.month}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, month: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    {MONTHS.map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>

              <LocalizedInput
                label="Заголовок"
                value={editingItem.title}
                onChange={(value) => setEditingItem({ ...editingItem, title: value })}
                placeholder="Открытие мастерской"
                required
              />

              <LocalizedInput
                label="Описание"
                value={editingItem.description}
                onChange={(value) => setEditingItem({ ...editingItem, description: value })}
                type="textarea"
                placeholder="Подробное описание этого момента истории..."
                required
                rows={4}
              />

              <ImageUpload
                value={editingItem.image}
                onChange={(url) => setEditingItem({ ...editingItem, image: url })}
                label="Изображение"
              />

              <div>
                <label className="block text-neutral-300 mb-2">Тип события</label>
                <select
                  value={editingItem.milestone}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, milestone: e.target.value as HistoryItem['milestone'] })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                >
                  {MILESTONE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={editingItem.active}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, active: e.target.checked })
                  }
                  className="w-5 h-5 rounded"
                />
                <label htmlFor="active" className="text-neutral-300">
                  Показывать на сайте
                </label>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || !getDisplayValue(editingItem.title) || !getDisplayValue(editingItem.description)}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-neutral-600 text-white rounded-lg font-medium transition-colors"
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button
                onClick={() => setEditingItem(null)}
                className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
