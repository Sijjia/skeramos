'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useToast, ToastContainer } from '@/components/admin/Toast';
import { LocalizedInput, LocalizedValue, createLocalizedValue } from '@/components/admin/LocalizedInput';

interface Package {
  id: string;
  title: LocalizedValue | string;
  description: LocalizedValue | string;
  image: string;
  includes: string[];
  price: number;
  featured: boolean;
  active: boolean;
}

const EMPTY_ITEM: Omit<Package, 'id'> = {
  title: createLocalizedValue(),
  description: createLocalizedValue(),
  image: '',
  includes: [],
  price: 0,
  featured: false,
  active: true,
};

function getDisplayValue(val: LocalizedValue | string): string {
  if (typeof val === 'string') return val;
  return val?.ru || '';
}

function normalizeForEdit(item: Package): Package {
  return {
    ...item,
    title: typeof item.title === 'string' ? createLocalizedValue(item.title) : item.title || createLocalizedValue(),
    description: typeof item.description === 'string' ? createLocalizedValue(item.description) : item.description || createLocalizedValue(),
    includes: item.includes || [],
  };
}

function getTranslationStatus(item: Package) {
  const title = item.title;
  const desc = item.description;
  if (typeof title === 'string' || typeof desc === 'string') return { hasKg: false, hasEn: false };
  return {
    hasKg: !!(title?.kg && desc?.kg),
    hasEn: !!(title?.en && desc?.en),
  };
}

export default function PackagesAdmin() {
  const [items, setItems] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Package | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [includeInput, setIncludeInput] = useState('');
  const toast = useToast();

  const loadItems = async () => {
    try {
      const res = await fetch('/api/data.php?collection=packages');
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

  const handleEdit = (item: Package) => {
    setEditingItem(normalizeForEdit(item));
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editingItem) return;
    setSaving(true);

    try {
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/data.php?collection=packages', {
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
    if (!confirm('Удалить этот пакет?')) return;

    try {
      const res = await fetch(`/api/data.php?collection=packages&id=${id}`, {
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

  const addInclude = () => {
    if (!includeInput.trim() || !editingItem) return;
    setEditingItem({
      ...editingItem,
      includes: [...(editingItem.includes || []), includeInput.trim()],
    });
    setIncludeInput('');
  };

  const removeInclude = (index: number) => {
    if (!editingItem) return;
    setEditingItem({
      ...editingItem,
      includes: editingItem.includes.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return <div className="text-white text-center py-8">Загрузка...</div>;
  }

  return (
    <div>
      <ToastContainer toasts={toast.toasts} />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Пакеты отеля</h1>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
        >
          + Добавить пакет
        </button>
      </div>

      {/* List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const status = getTranslationStatus(item);
          return (
            <div
              key={item.id}
              className={`bg-neutral-800 rounded-xl overflow-hidden ${!item.active ? 'opacity-50' : ''}`}
            >
              {item.image && (
                <div className="relative h-40">
                  <Image
                    src={item.image}
                    alt={getDisplayValue(item.title)}
                    fill
                    className="object-cover"
                  />
                  {item.featured && (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-amber-500 text-white text-xs rounded-full">
                      На главной
                    </span>
                  )}
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">{getDisplayValue(item.title)}</h3>
                <p className="text-neutral-400 text-sm line-clamp-2 mb-2">{getDisplayValue(item.description)}</p>
                <p className="text-amber-400 font-bold">{item.price.toLocaleString()} сом</p>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-green-600/30 text-green-400">🇷🇺</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${status.hasKg ? 'bg-green-600/30 text-green-400' : 'bg-neutral-600/30 text-neutral-500'}`}>🇰🇬</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${status.hasEn ? 'bg-green-600/30 text-green-400' : 'bg-neutral-600/30 text-neutral-500'}`}>🇬🇧</span>
                  </div>
                  {item.includes && item.includes.length > 0 && (
                    <span className="text-xs text-neutral-500">{item.includes.length} позиций</span>
                  )}
                </div>

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
          );
        })}

        {items.length === 0 && (
          <div className="col-span-full bg-neutral-800 rounded-xl p-8 text-center text-neutral-400">
            Нет пакетов. Добавьте первый!
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-neutral-800 rounded-xl p-6 w-full max-w-lg my-8">
            <h2 className="text-xl font-bold text-white mb-6">
              {isNew ? 'Новый пакет' : 'Редактирование'}
            </h2>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <LocalizedInput
                label="Название"
                value={editingItem.title}
                onChange={(value) => setEditingItem({ ...editingItem, title: value })}
                placeholder="Романтический вечер"
                required
              />

              <LocalizedInput
                label="Описание"
                value={editingItem.description}
                onChange={(value) => setEditingItem({ ...editingItem, description: value })}
                type="textarea"
                placeholder="Опишите пакет..."
              />

              <ImageUpload
                value={editingItem.image}
                onChange={(url) => setEditingItem({ ...editingItem, image: url })}
                label="Изображение"
              />

              <div>
                <label className="block text-neutral-300 mb-2">Цена (сом) *</label>
                <input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, price: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  placeholder="12000"
                />
              </div>

              {/* Includes */}
              <div>
                <label className="block text-neutral-300 mb-2">Что включено</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={includeInput}
                    onChange={(e) => setIncludeInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
                    className="flex-1 px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    placeholder="Добавить пункт"
                  />
                  <button
                    type="button"
                    onClick={addInclude}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
                  >
                    +
                  </button>
                </div>
                <div className="space-y-2">
                  {editingItem.includes?.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-3 py-2 bg-neutral-700 rounded-lg"
                    >
                      <span className="text-neutral-300 text-sm">{item}</span>
                      <button
                        type="button"
                        onClick={() => removeInclude(i)}
                        className="text-red-400 hover:text-red-300"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={editingItem.featured}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, featured: e.target.checked })
                    }
                    className="w-5 h-5 rounded"
                  />
                  <label htmlFor="featured" className="text-neutral-300">
                    На главной
                  </label>
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
                    Активен
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || !getDisplayValue(editingItem.title) || !editingItem.price}
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
