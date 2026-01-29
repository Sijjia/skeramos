'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Icon } from '@/components/ui';
import { Phone } from 'lucide-react';

export function Footer() {
  const locale = useLocale();
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-100 border-t border-border zone-transition">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and tagline */}
          <div>
            <Link
              href={`/${locale}`}
              className="text-2xl font-bold text-zone-900 hover:text-zone-700 transition-colors"
            >
              Skeramos
            </Link>
            <p className="mt-2 text-sm text-neutral-600">
              Креативный дом
            </p>

            {/* Phone with icon */}
            <a
              href="tel:+996555123456"
              className="mt-4 inline-flex items-center gap-2 text-neutral-700 hover:text-zone-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">+996 555 123 456</span>
            </a>
          </div>

          {/* Address with 2GIS map */}
          <div>
            <h4 className="font-semibold text-zone-900 mb-3">{t('address')}</h4>
            <p className="text-neutral-600 text-sm mb-3">
              ул. Шукурова 8<br />
              Бишкек, Кыргызстан
            </p>

            {/* 2GIS Mini Map */}
            <div className="rounded-xl overflow-hidden border border-neutral-200">
              <iframe
                src="https://widgets.2gis.com/widget?type=firmsonmap&options=%7B%22pos%22%3A%7B%22lat%22%3A42.8746%2C%22lon%22%3A74.5698%2C%22zoom%22%3A16%7D%2C%22opt%22%3A%7B%22city%22%3A%22bishkek%22%7D%2C%22org%22%3A%22skeramos%22%7D"
                width="100%"
                height="150"
                style={{ border: 0 }}
                loading="lazy"
                title="Skeramos на карте 2GIS"
              />
            </div>
            <a
              href="https://2gis.kg/bishkek/firm/70000001031555279"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm text-zone-700 hover:text-zone-900 transition-colors"
            >
              Открыть в 2GIS
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Social Networks */}
          <div>
            <h4 className="font-semibold text-zone-900 mb-3">{t('social')}</h4>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://instagram.com/skeramos"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-600 hover:text-[#E4405F] hover:shadow-md transition-all"
                aria-label="Instagram"
              >
                <Icon name="instagram" size="md" />
              </a>
              <a
                href="https://wa.me/996555123456"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-600 hover:text-[#25D366] hover:shadow-md transition-all"
                aria-label="WhatsApp"
              >
                <Icon name="whatsapp" size="md" />
              </a>
              <a
                href="https://t.me/skeramos"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-600 hover:text-[#0088cc] hover:shadow-md transition-all"
                aria-label="Telegram"
              >
                <Icon name="telegram" size="md" />
              </a>
              <a
                href="https://facebook.com/skeramos"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-600 hover:text-[#1877F2] hover:shadow-md transition-all"
                aria-label="Facebook"
              >
                <Icon name="facebook" size="md" />
              </a>
              <a
                href="https://youtube.com/@skeramos"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-600 hover:text-[#FF0000] hover:shadow-md transition-all"
                aria-label="YouTube"
              >
                <Icon name="youtube" size="md" />
              </a>
              <a
                href="https://vk.com/skeramos"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-600 hover:text-[#0077FF] hover:shadow-md transition-all"
                aria-label="VK"
              >
                <Icon name="vk" size="md" />
              </a>
            </div>

            {/* Map links */}
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="https://2gis.kg/bishkek/firm/70000001031555279"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-white rounded-full text-xs text-neutral-600 hover:text-[#3DAD4B] hover:shadow-md transition-all"
              >
                2GIS
              </a>
              <a
                href="https://yandex.ru/maps/-/CHEpjQpr"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-white rounded-full text-xs text-neutral-600 hover:text-[#FC3F1D] hover:shadow-md transition-all"
              >
                Яндекс Карты
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-zone-900 mb-3">Навигация</h4>
            <nav className="flex flex-col gap-2">
              <Link
                href={`/${locale}/creativity`}
                className="text-sm text-neutral-600 hover:text-zone-700 transition-colors"
              >
                Арт-студия
              </Link>
              <Link
                href={`/${locale}/hotel`}
                className="text-sm text-neutral-600 hover:text-zone-700 transition-colors"
              >
                Бутик-отель
              </Link>
              <Link
                href={`/${locale}/gallery`}
                className="text-sm text-neutral-600 hover:text-zone-700 transition-colors"
              >
                Галерея
              </Link>
              <Link
                href={`/${locale}/contacts`}
                className="text-sm text-neutral-600 hover:text-zone-700 transition-colors"
              >
                Контакты
              </Link>
            </nav>
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
            На главную
          </Link>
        </div>
      </div>
    </footer>
  );
}
