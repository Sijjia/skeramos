'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useZone } from '@/contexts/ZoneContext';
import { useGallery, useSettings, type GalleryItemUI } from '@/hooks/useSanityData';

import { Footer } from '@/components/layout/Footer';
import { FadeInOnScroll } from '@/components/animations/OptimizedAnimations';
import { EtnoPatternOverlay, GlowingAccent, SectionDivider } from '@/components/animations/EtnoDecorations';

interface GalleryItem extends GalleryItemUI {
  description?: string;
  author?: string;
  date?: string;
}

interface CategoryOption {
  value: string;
  label: string;
}

// Default categories will be replaced with translations in component
const DEFAULT_CATEGORIES: CategoryOption[] = [];

export default function GalleryPage() {
  const { setZone } = useZone();
  const locale = useLocale();
  const t = useTranslations('gallery');
  const tCommon = useTranslations('common');
  const { data: galleryData, loading } = useGallery();
  const { data: settings } = useSettings();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use categories from settings or defaults with translations
  const defaultTranslatedCategories: CategoryOption[] = [
    { value: 'works', label: t('works') },
    { value: 'masterclasses', label: t('masterclasses') },
    { value: 'events', label: t('events') },
    { value: 'interior', label: t('interior') },
    { value: 'hotel', label: t('hotel') },
  ];
  const categories: CategoryOption[] = settings.galleryCategories && settings.galleryCategories.length > 0
    ? settings.galleryCategories
    : defaultTranslatedCategories;

  useEffect(() => {
    setZone('creativity');
  }, [setZone]);

  // Преобразуем данные из API в формат для отображения
  const galleryItems: GalleryItem[] = galleryData.map(item => ({
    ...item,
    category: item.category || 'works',
  }));

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

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

      <EtnoPatternOverlay pattern="shyrdak" opacity={0.02} />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <GlowingAccent position="top-left" zone="creativity" size={600} />
          <GlowingAccent position="bottom-right" zone="creativity" size={400} />

          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-2 rounded-full glass text-sm text-zone-300 font-medium mb-6">
                {t('badge')}
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-medium text-neutral-800 mb-6">
                <span className="bg-gradient-to-r from-zone-400 to-gold-500 bg-clip-text text-transparent">
                  {t('title')}
                </span>
              </h1>
              <p className="text-lg text-neutral-500">
                {t('subtitle')}
              </p>
            </FadeInOnScroll>
          </div>
        </section>

        <SectionDivider variant="diamond" className="opacity-50" />

        {/* Filters */}
        <section className="py-8 sticky top-16 z-30 bg-background/80 backdrop-blur-lg border-b border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {/* All button */}
              <button
                onClick={() => setActiveCategory('all')}
                className={`
                  px-4 py-2 md:px-6 md:py-3 rounded-xl text-sm font-medium transition-all duration-300
                  ${activeCategory === 'all'
                    ? 'bg-zone-500 text-on-color shadow-lg shadow-zone-500/30'
                    : 'glass text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
                  }
                `}
              >
                <span className="mr-2">✨</span>
                {t('all')}
              </button>
              {/* Dynamic categories */}
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`
                    px-4 py-2 md:px-6 md:py-3 rounded-xl text-sm font-medium transition-all duration-300
                    ${activeCategory === cat.value
                      ? 'bg-zone-500 text-on-color shadow-lg shadow-zone-500/30'
                      : 'glass text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
                    }
                  `}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-8 h-8 border-2 border-zone-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-neutral-400">{tCommon('loading')}</p>
              </div>
            ) : filteredItems.length > 0 ? (
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
                            {categories.find((c: CategoryOption) => c.value === item.category)?.label || item.category}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-20">
                <span className="text-6xl mb-4 block">🎨</span>
                <h3 className="text-xl text-neutral-800 mb-2">{t('empty')}</h3>
                <p className="text-neutral-500">{t('emptySoon')}</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 etno-tunduk">
          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-medium text-neutral-800 mb-6">
                {t('wantToCreate')}
              </h2>
              <p className="text-neutral-600 mb-8">
                {t('signUpAndAppear')}
              </p>
              <Link
                href={`/${locale}/creativity#masterclasses`}
                className="inline-block px-8 py-4 bg-zone-500 hover:bg-zone-600 text-white rounded-2xl font-medium transition-all hover-lift"
              >
                {t('signUpMasterclass')}
              </Link>
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
                  <div className="mb-4">
                    <span className="px-3 py-1 rounded-full bg-zone-500/20 text-zone-300 text-sm">
                      {categories.find((c: CategoryOption) => c.value === selectedItem.category)?.label || selectedItem.category}
                    </span>
                  </div>

                  <h2 className="text-2xl font-display font-medium card-title mb-3">
                    {selectedItem.title}
                  </h2>

                  {selectedItem.description && (
                    <p className="card-text mb-4">
                      {selectedItem.description}
                    </p>
                  )}

                  {selectedItem.author && (
                    <div className="flex items-center gap-2 text-sm card-muted mb-2">
                      <span>👤</span>
                      <span>{selectedItem.author}</span>
                    </div>
                  )}

                  {selectedItem.date && (
                    <div className="flex items-center gap-2 text-sm card-muted">
                      <span>📅</span>
                      <span>{selectedItem.date}</span>
                    </div>
                  )}

                  {/* Counter */}
                  <div className="mt-6 pt-4 border-t border-neutral-200 text-center text-neutral-500 text-sm">
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
