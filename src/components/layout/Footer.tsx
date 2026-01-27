'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Icon } from '@/components/ui';

export function Footer() {
  const locale = useLocale();
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-100 border-t border-border zone-transition">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and tagline */}
          <div className="md:col-span-1">
            <Link
              href={`/${locale}`}
              className="text-2xl font-bold text-zone-900 hover:text-zone-700 transition-colors"
            >
              Skeramos
            </Link>
            <p className="mt-2 text-sm text-neutral-600">
              Креативный дом
            </p>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-semibold text-zone-900 mb-3">{t('address')}</h4>
            <p className="text-neutral-600 text-sm">
              ул. Шукурова 8<br />
              Бишкек, Кыргызстан
            </p>
          </div>

          {/* Phone */}
          <div>
            <h4 className="font-semibold text-zone-900 mb-3">{t('phone')}</h4>
            <a
              href="tel:+996555123456"
              className="text-neutral-600 hover:text-zone-700 transition-colors text-sm"
            >
              +996 555 123 456
            </a>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-zone-900 mb-3">{t('social')}</h4>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/skeramos"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-600 hover:text-zone-700 hover:shadow-md transition-all"
                aria-label="Instagram"
              >
                <Icon name="instagram" size="md" />
              </a>
              <a
                href="https://wa.me/996555123456"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-600 hover:text-zone-700 hover:shadow-md transition-all"
                aria-label="WhatsApp"
              >
                <Icon name="whatsapp" size="md" />
              </a>
              <a
                href="https://t.me/skeramos"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-600 hover:text-zone-700 hover:shadow-md transition-all"
                aria-label="Telegram"
              >
                <Icon name="telegram" size="md" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-500">
            © {currentYear} Skeramos. {t('allRights')}.
          </p>
          <Link
            href={`/${locale}`}
            className="text-sm text-zone-700 hover:text-zone-900 transition-colors"
          >
            ← На главную
          </Link>
        </div>
      </div>
    </footer>
  );
}
