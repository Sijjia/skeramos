'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useZone } from '@/contexts/ZoneContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FadeInOnScroll } from '@/components/animations/OptimizedAnimations';
import { EtnoPatternOverlay, GlowingAccent, SectionDivider } from '@/components/animations/EtnoDecorations';

// Типы категорий
type GalleryCategory = 'all' | 'works' | 'masterclasses' | 'events' | 'interior' | 'hotel';

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image: string;
  category: Exclude<GalleryCategory, 'all'>;
  author?: string;
  date?: string;
}

// Mock data - будет из Sanity
const GALLERY_ITEMS: GalleryItem[] = [
  // Работы мастеров
  {
    id: '1',
    title: 'Кесе с орнаментом',
    description: 'Традиционная пиала с кыргызским орнаментом "кочкор мүйүз"',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
    category: 'works',
    author: 'Айгуль Сатарова',
  },
  {
    id: '2',
    title: 'Набор посуды',
    description: 'Авторский набор для чаепития в современном стиле',
    image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=800&q=80',
    category: 'works',
    author: 'Бакыт Токтогулов',
  },
  {
    id: '3',
    title: 'Декоративная ваза',
    description: 'Ваза с росписью в технике глазури',
    image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&q=80',
    category: 'works',
    author: 'Нургуль Асанова',
  },
  {
    id: '4',
    title: 'Чайник ручной работы',
    description: 'Чайник в минималистичном стиле с текстурой камня',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
    category: 'works',
    author: 'Айгуль Сатарова',
  },
  // Мастер-классы
  {
    id: '5',
    title: 'Урок на гончарном круге',
    description: 'Первые шаги в работе с глиной',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
    category: 'masterclasses',
    date: 'Декабрь 2024',
  },
  {
    id: '6',
    title: 'Детский мастер-класс',
    description: 'Творческое занятие для детей 6-12 лет',
    image: 'https://images.unsplash.com/photo-1560421683-6856ea585c78?w=800&q=80',
    category: 'masterclasses',
    date: 'Ноябрь 2024',
  },
  {
    id: '7',
    title: 'Корпоративный тимбилдинг',
    description: 'Команда IT-компании создаёт керамику вместе',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80',
    category: 'masterclasses',
    date: 'Октябрь 2024',
  },
  // Мероприятия
  {
    id: '8',
    title: 'Выставка Craft Bishkek',
    description: 'Наши работы на ежегодной выставке',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    category: 'events',
    date: '2024',
  },
  {
    id: '9',
    title: 'Открытие новой студии',
    description: 'Торжественное открытие расширенного пространства',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
    category: 'events',
    date: '2023',
  },
  // Интерьер студии
  {
    id: '10',
    title: 'Гончарная зона',
    description: 'Три профессиональных гончарных круга',
    image: 'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=800&q=80',
    category: 'interior',
  },
  {
    id: '11',
    title: 'Зона ручной лепки',
    description: 'Комфортное пространство для творчества',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'interior',
  },
  {
    id: '12',
    title: 'Выставочное пространство',
    description: 'Галерея готовых работ',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80',
    category: 'interior',
  },
  // Отель
  {
    id: '13',
    title: 'Романтический номер',
    description: 'Уютный номер с видом на горы',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
    category: 'hotel',
  },
  {
    id: '14',
    title: 'Приватный кинозал',
    description: 'Уютное пространство для просмотра фильмов',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
    category: 'hotel',
  },
  {
    id: '15',
    title: 'Терраса с видом',
    description: 'Место для завтрака и отдыха',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    category: 'hotel',
  },
];

const CATEGORIES: { value: GalleryCategory; label: string; icon: string }[] = [
  { value: 'all', label: 'Все', icon: '✨' },
  { value: 'works', label: 'Работы', icon: '🏺' },
  { value: 'masterclasses', label: 'Мастер-классы', icon: '🎨' },
  { value: 'events', label: 'Мероприятия', icon: '🎉' },
  { value: 'interior', label: 'Интерьер', icon: '🏠' },
  { value: 'hotel', label: 'Отель', icon: '🛏️' },
];

