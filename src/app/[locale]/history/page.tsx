'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useZone } from '@/contexts/ZoneContext';
import { useHistory } from '@/hooks/useSanityData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Footer } from '@/components/layout/Footer';
import { FadeInOnScroll } from '@/components/animations/OptimizedAnimations';
import { EtnoPatternOverlay, GlowingAccent } from '@/components/animations/EtnoDecorations';

const MILESTONE_COLORS: Record<string, string> = {
  founding: 'bg-zone-500',
  achievement: 'bg-amber-500',
  expansion: 'bg-emerald-500',
  award: 'bg-purple-500',
  event: 'bg-sky-500',
};

export default function HistoryPage() {
  const { setZone } = useZone();
  const { data: historyData, loading } = useHistory();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setZone('creativity');
  }, [setZone]);

  // Фильтруем активные элементы и сортируем по году
  const historyItems = historyData
    .filter(item => item.active !== false)
    .sort((a, b) => a.year - b.year);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const goNext = () => {
    if (currentIndex < historyItems.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    setTouchStart(null);
  };

  const currentItem = historyItems[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  // Loading state
  if (loading) {
    return (
      <>
        <main className="min-h-screen bg-background pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="flex items-center justify-center">
              <div className="text-neutral-400">Загрузка истории...</div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Empty state
  if (historyItems.length === 0) {
    return (
      <>
        <EtnoPatternOverlay pattern="shyrdak" opacity={0.02} />
        <main className="min-h-screen bg-background pt-20">
          <section className="relative py-12 md:py-16 overflow-hidden">
            <GlowingAccent position="center" zone="creativity" size={600} />
            <div className="container mx-auto px-4">
              <FadeInOnScroll className="max-w-3xl mx-auto text-center">
                <span className="inline-block px-4 py-2 rounded-full glass text-sm text-zone-300 font-medium mb-4">
                  С 2024 года
                </span>
                <h1 className="text-4xl md:text-5xl font-display font-medium text-neutral-800 mb-4">
                  Наша{' '}
                  <span className="bg-gradient-to-r from-zone-400 to-gold-500 bg-clip-text text-transparent">
                    история
                  </span>
                </h1>
                <p className="text-neutral-500 mb-8">
                  От одного гончарного круга до творческого дома
                </p>
                <div className="text-center py-16">
                  <span className="text-6xl mb-4 block">📜</span>
                  <p className="text-neutral-500">
                    История скоро появится
                  </p>
                </div>
              </FadeInOnScroll>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <EtnoPatternOverlay pattern="shyrdak" opacity={0.02} />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero */}
        <section className="relative py-12 md:py-16 overflow-hidden">
          <GlowingAccent position="center" zone="creativity" size={600} />

          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-2 rounded-full glass text-sm text-zone-300 font-medium mb-4">
                С 2024 года
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-medium text-neutral-800 mb-4">
                Наша{' '}
                <span className="bg-gradient-to-r from-zone-400 to-gold-500 bg-clip-text text-transparent">
                  история
                </span>
              </h1>
              <p className="text-neutral-500">
                От одного гончарного круга до творческого дома
              </p>
            </FadeInOnScroll>
          </div>
        </section>

        {/* Timeline Slider */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            {/* Year Navigation */}
            <div className="flex justify-center mb-8 overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex gap-2">
                {historyItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => goToSlide(index)}
                    className={`
                      relative px-4 py-2 rounded-full font-medium text-sm transition-all whitespace-nowrap
                      ${index === currentIndex
                        ? 'bg-zone-500 text-on-color shadow-lg shadow-zone-500/30'
                        : 'glass text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
                      }
                    `}
                  >
                    {item.year}
                    {item.month && index === currentIndex && (
                      <span className="ml-1 text-zone-200">/ {item.month}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Slider */}
            <div
              ref={sliderRef}
              className="relative max-w-5xl mx-auto"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Navigation Arrows */}
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 z-20 w-12 h-12 rounded-full glass flex items-center justify-center text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-100 transition-all"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={goNext}
                disabled={currentIndex === historyItems.length - 1}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 z-20 w-12 h-12 rounded-full glass flex items-center justify-center text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-100 transition-all"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Slide Content */}
              <div className="overflow-hidden rounded-3xl">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="grid md:grid-cols-2 gap-0"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[400px]">
                      <Image
                        src={currentItem.image}
                        alt={currentItem.title}
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/80 hidden md:block" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:hidden" />

                      {/* Year/Month Badge - Mobile */}
                      <div className="absolute top-4 left-4 md:hidden">
                        <div className={`px-4 py-2 rounded-full ${MILESTONE_COLORS[currentItem.milestone]} text-white font-bold`}>
                          {currentItem.year}
                          {currentItem.month && <span className="font-normal ml-1">/ {currentItem.month}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="glass p-8 md:p-12 flex flex-col justify-center">
                      {/* Year/Month - Desktop */}
                      <div className="hidden md:flex items-center gap-3 mb-4">
                        <div className={`w-3 h-3 rounded-full ${MILESTONE_COLORS[currentItem.milestone]}`} />
                        <span className="text-zone-500 font-display text-lg font-bold">
                          {currentItem.year}
                          {currentItem.month && <span className="font-normal text-neutral-500 ml-2">/ {currentItem.month}</span>}
                        </span>
                      </div>

                      <h2 className="text-2xl md:text-3xl font-display font-medium text-neutral-800 mb-4">
                        {currentItem.title}
                      </h2>

                      <p className="text-neutral-600 leading-relaxed mb-6">
                        {currentItem.description}
                      </p>

                      {/* Progress indicator */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-500">
                          {currentIndex + 1} / {historyItems.length}
                        </span>
                        <div className="flex-1 h-1 bg-neutral-200 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-zone-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentIndex + 1) / historyItems.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dot Navigation */}
              <div className="flex justify-center gap-2 mt-6">
                {historyItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`
                      w-2 h-2 rounded-full transition-all
                      ${index === currentIndex
                        ? 'w-8 bg-zone-500'
                        : 'bg-neutral-300 hover:bg-neutral-400'
                      }
                    `}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Future Section */}
        <section className="py-16 md:py-24 etno-tunduk">
          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-2xl mx-auto text-center">
              <span className="text-5xl mb-6 block">2026+</span>
              <h2 className="text-3xl md:text-4xl font-display font-medium text-neutral-800 mb-6">
                Что дальше?
              </h2>
              <p className="text-neutral-600 mb-8">
                Мы продолжаем расти и мечтать. В планах — собственная линейка керамики,
                международные мастер-классы и создание сообщества керамистов Кыргызстана.
              </p>
              <p className="text-zone-500 text-lg">
                Присоединяйтесь к нашей истории — станьте её частью!
              </p>
            </FadeInOnScroll>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-8 text-center">
                  <span className="text-4xl mb-4 block">🎨</span>
                  <h3 className="text-xl font-display font-medium text-white mb-3">
                    Творить с нами
                  </h3>
                  <p className="text-neutral-400 mb-6 text-sm">
                    Запишитесь на мастер-класс и создайте своё первое изделие
                  </p>
                  <a
                    href="/creativity"
                    className="inline-block px-6 py-3 bg-zone-500 hover:bg-zone-600 text-white rounded-xl font-medium transition-colors"
                  >
                    Мастер-классы
                  </a>
                </div>

                <div className="glass-card p-8 text-center">
                  <span className="text-4xl mb-4 block">🏠</span>
                  <h3 className="text-xl font-display font-medium text-white mb-3">
                    Остаться с нами
                  </h3>
                  <p className="text-neutral-400 mb-6 text-sm">
                    Забронируйте номер и погрузитесь в атмосферу творчества
                  </p>
                  <a
                    href="/hotel"
                    className="inline-block px-6 py-3 bg-hotel-500 hover:bg-hotel-600 text-white rounded-xl font-medium transition-colors"
                  >
                    Номера отеля
                  </a>
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
