'use client';

import { useState, useEffect } from 'react';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface Room {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  capacity: number;
  size: number;
  amenities: string[];
  featured?: boolean;
  active: boolean;
}

const EMPTY_ITEM: Omit<Room, 'id'> = {
  title: '',
  description: '',
  image: '',
  price: 0,
  capacity: 2,
  size: 0,
  amenities: [],
  featured: false,
  active: true,
};

export default function RoomsAdmin() {
  const [items, setItems] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Room | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [amenitiesInput, setAmenitiesInput] = useState('');

  const loadItems = async () => {
    try {
      const res = await fetch('/api/admin/data/rooms');
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
    setAmenitiesInput('');
    setIsNew(true);
  };

  const handleEdit = (item: Room) => {
    setEditingItem({ ...item });
    setAmenitiesInput(item.amenities.join(', '));
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editingItem) return;
    setSaving(true);

    const itemToSave = {
      ...editingItem,
      amenities: amenitiesInput.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/data/rooms', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemToSave),
      });

      if (res.ok) {
        await loadItems();
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот номер?')) return;

    try {
      const res = await fetch(`/api/admin/data/rooms?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await loadItems();
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  if (loading) {
    return <div className="text-white text-center py-8">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Номера отеля</h1>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
        >
          + Добавить
        </button>
      </div>

      {/* List */}
      <div className="grid gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-neutral-800 rounded-xl p-6 flex gap-6"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="w-48 h-32 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-medium text-white flex items-center gap-2">
                    {item.title}
                    {item.featured && (
                      <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded">
                        Рекомендуем
                      </span>
                    )}
                    {!item.active && (
                      <span className="text-xs bg-neutral-600 text-neutral-300 px-2 py-0.5 rounded">
                        Скрыт
                      </span>
                    )}
                  </h3>
                  <p className="text-neutral-400 mt-1">{item.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-rose-400">
                    {item.price.toLocaleString()} сом
                  </div>
                  <div className="text-neutral-500 text-sm">/ночь</div>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4 text-neutral-400 text-sm">
                <span>👥 до {item.capacity} гостей</span>
                <span>📐 {item.size} м²</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {item.amenities.slice(0, 5).map((a, i) => (
                  <span key={i} className="px-2 py-1 bg-neutral-700 rounded text-neutral-300 text-xs">
                    {a}
                  </span>
                ))}
                {item.amenities.length > 5 && (
                  <span className="px-2 py-1 text-neutral-500 text-xs">
                    +{item.amenities.length - 5}
                  </span>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="bg-neutral-800 rounded-xl p-8 text-center text-neutral-400">
            Нет номеров. Добавьте первый!
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">
              {isNew ? 'Новый номер' : 'Редактирование'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-neutral-300 mb-2">Название *</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-2">Описание</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-rose-500 h-24 resize-none"
                />
              </div>

              <ImageUpload
                value={editingItem.image}
                onChange={(url) => setEditingItem({ ...editingItem, image: url })}
                label="Изображение"
              />

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-300 mb-2">Цена/ночь *</label>
                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, price: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-2">Гостей</label>
                  <input
                    type="number"
                    value={editingItem.capacity}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, capacity: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-2">Площадь м²</label>
                  <input
                    type="number"
                    value={editingItem.size}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, size: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 mb-2">Удобства (через запятую)</label>
                <input
                  type="text"
                  value={amenitiesInput}
                  onChange={(e) => setAmenitiesInput(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                  placeholder="Wi-Fi, Кондиционер, Smart TV, Душ"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-neutral-300">
                  <input
                    type="checkbox"
                    checked={editingItem.active}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, active: e.target.checked })
                    }
                    className="w-5 h-5 rounded"
                  />
                  Показывать на сайте
                </label>
                <label className="flex items-center gap-2 text-neutral-300">
                  <input
                    type="checkbox"
                    checked={editingItem.featured || false}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, featured: e.target.checked })
                    }
                    className="w-5 h-5 rounded"
                  />
                  Рекомендуемый
                </label>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || !editingItem.title}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-neutral-600 text-white rounded-lg font-medium transition-colors"
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
