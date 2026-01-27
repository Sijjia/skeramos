'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';

interface Amenity {
  icon: 'bed' | 'tv' | 'heating' | 'wifi' | 'shower' | 'kitchen';
  label: string;
}

interface RoomCardProps {
  title: string;
  description: string;
  images: string[];
  amenities: Amenity[];
  price: number;
  priceLabel?: string; // e.g., "от"
  priceSuffix?: string; // e.g., "/ ночь"
  ctaText?: string;
  ctaHref?: string;
  onClick?: () => void;
}

const amenityIcons: Record<Amenity['icon'], React.ReactNode> = {
  bed: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M3 13h18v8H3zM3 13V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5M7 13V9M17 13V9" />
    </svg>
  ),
  tv: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  heating: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M12 2v10M12 18v4M4.93 10.93l1.41 1.41M17.66 12.34l1.41 1.41M2 18h20M6 14a6 6 0 0 1 12 0" />
    </svg>
  ),
  wifi: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
    </svg>
  ),
  shower: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M4 4h16v16H4zM9 9v6M15 9v6M12 9v6" />
    </svg>
  ),
  kitchen: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  ),
};

export function RoomCard({
  title,
  description,
  images,
  amenities,
  price,
  priceLabel,
  priceSuffix = '/ ночь',
  ctaText,
  ctaHref,
  onClick,
}: RoomCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const t = useTranslations('common');

  const handleCtaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (ctaHref) {
      window.open(ctaHref, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (ctaHref) {
      window.open(ctaHref, '_blank', 'noopener,noreferrer');
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentImage((prev) => (prev + 1) % images.length);
      } else {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
      }
    }

    setTouchStart(null);
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Image Gallery */}
      <div
        className="relative aspect-[4/3] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentImage]}
              alt={`${title} - фото ${currentImage + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Navigation arrows (desktop) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Предыдущее фото"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Следующее фото"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImage(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImage
                    ? 'bg-white w-4'
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                aria-label={`Перейти к фото ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>
        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{description}</p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-3 mb-4">
          {amenities.map((amenity, index) => (
            <span
              key={index}
              className="flex items-center gap-1.5 text-sm text-neutral-500"
            >
              {amenityIcons[amenity.icon]}
              {amenity.label}
            </span>
          ))}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div className="text-zone-700 font-bold text-lg">
            {priceLabel && <span className="text-sm font-normal">{priceLabel} </span>}
            {price.toLocaleString('ru-RU')} сом
            <span className="text-sm font-normal text-neutral-500"> {priceSuffix}</span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleCtaClick}
            className="shrink-0"
          >
            {ctaText || t('bookNow')}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
