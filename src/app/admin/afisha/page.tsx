'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useToast, ToastContainer } from '@/components/admin/Toast';
import { LocalizedInput, LocalizedValue, createLocalizedValue } from '@/components/admin/LocalizedInput';

interface Event {
  id: string;
  title: LocalizedValue | string;
  description: LocalizedValue | string;
  date: string;
  time: string;
  image: string;
  location: string;
  type: 'masterclass' | 'holiday' | 'exhibition' | 'other';
  active: boolean;
}

const EMPTY_ITEM: Omit<Event, 'id'> = {
  title: createLocalizedValue(),
  description: createLocalizedValue(),
  date: new Date().toISOString().split('T')[0],
  time: '14:00 - 17:00',
  image: '',
  location: 'Skeramos, ул. Шукурова 8',
  type: 'masterclass',
  active: true,
};

const EVENT_TYPES = [
  { value: 'masterclass', label: 'Мастер-класс', color: 'bg-green-500' },
  { value: 'holiday', label: 'Праздник', color: 'bg-amber-500' },
  { value: 'exhibition', label: 'Выставка', color: 'bg-purple-500' },
  { value: 'other', label: 'Другое', color: 'bg-blue-500' },
];

function getDisplayValue(val: LocalizedValue | string): string {
  if (typeof val === 'string') return val;
  return val?.ru || '';
}

function normalizeForEdit(item: Event): Event {
  return {
    ...item,
    title: typeof item.title === 'string' ? createLocalizedValue(item.title) : item.title || createLocalizedValue(),
    description: typeof item.description === 'string' ? createLocalizedValue(item.description) : item.description || createLocalizedValue(),
  };
}

function getTranslationStatus(item: Event) {
  const title = item.title;
  const desc = item.description;
  if (typeof title === 'string' || typeof desc === 'string') return { hasKg: false, hasEn: false };
  return {
    hasKg: !!(title?.kg),
    hasEn: !!(title?.en),
  };
}

export default function AfishaAdmin() {
  const [items, setItems] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Event | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const loadItems = async () => {
    try {
      const res = await fetch('/api/data.php?collection=afisha');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
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

  const handleEdit = (item: Event) => {
    setEditingItem(normalizeForEdit(item));
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editingItem) return;
    setSaving(true);

    try {
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/data.php?collection=afisha', {
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
    if (!confirm('Удалить это событие?')) return;

    try {
      const res = await fetch(`/api/data.php?collection=afisha&id=${id}`, {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return <div className="text-white text-center py-8">Загрузка...</div>;
  }

  return (
    <div>
      <ToastContainer toasts={toast.toasts} />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Афиша</h1>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
        >
          + Добавить событие
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {items.map((item) => {
          const status = getTranslationStatus(item);
          return (
            <div
              key={item.id}
              className={`bg-neutral-800 rounded-xl overflow-hidden flex ${!item.active ? 'opacity-50' : ''}`}
            >
              {item.image && (
                <div className="relative w-48 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={getDisplayValue(item.title)}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs text-white ${
                        EVENT_TYPES.find(t => t.value === item.type)?.color || 'bg-neutral-500'
                      }`}>
                        {EVENT_TYPES.find(t => t.value === item.type)?.label}
                      </span>
                      <div className="flex gap-1">
                        <span className="text-xs px-1.5 py-0.5 rounded bg-green-600/30 text-green-400">🇷🇺</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${status.hasKg ? 'bg-green-600/30 text-green-400' : 'bg-neutral-600/30 text-neutral-500'}`}>🇰🇬</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${status.hasEn ? 'bg-green-600/30 text-green-400' : 'bg-neutral-600/30 text-neutral-500'}`}>🇬🇧</span>
                      </div>
                      {!item.active && (
                        <span className="px-2 py-0.5 rounded text-xs bg-neutral-600 text-neutral-300">
                          Скрыто
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{getDisplayValue(item.title)}</h3>
                    <p className="text-neutral-400 text-sm line-clamp-1">{getDisplayValue(item.description)}</p>
                    <div className="flex gap-4 mt-2 text-sm text-neutral-500">
                      <span>📅 {formatDate(item.date)}</span>
                      <span>🕐 {item.time}</span>
                      <span>📍 {item.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
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
          );
        })}

        {items.length === 0 && (
          <div className="bg-neutral-800 rounded-xl p-8 text-center text-neutral-400">
            Нет событий. Добавьте первое!
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">
              {isNew ? 'Новое событие' : 'Редактирование'}
            </h2>

            <div className="space-y-4">
              <LocalizedInput
                label="Название"
                value={editingItem.title}
                onChange={(value) => setEditingItem({ ...editingItem, title: value })}
                placeholder="Мастер-класс «Весенние вазы»"
                required
              />

              <LocalizedInput
                label="Описание"
                value={editingItem.description}
                onChange={(value) => setEditingItem({ ...editingItem, description: value })}
                type="textarea"
                placeholder="Описание события..."
              />

              <ImageUpload
                value={editingItem.image}
                onChange={(url) => setEditingItem({ ...editingItem, image: url })}
                label="Изображение"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 mb-2">Дата *</label>
                  <input
                    type="date"
                    value={editingItem.date}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, date: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-2">Время</label>
                  <input
                    type="text"
                    value={editingItem.time}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, time: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    placeholder="14:00 - 17:00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 mb-2">Место</label>
                <input
                  type="text"
                  value={editingItem.location}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, location: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  placeholder="Skeramos, ул. Шукурова 8"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-2">Тип события</label>
                <select
                  value={editingItem.type}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, type: e.target.value as Event['type'] })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                >
                  {EVENT_TYPES.map((type) => (
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
                disabled={saving || !getDisplayValue(editingItem.title) || !editingItem.date}
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