export default function GalleryPage() {
  const { setZone } = useZone();
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setZone('creativity');
  }, [setZone]);

  const filteredItems = activeCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  // Навигация в модалке
  const handlePrev = useCallback(() => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
    setCurrentIndex(newIndex);
    setSelectedItem(filteredItems[newIndex]);
  }, [currentIndex, filteredItems]);

  const handleNext = useCallback(() => {
    const newIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedItem(filteredItems[newIndex]);
  }, [currentIndex, filteredItems]);

  // Открытие модалки
  const openModal = (item: GalleryItem) => {
    const index = filteredItems.findIndex(i => i.id === item.id);
    setCurrentIndex(index);
    setSelectedItem(item);
  };

  // Закрытие модалки по Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem) return;
      if (e.key === 'Escape') setSelectedItem(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, handlePrev, handleNext]);

  // Блокировка скролла при открытой модалке
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedItem]);

  return (
    <>
      <Header />
      <EtnoPatternOverlay pattern="shyrdak" opacity={0.02} />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <GlowingAccent position="top-left" zone="creativity" size={600} />
          <GlowingAccent position="bottom-right" zone="creativity" size={400} />

          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-2 rounded-full glass text-sm text-zone-300 font-medium mb-6">
                Наше творчество
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-medium text-white mb-6">
                <span className="bg-gradient-to-r from-zone-300 to-gold-500 bg-clip-text text-transparent">
                  Галерея
                </span>
              </h1>
              <p className="text-lg text-neutral-300">
                Изделия наших мастеров, моменты с мастер-классов и атмосфера нашего пространства
              </p>
            </FadeInOnScroll>
          </div>
        </section>

        <SectionDivider variant="diamond" className="opacity-50" />

        {/* Filters */}
        <section className="py-8 sticky top-16 z-30 bg-background/80 backdrop-blur-lg border-b border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`
                    px-4 py-2 md:px-6 md:py-3 rounded-xl text-sm font-medium transition-all duration-300
                    ${activeCategory === cat.value
                      ? 'bg-zone-500 text-white shadow-lg shadow-zone-500/30'
                      : 'glass text-neutral-300 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="break-inside-avoid"
                  >
                    <div
                      onClick={() => openModal(item)}
                      className="group relative overflow-hidden rounded-2xl cursor-pointer gpu-lift"
                    >
                      <div className="relative aspect-auto">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={800}
                          height={600}
                          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Info on hover */}
                        <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <h3 className="text-white font-display font-medium text-lg mb-1">
                            {item.title}
                          </h3>
                          {item.author && (
                            <p className="text-zone-300 text-sm">{item.author}</p>
                          )}
                          {item.date && (
                            <p className="text-neutral-400 text-sm">{item.date}</p>
                          )}
                        </div>

                        {/* Category badge */}
                        <div className="absolute top-3 left-3 px-2 py-1 rounded-full glass text-white text-xs">
                          {CATEGORIES.find(c => c.value === item.category)?.icon}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty state */}
            {filteredItems.length === 0 && (
              <div className="text-center py-20">
                <span className="text-6xl mb-4 block">🔍</span>
                <p className="text-neutral-400">В этой категории пока нет изображений</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 etno-tunduk">
          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-6">
                Хотите создать своё изделие?
              </h2>
              <p className="text-neutral-300 mb-8">
                Запишитесь на мастер-класс и ваша работа тоже может оказаться в нашей галерее!
              </p>
              <a
                href="/creativity#masterclasses"
                className="inline-block px-8 py-4 bg-zone-500 hover:bg-zone-600 text-white rounded-2xl font-medium transition-all hover-lift"
              >
                Записаться на мастер-класс
              </a>
            </FadeInOnScroll>
          </div>
        </section>
      </main>

      <Footer />

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-xl"
            onClick={() => setSelectedItem(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="max-w-5xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-3 gap-6">
                {/* Image */}
                <div className="md:col-span-2 relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                </div>

                {/* Info */}
                <div className="glass-card p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">
                      {CATEGORIES.find(c => c.value === selectedItem.category)?.icon}
                    </span>
                    <span className="text-zone-300 text-sm">
                      {CATEGORIES.find(c => c.value === selectedItem.category)?.label}
                    </span>
                  </div>

                  <h2 className="text-2xl font-display font-medium text-white mb-3">
                    {selectedItem.title}
                  </h2>

                  {selectedItem.description && (
                    <p className="text-neutral-300 mb-4">
                      {selectedItem.description}
                    </p>
                  )}

                  {selectedItem.author && (
                    <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                      <span>👤</span>
                      <span>{selectedItem.author}</span>
                    </div>
                  )}

                  {selectedItem.date && (
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <span>📅</span>
                      <span>{selectedItem.date}</span>
                    </div>
                  )}

                  {/* Counter */}
                  <div className="mt-6 pt-4 border-t border-white/10 text-center text-neutral-500 text-sm">
                    {currentIndex + 1} / {filteredItems.length}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
