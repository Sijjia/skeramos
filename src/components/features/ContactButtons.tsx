'use client';

import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui';
import { useZone } from '@/contexts/ZoneContext';
import { trackCTAClick, buildWhatsAppLink, buildTelegramLink } from '@/lib/analytics';

interface ContactButtonsProps {
  phone?: string;
  whatsappMessage?: string;
  telegramUsername?: string;
  variant?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
}

export function ContactButtons({
  phone = '996555123456',
  whatsappMessage = 'Здравствуйте! Хочу узнать подробнее.',
  telegramUsername = 'skeramos',
  variant = 'horizontal',
  size = 'md',
}: ContactButtonsProps) {
  const t = useTranslations('common');
  const { zone } = useZone();

  const phoneLink = `tel:+${phone}`;
  const whatsappLink = buildWhatsAppLink(phone, whatsappMessage);
  const telegramLink = buildTelegramLink(telegramUsername);

  const handlePhoneClick = () => trackCTAClick('phone', zone);
  const handleWhatsAppClick = () => trackCTAClick('whatsapp', zone);
  const handleTelegramClick = () => trackCTAClick('telegram', zone);

  const sizeClasses = {
    sm: 'h-10 px-4 text-sm gap-2',
    md: 'h-12 px-5 text-base gap-2.5',
    lg: 'h-14 px-6 text-lg gap-3',
  };

  const iconSizes = {
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'lg' as const,
  };

  const containerClasses = variant === 'vertical'
    ? 'flex flex-col gap-3 w-full'
    : 'flex flex-wrap gap-3';

  return (
    <div className={containerClasses}>
      {/* Phone button */}
      <a
        href={phoneLink}
        onClick={handlePhoneClick}
        className={`flex items-center justify-center ${sizeClasses[size]} bg-zone-600 text-white rounded-xl font-medium hover:bg-zone-700 transition-colors zone-transition`}
      >
        <Icon name="phone" size={iconSizes[size]} />
        <span>{t('call')}</span>
      </a>

      {/* WhatsApp button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleWhatsAppClick}
        className={`flex items-center justify-center ${sizeClasses[size]} bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors`}
      >
        <Icon name="whatsapp" size={iconSizes[size]} />
        <span>WhatsApp</span>
      </a>

      {/* Telegram button */}
      <a
        href={telegramLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleTelegramClick}
        className={`flex items-center justify-center ${sizeClasses[size]} bg-sky-500 text-white rounded-xl font-medium hover:bg-sky-600 transition-colors`}
      >
        <Icon name="telegram" size={iconSizes[size]} />
        <span>Telegram</span>
      </a>
    </div>
  );
}
