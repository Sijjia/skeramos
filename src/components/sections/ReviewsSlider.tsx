'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useZone } from '@/contexts/ZoneContext';

interface Review {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  rating: number;
  zone: 'creativity' | 'hotel';
  source: 'google' | '2gis' | 'instagram' | 'direct';
  date?: string;
}

// Mock data - будет из Sanity
const REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Алина К.',
    text: 'Потрясающий опыт! Пришла на мастер-класс по керамике и влюбилась в это дело. Мастера очень терпеливые и профессиональные. Уже записалась на курс!',
    rating: 5,
    zone: 'creativity',
    source: 'google',
    date: 'Декабрь 2024',
  },
  {
    id: '2',
    author: 'Дамир Б.',
    text: 'Отмечали юбилей компании. Тимбилдинг на гончарном круге — это что-то невероятное! Все были в восторге, особенно коллеги, которые думали, что это "не для них".',
    rating: 5,
    zone: 'creativity',
    source: '2gis',
    date: 'Ноябрь 2024',
  },
  {
    id: '3',
    author: 'Мария и Сергей',
    text: 'Провели здесь романтические выходные. Номер уютный, кинозал — просто мечта! А утром ещё и на мастер-класс сходили. Обязательно вернёмся!',
    rating: 5,
    zone: 'hotel',
    source: 'google',
    date: 'Октябрь 2024',
  },
  {
    id: '4',
    author: 'Нурсултан А.',
    text: 'Подарил жене сертификат на романтический вечер с кинозалом. Она была в восторге! Атмосфера невероятная, персонал очень внимательный.',
    rating: 5,
    zone: 'hotel',
    source: 'instagram',
    date: 'Сентябрь 2024',
  },
  {
    id: '5',
    author: 'Айгерим Т.',
    text: 'Хожу сюда уже третий месяц на курс. Прогресс очевиден — от кривых чашек до настоящих произведений искусства! Спасибо Айгуль за терпение.',
    rating: 5,
    zone: 'creativity',
    source: 'direct',
    date: 'Август 2024',
  },
  {
    id: '6',
    author: 'Эмиль К.',
    text: 'Снимали здесь приватный кинозал на день рождения друга. Топ локация! Можно принести свою еду, выбрать любой фильм. Рекомендую!',
    rating: 5,
    zone: 'hotel',
    source: '2gis',
    date: 'Август 2024',
  },
];

const SOURCE_ICONS: Record<string, string> = {
  google: '🔍',
  '2gis': '🗺️',
  instagram: '📸',
  direct: '💬',
};

const SOURCE_NAMES: Record<string, string> = {
  google: 'Google',
  '2gis': '2GIS',
  instagram: 'Instagram',
  direct: 'Личный отзыв',
};

interface ReviewsSliderProps {
  className?: string;
  autoPlay?: boolean;
  interval?: number;
}

export function ReviewsSlider({
  className = '',
  autoPlay = true,
  interval = 5000,
}: ReviewsSliderProps) {
  const { zone } = useZone();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Фильтруем отзывы по текущей зоне
  const filteredReviews = REVIEWS.filter(
    review => review.zone === zone || zone === 'creativity'
  );

  const currentReview = filteredReviews[currentIndex];

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
  }, [filteredReviews.length]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + filteredReviews.length) % filteredReviews.length);
  }, [filteredReviews.length]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Autoplay
  useEffect(() => {
    if (!autoPlay || isPaused) return;

    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, interval, goToNext]);

  // Reset index when zone changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [zone]);

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

  if (!currentReview) return null;

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main slider */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentReview.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="glass-card p-8 md:p-12"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xl ${i < currentReview.rating ? 'text-gold-500' : 'text-neutral-600'}`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-lg md:text-xl card-title leading-relaxed mb-8">
              "{currentReview.text}"
            </blockquote>

            {/* Author info */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {/* Avatar placeholder */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                  currentReview.zone === 'hotel' ? 'bg-hotel-500' : 'bg-zone-500'
                }`}>
                  {currentReview.author.charAt(0)}
                </div>
                <div>
                  <div className="font-medium card-title">{currentReview.author}</div>
                  <div className="text-sm card-muted">{currentReview.date}</div>
                </div>
              </div>

              {/* Source badge */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-sm text-neutral-600">
                <span>{SOURCE_ICONS[currentReview.source]}</span>
                <span>{SOURCE_NAMES[currentReview.source]}</span>
              </div>
            </div>

            {/* Zone indicator */}
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
              currentReview.zone === 'hotel'
                ? 'bg-hotel-500/20 text-hotel-300'
                : 'bg-zone-500/20 text-zone-300'
            }`}>
              {currentReview.zone === 'hotel' ? 'Отель' : 'Мастерская'}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        {/* Arrows */}
        <div className="flex gap-2">
          <button
            onClick={goToPrev}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-white transition-colors"
            aria-label="Предыдущий отзыв"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-white transition-colors"
            aria-label="Следующий отзыв"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className="flex gap-2">
          {filteredReviews.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-6 bg-zone-500'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Перейти к отзыву ${index + 1}`}
            />
          ))}
        </div>

        {/* Counter */}
        <div className="text-white/70 text-sm">
          {currentIndex + 1} / {filteredReviews.length}
        </div>
      </div>
    </div>
  );
}
