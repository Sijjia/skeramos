'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  duration?: string; // e.g., "2 часа"
  capacity?: string; // e.g., "1-8 чел"
  price: number;
  priceLabel?: string; // e.g., "от" for "от 2500 сом"
  ctaText?: string;
  ctaHref?: string;
  badge?: string; // e.g., "PRO" for courses
  onClick?: () => void;
}

export function ServiceCard({
  title,
  description,
  image,
  duration,
  capacity,
  price,
  priceLabel,
  ctaText,
  ctaHref,
  badge,
  onClick,
}: ServiceCardProps) {
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
      {/* Badge */}
      {badge && (
        <div className="absolute top-4 left-4 z-10 bg-zone-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          {badge}
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-1">
          {title}
        </h3>

        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{description}</p>

        {/* Meta info */}
        <div className="flex flex-wrap gap-3 mb-4 text-sm text-neutral-500">
          {duration && (
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              {duration}
            </span>
          )}
          {capacity && (
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {capacity}
            </span>
          )}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div className="text-zone-700 font-bold text-lg">
            {priceLabel && <span className="text-sm font-normal">{priceLabel} </span>}
            {price.toLocaleString('ru-RU')} сом
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
