'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Achievement {
  year: number;
  text: string;
}

interface Master {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  experience: string;
  specialties: string[];
  achievements: Achievement[];
  whatsapp?: string;
  active: boolean;
}

const EMPTY_ITEM: Omit<Master, 'id'> = {
  name: '',
  role: '',
  bio: '',
  image: '',
  experience: '',
  specialties: [],
  achievements: [],
  whatsapp: '',
  active: true,
};

export default function MastersAdmin() {
  const [items, setItems] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Master | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [achievementYear, setAchievementYear] = useState(new Date().getFullYear());
  const [achievementText, setAchievementText] = useState('');

  const loadItems = async () => {
    try {
      const res = await fetch('/api/admin/data/masters');
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

  const handleEdit = (item: Master) => {
    setEditingItem({ ...item });
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editingItem) return;
    setSaving(true);

    try {
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/data/masters', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });

      if (res.ok) {
        await loadItems();
        setEditingItem(null);
      } else {
        const err = await res.json();
        alert('Ошибка: ' + err.error);
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этого мастера?')) return;

    try {
      const res = await fetch(`/api/admin/data/masters?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await loadItems();
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const addSpecialty = () => {
    if (!specialtyInput.trim() || !editingItem) return;
    setEditingItem({
      ...editingItem,
      specialties: [...(editingItem.specialties || []), specialtyInput.trim()],
    });
    setSpecialtyInput('');
  };

  const removeSpecialty = (index: number) => {
    if (!editingItem) return;
    setEditingItem({
      ...editingItem,
      specialties: editingItem.specialties.filter((_, i) => i !== index),
    });
  };

  const addAchievement = () => {
    if (!achievementText.trim() || !editingItem) return;
    const newAchievement: Achievement = {
      year: achievementYear,
      text: achievementText.trim(),
    };
    // Sort achievements by year (newest first)
    const updated = [...(editingItem.achievements || []), newAchievement].sort((a, b) => b.year - a.year);
    setEditingItem({
      ...editingItem,
      achievements: updated,
    });
    setAchievementText('');
  };

  const removeAchievement = (index: number) => {
    if (!editingItem) return;
    setEditingItem({
      ...editingItem,
      achievements: editingItem.achievements.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return <div className="text-white text-center py-8">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Мастера</h1>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
        >
          + Добавить мастера
        </button>
      </div>

      {/* List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`bg-neutral-800 rounded-xl overflow-hidden ${!item.active ? 'opacity-50' : ''}`}
          >
            {item.image && (
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white">{item.name}</h3>
              <p className="text-amber-400 text-sm mb-2">{item.role}</p>
              <p className="text-neutral-400 text-sm line-clamp-2">{item.bio}</p>

              {item.specialties && item.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {item.specialties.slice(0, 3).map((spec, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-neutral-700 text-neutral-300 rounded">
                      {spec}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm transition-colors"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full bg-neutral-800 rounded-xl p-8 text-center text-neutral-400">
            Нет мастеров. Добавьте первого!
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-neutral-800 rounded-xl p-6 w-full max-w-2xl my-8">
            <h2 className="text-xl font-bold text-white mb-6">
              {isNew ? 'Новый мастер' : 'Редактирование'}
            </h2>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 mb-2">Имя *</label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    placeholder="Айгуль Сатарова"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-2">Роль *</label>
                  <input
                    type="text"
                    value={editingItem.role}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, role: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    placeholder="Основатель, мастер-керамист"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 mb-2">Фото (URL)</label>
                <input
                  type="text"
                  value={editingItem.image}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, image: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-2">Биография</label>
                <textarea
                  value={editingItem.bio}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, bio: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500 h-24 resize-none"
                  placeholder="Расскажите о мастере..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 mb-2">Опыт</label>
                  <input
                    type="text"
                    value={editingItem.experience}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, experience: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    placeholder="15 лет"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-2">WhatsApp</label>
                  <input
                    type="text"
                    value={editingItem.whatsapp || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, whatsapp: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    placeholder="996555123456"
                  />
                </div>
              </div>

              {/* Specialties */}
              <div>
                <label className="block text-neutral-300 mb-2">Специализации</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={specialtyInput}
                    onChange={(e) => setSpecialtyInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                    className="flex-1 px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    placeholder="Добавить специализацию"
                  />
                  <button
                    type="button"
                    onClick={addSpecialty}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editingItem.specialties?.map((spec, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-700 text-neutral-300 rounded-full text-sm"
                    >
                      {spec}
                      <button
                        type="button"
                        onClick={() => removeSpecialty(i)}
                        className="text-red-400 hover:text-red-300 ml-1"
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-neutral-300 mb-2">Достижения (по годам)</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="number"
                    value={achievementYear}
                    onChange={(e) => setAchievementYear(parseInt(e.target.value) || new Date().getFullYear())}
                    className="w-24 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    placeholder="Год"
                    min={1990}
                    max={2030}
                  />
                  <input
                    type="text"
                    value={achievementText}
                    onChange={(e) => setAchievementText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                    className="flex-1 px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    placeholder="Описание достижения"
                  />
                  <button
                    type="button"
                    onClick={addAchievement}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
                  >
                    +
                  </button>
                </div>
                {/* Timeline view */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {editingItem.achievements?.map((ach, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 bg-neutral-700/50 rounded-lg"
                    >
                      <span className="text-amber-400 font-bold min-w-[50px]">{ach.year}</span>
                      <span className="flex-1 text-neutral-300 text-sm">{ach.text}</span>
                      <button
                        type="button"
                        onClick={() => removeAchievement(i)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                {(!editingItem.achievements || editingItem.achievements.length === 0) && (
                  <p className="text-neutral-500 text-sm text-center py-4">Нет достижений</p>
                )}
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
                disabled={saving || !editingItem.name || !editingItem.role}
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
