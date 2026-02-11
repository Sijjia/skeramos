'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useZone } from '@/contexts/ZoneContext';
import { useReviews, type ReviewUI } from '@/hooks/useSanityData';

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
  const { data: reviews, loading } = useReviews();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Фильтруем отзывы по текущей зоне и активности
  const filteredReviews = reviews.filter(
    review => review.zone === zone && review.active !== false
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
    if (!autoPlay || isPaused || filteredReviews.length <= 1) return;

    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, interval, goToNext, filteredReviews.length]);

  // Reset index when zone changes or reviews load
  useEffect(() => {
    setCurrentIndex(0);
  }, [zone, reviews.length]);

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

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="glass-card p-8 md:p-12 animate-pulse">
          <div className="h-6 bg-white/10 rounded w-32 mb-6"></div>
          <div className="h-24 bg-white/10 rounded mb-8"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10"></div>
            <div className="h-4 bg-white/10 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  if (filteredReviews.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="glass-card p-8 md:p-12 text-center">
          <span className="text-4xl mb-4 block">💬</span>
          <p className="text-neutral-400">Отзывы скоро появятся</p>
        </div>
      </div>
    );
  }

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

              {/* Source badge with optional link */}
              {currentReview.sourceUrl ? (
                <a
                  href={currentReview.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-sm text-neutral-600 hover:bg-neutral-200 hover:text-zone-600 transition-colors group"
                >
                  <span>{SOURCE_ICONS[currentReview.source]}</span>
                  <span>{SOURCE_NAMES[currentReview.source]}</span>
                  <svg className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-sm text-neutral-600">
                  <span>{SOURCE_ICONS[currentReview.source]}</span>
                  <span>{SOURCE_NAMES[currentReview.source]}</span>
                </div>
              )}
            </div>

            {/* Zone indicator */}
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
              currentReview.zone === 'hotel'
                ? 'bg-hotel-500/20 text-hotel-600'
                : 'bg-zone-500/20 text-zone-600'
            }`}>
              {currentReview.zone === 'hotel' ? 'Отель' : 'Мастерская'}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {filteredReviews.length > 1 && (
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
                    : 'bg-neutral-300 hover:bg-neutral-400'
                }`}
                aria-label={`Перейти к отзыву ${index + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="text-neutral-500 text-sm">
            {currentIndex + 1} / {filteredReviews.length}
          </div>
        </div>
      )}
    </div>
  );
}
