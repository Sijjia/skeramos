'use client';

import { useState, useEffect } from 'react';
import { useToast, ToastContainer } from '@/components/admin/Toast';

interface Review {
  id: string;
  author: string;
  text: string;
  rating: number;
  zone: 'creativity' | 'hotel';
  source: string;
  date: string;
  active: boolean;
}

const EMPTY_ITEM: Omit<Review, 'id'> = {
  author: '',
  text: '',
  rating: 5,
  zone: 'creativity',
  source: 'google',
  date: new Date().toISOString().split('T')[0],
  active: true,
};

const SOURCES = [
  { value: 'google', label: 'Google' },
  { value: '2gis', label: '2GIS' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'direct', label: 'Личный отзыв' },
];

export default function ReviewsAdmin() {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Review | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const loadItems = async () => {
    try {
      const res = await fetch('/api/admin/data/reviews');
      const data = await res.json();
      setItems(data);
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

  const handleEdit = (item: Review) => {
    setEditingItem({ ...item });
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editingItem) return;
    setSaving(true);

    try {
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/data/reviews', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });

      if (res.ok) {
        await loadItems();
        setEditingItem(null);
        toast.success('Сохранено!');
      }
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот отзыв?')) return;

    try {
      const res = await fetch(`/api/admin/data/reviews?id=${id}`, {
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

  const handleToggleActive = async (item: Review) => {
    try {
      await fetch('/api/admin/data/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, active: !item.active }),
      });
      await loadItems();
    } catch (error) {
      console.error('Error toggling:', error);
    }
  };

  if (loading) {
    return <div className="text-white text-center py-8">Загрузка...</div>;
  }

  return (
    <div>
      <ToastContainer toasts={toast.toasts} />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Отзывы</h1>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
        >
          + Добавить
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`bg-neutral-800 rounded-xl p-6 ${!item.active ? 'opacity-50' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-medium text-white">{item.author}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    item.zone === 'hotel' ? 'bg-rose-500/20 text-rose-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {item.zone === 'hotel' ? 'Отель' : 'Мастерская'}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-neutral-700 text-neutral-400">
                    {SOURCES.find(s => s.value === item.source)?.label}
                  </span>
                </div>

                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= item.rating ? 'text-amber-400' : 'text-neutral-600'}>
                      ★
                    </span>
                  ))}
                </div>

                <p className="text-neutral-300 italic">"{item.text}"</p>

                <div className="text-neutral-500 text-sm mt-2">{item.date}</div>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <button
                  onClick={() => handleToggleActive(item)}
                  className={`px-3 py-1 rounded text-sm ${
                    item.active
                      ? 'bg-green-600/20 text-green-400'
                      : 'bg-neutral-600/20 text-neutral-400'
                  }`}
                >
                  {item.active ? 'Виден' : 'Скрыт'}
                </button>
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
        ))}

        {items.length === 0 && (
          <div className="bg-neutral-800 rounded-xl p-8 text-center text-neutral-400">
            Нет отзывов. Добавьте первый!
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-800 rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-6">
              {isNew ? 'Новый отзыв' : 'Редактирование'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-neutral-300 mb-2">Автор *</label>
                <input
                  type="text"
                  value={editingItem.author}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, author: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  placeholder="Имя клиента"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-2">Текст отзыва *</label>
                <textarea
                  value={editingItem.text}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, text: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500 h-32 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 mb-2">Рейтинг</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditingItem({ ...editingItem, rating: star })}
                        className={`text-2xl ${star <= editingItem.rating ? 'text-amber-400' : 'text-neutral-600'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-neutral-300 mb-2">Зона</label>
                  <select
                    value={editingItem.zone}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, zone: e.target.value as 'creativity' | 'hotel' })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="creativity">Мастерская</option>
                    <option value="hotel">Отель</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 mb-2">Источник</label>
                  <select
                    value={editingItem.source}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, source: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    {SOURCES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-300 mb-2">Дата</label>
                  <input
                    type="date"
                    value={editingItem.date}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, date: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
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
                disabled={saving || !editingItem.author || !editingItem.text}
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
