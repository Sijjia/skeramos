'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  masterclasses: number;
  reviews: number;
  gallery: number;
  packages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    masterclasses: 0,
    reviews: 0,
    gallery: 0,
    packages: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const collections = ['masterclasses', 'reviews', 'gallery', 'packages'];
      const results: Partial<Stats> = {};

      for (const col of collections) {
        try {
          const res = await fetch(`/api/admin/data/${col}`);
          const data = await res.json();
          results[col as keyof Stats] = Array.isArray(data) ? data.length : 0;
        } catch {
          results[col as keyof Stats] = 0;
        }
      }

      setStats(results as Stats);
    }

    loadStats();
  }, []);

  const cards = [
    {
      title: 'Мастер-классы',
      count: stats.masterclasses,
      icon: '🎨',
      href: '/admin/masterclasses',
      color: 'bg-green-600',
    },
    {
      title: 'Пакеты',
      count: stats.packages,
      icon: '📦',
      href: '/admin/packages',
      color: 'bg-rose-600',
    },
    {
      title: 'Отзывы',
      count: stats.reviews,
      icon: '⭐',
      href: '/admin/reviews',
      color: 'bg-amber-600',
    },
    {
      title: 'Галерея',
      count: stats.gallery,
      icon: '🖼️',
      href: '/admin/gallery',
      color: 'bg-blue-600',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Панель управления</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-neutral-800 rounded-xl p-6 hover:bg-neutral-750 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">{card.icon}</span>
              <span
                className={`${card.color} text-white text-2xl font-bold px-4 py-2 rounded-lg`}
              >
                {card.count}
              </span>
            </div>
            <h3 className="text-lg font-medium text-white group-hover:text-green-400 transition-colors">
              {card.title}
            </h3>
            <p className="text-neutral-400 text-sm mt-1">
              Управление контентом →
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-neutral-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/masterclasses?action=new"
            className="flex items-center gap-3 px-4 py-3 bg-green-600/20 hover:bg-green-600/30 rounded-lg text-green-400 transition-colors"
          >
            <span>➕</span>
            <span>Добавить мастер-класс</span>
          </Link>
          <Link
            href="/admin/reviews?action=new"
            className="flex items-center gap-3 px-4 py-3 bg-amber-600/20 hover:bg-amber-600/30 rounded-lg text-amber-400 transition-colors"
          >
            <span>➕</span>
            <span>Добавить отзыв</span>
          </Link>
          <Link
            href="/admin/gallery?action=new"
            className="flex items-center gap-3 px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 transition-colors"
          >
            <span>➕</span>
            <span>Добавить в галерею</span>
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
        <p className="text-neutral-400 text-sm">
          💡 <strong className="text-white">Подсказка:</strong> Изменения сохраняются автоматически в JSON-файлы.
          Для загрузки изображений используйте внешние ссылки (Unsplash, Imgur и т.д.)
        </p>
      </div>
    </div>
  );
}
