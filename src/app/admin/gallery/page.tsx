'use client';

import { useState, useEffect } from 'react';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useToast, ToastContainer } from '@/components/admin/Toast';

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image: string;
  category: string;
  author?: string;
  date?: string;
  active: boolean;
}

interface GalleryCategory {
  value: string;
  label: string;
}

const DEFAULT_categories: GalleryCategory[] = [
  { value: 'works', label: 'Работы' },
  { value: 'masterclasses', label: 'Мастер-классы' },
  { value: 'events', label: 'Мероприятия' },
  { value: 'interior', label: 'Интерьер' },
  { value: 'hotel', label: 'Отель' },
];

const EMPTY_ITEM: Omit<GalleryItem, 'id'> = {
  title: '',
  description: '',
  image: '',
  category: 'works',
  author: '',
  date: '',
  active: true,
};

export default function GalleryAdmin() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>(DEFAULT_categories);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');
  const toast = useToast();

  const loadData = async () => {
    try {
      // Load gallery items and settings in parallel
      const [galleryRes, settingsRes] = await Promise.all([
        fetch('/api/admin/data/gallery'),
        fetch('/api/admin/data/settings'),
      ]);

      const galleryData = await galleryRes.json();
      const settingsData = await settingsRes.json();

      setItems(Array.isArray(galleryData) ? galleryData : []);

      // Use categories from settings if available
      if (settingsData.galleryCategories && settingsData.galleryCategories.length > 0) {
        setCategories(settingsData.galleryCategories);
      }
    } catch (error) {
      console.error('Error loading:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadItems = async () => {
    try {
      const res = await fetch('/api/admin/data/gallery');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading:', error);
    }
  };

  const handleNew = () => {
    setEditingItem({ id: '', ...EMPTY_ITEM });
    setIsNew(true);
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem({ ...item });
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editingItem) return;
    setSaving(true);

    try {
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/data/gallery', {
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
    if (!confirm('Удалить это изображение?')) return;

    try {
      const res = await fetch(`/api/admin/data/gallery?id=${id}`, {
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

  const filteredItems = filter === 'all'
    ? items
    : items.filter(item => item.category === filter);

  if (loading) {
    return <div className="text-white text-center py-8">Загрузка...</div>;
  }

  return (
    <div>
      <ToastContainer toasts={toast.toasts} />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Галерея</h1>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          + Добавить
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
          }`}
        >
          Все ({items.length})
        </button>
        {categories.map((cat) => {
          const count = items.filter(i => i.category === cat.value).length;
          return (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === cat.value ? 'bg-blue-600 text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
              }`}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-neutral-800 rounded-xl overflow-hidden group ${!item.active ? 'opacity-50' : ''}`}
          >
            <div className="relative aspect-square">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm"
                >
                  🗑️
                </button>
              </div>
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
                {categories.find(c => c.value === item.category)?.label}
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-white font-medium text-sm truncate">{item.title}</h3>
              {item.author && (
                <p className="text-neutral-400 text-xs mt-1">{item.author}</p>
              )}
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full bg-neutral-800 rounded-xl p-8 text-center text-neutral-400">
            Нет изображений в этой категории
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-800 rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-6">
              {isNew ? 'Новое изображение' : 'Редактирование'}
            </h2>

            <div className="space-y-4">
              <ImageUpload
                value={editingItem.image}
                onChange={(url) => setEditingItem({ ...editingItem, image: url })}
                label="Изображение *"
              />

              <div>
                <label className="block text-neutral-300 mb-2">Название *</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-2">Описание</label>
                <textarea
                  value={editingItem.description || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-blue-500 h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 mb-2">Категория</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, category: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-300 mb-2">Автор</label>
                  <input
                    type="text"
                    value={editingItem.author || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, author: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
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
                disabled={saving || !editingItem.image || !editingItem.title}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 text-white rounded-lg font-medium transition-colors"
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
