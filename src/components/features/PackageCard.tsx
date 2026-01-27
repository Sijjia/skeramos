'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';

interface PackageCardProps {
  title: string;
  description: string;
  image: string;
  includes: string[];
  price: number;
  priceLabel?: string;
  ctaText?: string;
  ctaHref?: string;
  featured?: boolean;
  onClick?: () => void;
}

export function PackageCard({
  title,
  description,
  image,
  includes,
  price,
  priceLabel,
  ctaText,
  ctaHref,
  featured = false,
  onClick,
}: PackageCardProps) {
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
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer ${
        featured ? 'ring-2 ring-zone-500' : ''
      }`}
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
      {/* Featured badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-10 bg-zone-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          Популярный
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">{title}</h3>
        <p className="text-neutral-600 text-sm mb-4">{description}</p>

        {/* What's included */}
        <div className="mb-4">
          <p className="text-sm font-medium text-neutral-700 mb-2">Включено:</p>
          <ul className="space-y-1.5">
            {includes.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-neutral-600">
                <svg
                  className="w-4 h-4 text-zone-500 mt-0.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <div className="text-zone-700 font-bold text-xl">
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
