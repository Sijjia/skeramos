'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui';
import { useZone } from '@/contexts/ZoneContext';
import { trackCTAClick, buildWhatsAppLink } from '@/lib/analytics';

interface StickyCTAProps {
  phone?: string;
  whatsappMessage?: string;
}

export function StickyCTA({
  phone = '996555123456',
  whatsappMessage = 'Здравствуйте! Хочу узнать подробнее.',
}: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const t = useTranslations('common');
  const { zone } = useZone();

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show on scroll up, hide on scroll down
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobile]);

  if (!isMobile) return null;

  const whatsappLink = buildWhatsAppLink(phone, whatsappMessage);
  const phoneLink = `tel:+${phone}`;

  const handlePhoneClick = () => {
    trackCTAClick('phone', zone);
  };

  const handleWhatsAppClick = () => {
    trackCTAClick('whatsapp', zone);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="h-14 bg-white border-t border-neutral-200 shadow-lg flex items-center justify-center gap-2 px-4">
            {/* Call button */}
            <a
              href={phoneLink}
              onClick={handlePhoneClick}
              className="flex-1 flex items-center justify-center gap-2 h-10 bg-zone-600 text-white rounded-xl font-medium hover:bg-zone-700 transition-colors"
            >
              <Icon name="phone" size="sm" />
              <span>{t('call')}</span>
            </a>

            {/* WhatsApp button */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="flex-1 flex items-center justify-center gap-2 h-10 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
            >
              <Icon name="whatsapp" size="sm" />
              <span>WhatsApp</span>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
