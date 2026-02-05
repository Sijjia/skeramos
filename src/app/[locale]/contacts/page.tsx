'use client';

import { Suspense, lazy } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

import { Footer } from '@/components/layout/Footer';
import { ContactButtons, StickyCTA } from '@/components/features';
import { Icon } from '@/components/ui';

// Lazy load map component for better LCP
const LazyMap = lazy(() => import('@/components/features/Map').then(mod => ({ default: mod.Map })));

const PHONE = '996555123456';
const EMAIL = 'info@skeramos.kg';

export default function ContactsPage() {
  const t = useTranslations('contacts');
  const tFooter = useTranslations('footer');

  return (
    <>
      
      <StickyCTA phone={PHONE} />

      <main className="min-h-screen bg-background pt-24">
        {/* Hero Section */}
        <section className="py-12 md:py-16 light-section">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-display font-medium text-neutral-800 mb-4">
                {t('title')}
              </h1>
              <p className="text-lg text-neutral-600">
                {t('subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main content */}
        <section className="pb-16 md:pb-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Contact info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-6"
              >
                {/* Address */}
                <div className="glass-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-zone-500/20 rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-zone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold card-title mb-1">{tFooter('address')}</h3>
                      <p className="card-text">{t('address')}</p>
                      <a
                        href={`https://2gis.kg/bishkek/search/${encodeURIComponent(t('address'))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-zone-500 hover:text-zone-600 mt-2 text-sm transition-colors"
                      >
                        {t('getDirections')}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="glass-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-zone-500/20 rounded-full flex items-center justify-center shrink-0">
                      <Icon name="phone" size="lg" className="text-zone-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold card-title mb-1">{tFooter('phone')}</h3>
                      <a
                        href={`tel:+${PHONE}`}
                        className="card-text hover:text-zone-500 transition-colors text-lg"
                      >
                        +996 555 123 456
                      </a>
                    </div>
                  </div>
                </div>

                {/* Working hours */}
                <div className="glass-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-zone-500/20 rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-zone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold card-title mb-1">{t('workingHours')}</h3>
                      <p className="card-text">{t('workingHoursValue')}</p>
                    </div>
                  </div>
                </div>

                {/* Contact buttons */}
                <div className="glass-card p-6">
                  <h3 className="font-semibold card-title mb-4">{t('contactUs')}</h3>
                  <div className="flex flex-col gap-3">
                    <a
                      href={`https://wa.me/${PHONE}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/20"
                    >
                      <Icon name="whatsapp" size="md" />
                      WhatsApp
                    </a>
                    <a
                      href={`tel:+${PHONE}`}
                      className="flex items-center justify-center gap-3 px-6 py-4 bg-zone-500 hover:bg-zone-400 text-white rounded-xl font-medium transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-zone-500/20"
                    >
                      <Icon name="phone" size="md" />
                      Позвонить
                    </a>
                  </div>
                </div>

                {/* Social links */}
                <div className="glass-card p-6">
                  <h3 className="font-semibold card-title mb-4">{tFooter('social')}</h3>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://instagram.com/skeramos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                      aria-label="Instagram"
                    >
                      <Icon name="instagram" size="md" />
                    </a>
                    <a
                      href={`https://wa.me/${PHONE}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-lg hover:shadow-green-500/30 transition-all"
                      aria-label="WhatsApp"
                    >
                      <Icon name="whatsapp" size="md" />
                    </a>
                    <a
                      href="https://t.me/skeramos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-lg hover:shadow-sky-500/30 transition-all"
                      aria-label="Telegram"
                    >
                      <Icon name="telegram" size="md" />
                    </a>
                    <a
                      href="https://facebook.com/skeramos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                      aria-label="Facebook"
                    >
                      <Icon name="facebook" size="md" />
                    </a>
                    <a
                      href="https://youtube.com/@skeramos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-lg hover:shadow-red-500/30 transition-all"
                      aria-label="YouTube"
                    >
                      <Icon name="youtube" size="md" />
                    </a>
                    <a
                      href="https://vk.com/skeramos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-[#0077FF] rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                      aria-label="VK"
                    >
                      <Icon name="vk" size="md" />
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="glass-card p-4 h-full min-h-[400px]">
                  <h3 className="font-semibold card-title mb-4">{t('howToFind')}</h3>
                  <div className="rounded-xl overflow-hidden h-[calc(100%-2rem)] min-h-[350px]">
                    <Suspense
                      fallback={
                        <div className="w-full h-full bg-white/5 animate-pulse flex items-center justify-center rounded-xl">
                          <span className="text-neutral-400">Загрузка карты...</span>
                        </div>
                      }
                    >
                      <LazyMap />
                    </Suspense>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
