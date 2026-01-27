'use client';

import { useState, useEffect } from 'react';

interface Masterclass {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  duration: string;
  capacity: string;
  active: boolean;
}

const EMPTY_ITEM: Omit<Masterclass, 'id'> = {
  title: '',
  description: '',
  image: '',
  price: 0,
  duration: '',
  capacity: '',
  active: true,
};

export default function MasterclassesAdmin() {
  const [items, setItems] = useState<Masterclass[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Masterclass | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadItems = async () => {
    try {
      const res = await fetch('/api/admin/data/masterclasses');
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

  const handleEdit = (item: Masterclass) => {
    setEditingItem({ ...item });
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editingItem) return;
    setSaving(true);

    try {
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/data/masterclasses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
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
    if (!confirm('Удалить этот мастер-класс?')) return;

    try {
      const res = await fetch(`/api/admin/data/masterclasses?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await loadItems();
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleToggleActive = async (item: Masterclass) => {
    try {
      await fetch('/api/admin/data/masterclasses', {
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Мастер-классы</h1>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          + Добавить
        </button>
      </div>

      {/* List */}
      <div className="bg-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-700">
            <tr>
              <th className="text-left p-4 text-neutral-300 font-medium">Название</th>
              <th className="text-left p-4 text-neutral-300 font-medium">Цена</th>
              <th className="text-left p-4 text-neutral-300 font-medium">Длительность</th>
              <th className="text-center p-4 text-neutral-300 font-medium">Статус</th>
              <th className="text-right p-4 text-neutral-300 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-neutral-700 hover:bg-neutral-750">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <div className="text-white font-medium">{item.title}</div>
                      <div className="text-neutral-400 text-sm truncate max-w-xs">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-white">{item.price.toLocaleString()} сом</td>
                <td className="p-4 text-neutral-300">{item.duration}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      item.active
                        ? 'bg-green-600/20 text-green-400'
                        : 'bg-neutral-600/20 text-neutral-400'
                    }`}
                  >
                    {item.active ? 'Активен' : 'Скрыт'}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 text-blue-400 hover:text-blue-300 mr-2"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 text-red-400 hover:text-red-300"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="p-8 text-center text-neutral-400">
            Нет мастер-классов. Добавьте первый!
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">
              {isNew ? 'Новый мастер-класс' : 'Редактирование'}
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
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  placeholder="Знакомство с гончарным кругом"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-2">Описание *</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500 h-24 resize-none"
                  placeholder="Базовый мастер-класс для начинающих..."
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-2">Ссылка на изображение</label>
                <input
                  type="url"
                  value={editingItem.image}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, image: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  placeholder="https://images.unsplash.com/..."
                />
                {editingItem.image && (
                  <img
                    src={editingItem.image}
                    alt="Preview"
                    className="mt-2 h-32 rounded-lg object-cover"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 mb-2">Цена (сом) *</label>
                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        price: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                    placeholder="2500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-2">Длительность</label>
                  <input
                    type="text"
                    value={editingItem.duration}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, duration: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                    placeholder="2 часа"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 mb-2">Вместимость</label>
                <input
                  type="text"
                  value={editingItem.capacity}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, capacity: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  placeholder="до 6 человек"
                />
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
                disabled={saving || !editingItem.title}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-neutral-600 text-white rounded-lg font-medium transition-colors"
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
