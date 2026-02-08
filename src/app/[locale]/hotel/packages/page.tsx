'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useZone } from '@/contexts/ZoneContext';
import { usePackages, type PackageUI } from '@/hooks/useSanityData';

import { Footer } from '@/components/layout/Footer';
import { FadeInOnScroll } from '@/components/animations/OptimizedAnimations';
import { EtnoPatternOverlay, GlowingAccent, SectionDivider } from '@/components/animations/EtnoDecorations';

const ITEMS_PER_PAGE = 6;

function getWhatsAppLink(packageName: string): string {
  const phone = '996555123456';
  const message = encodeURIComponent(`Здравствуйте! Хочу забронировать пакет "${packageName}"`);
  return `https://wa.me/${phone}?text=${message}`;
}

export default function PackagesPage() {
  const { setZone } = useZone();
  const locale = useLocale();
  const { data: packages, loading } = usePackages();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  useEffect(() => {
    setZone('hotel');
  }, [setZone]);

  // Filter only active packages
  const activePackages = packages.filter(pkg => pkg.active !== false);

  const totalPages = Math.ceil(activePackages.length / ITEMS_PER_PAGE);
  const paginatedPackages = activePackages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const selectedPackageData = activePackages.find(p => p.id === selectedPackage);

  const getContactLink = (pkg: PackageUI, method: 'whatsapp' | 'telegram' | 'phone') => {
    const message = encodeURIComponent(`Здравствуйте! Хочу забронировать пакет "${pkg.title}"`);
    switch (method) {
      case 'whatsapp':
        return `https://wa.me/996555123456?text=${message}`;
      case 'telegram':
        return `https://t.me/skeramos?text=${message}`;
      case 'phone':
        return 'tel:+996555123456';
    }
  };

  return (
    <>
      <EtnoPatternOverlay pattern="tunduk" opacity={0.02} />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <GlowingAccent position="top-right" zone="hotel" size={500} />

          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-3xl mx-auto text-center">
              <Link
                href={`/${locale}/hotel`}
                className="inline-flex items-center gap-2 text-zone-400 hover:text-zone-300 transition-colors mb-6"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад к отелю
              </Link>
              <h1 className="text-4xl md:text-6xl font-display font-medium text-neutral-800 mb-6">
                Пакеты{' '}
                <span className="bg-gradient-to-r from-zone-400 to-gold-500 bg-clip-text text-transparent">
                  отдыха
                </span>
              </h1>
              <p className="text-lg text-neutral-500">
                Выберите готовое решение для идеального отдыха — от романтического уикенда
                до творческого отпуска с мастер-классами.
              </p>
            </FadeInOnScroll>
          </div>
        </section>

        <SectionDivider variant="wave" className="opacity-50" />

        {/* Packages List - Checkerboard Layout */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-8 h-8 border-2 border-zone-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-neutral-400">Загрузка...</p>
              </div>
            ) : activePackages.length > 0 ? (
              <>
                <div className="space-y-16">
                  {paginatedPackages.map((pkg, index) => (
                    <FadeInOnScroll
                      key={pkg.id}
                      direction={index % 2 === 0 ? 'left' : 'right'}
                      delay={0.1}
                    >
                      <article
                        className={`grid md:grid-cols-2 gap-8 items-center ${
                          index % 2 === 1 ? 'md:flex-row-reverse' : ''
                        }`}
                      >
                        {/* Image */}
                        <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden group">
                            <Image
                              src={pkg.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80'}
                              alt={pkg.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

                            {/* Price badge */}
                            <div className="absolute top-4 right-4 px-4 py-2 rounded-full glass">
                              <span className="text-neutral-700 font-medium">
                                {pkg.price.toLocaleString()} сом
                              </span>
                            </div>

                            {/* Featured badge */}
                            {pkg.featured && (
                              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-zone-500 text-white text-sm font-medium">
                                Популярный
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                          <span className="text-zone-400 text-sm font-medium tracking-wider uppercase">
                            Пакет отдыха
                          </span>
                          <h2 className="text-2xl md:text-3xl font-display font-medium text-neutral-800 mb-4 mt-2">
                            {pkg.title}
                          </h2>
                          <p className="text-neutral-600 mb-6">
                            {pkg.description}
                          </p>

                          {/* Includes */}
                          {pkg.includes && pkg.includes.length > 0 && (
                            <div className="mb-6">
                              <h4 className="text-sm font-medium text-neutral-700 mb-3">Что включено:</h4>
                              <ul className="space-y-2">
                                {pkg.includes.map((item, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-neutral-600">
                                    <span className="text-zone-500">✓</span>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => setSelectedPackage(pkg.id)}
                              className="px-6 py-3 bg-zone-500 hover:bg-zone-600 text-white rounded-xl font-medium transition-all"
                            >
                              Забронировать
                            </button>
                          </div>
                        </div>
                      </article>
                    </FadeInOnScroll>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-16">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 glass rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                    >
                      ←
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          page === currentPage
                            ? 'bg-zone-500 text-on-color'
                            : 'glass hover:bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 glass rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <span className="text-6xl mb-4 block">📦</span>
                <h3 className="text-xl text-neutral-800 mb-2">Пакеты скоро появятся</h3>
                <p className="text-neutral-500 mb-6">Мы готовим для вас специальные предложения</p>
                <a
                  href="https://wa.me/996555123456?text=Здравствуйте! Хочу узнать о пакетах отдыха"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium transition-all"
                >
                  Связаться в WhatsApp
                </a>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-zone-500/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-display font-medium text-neutral-800 mb-4">
              Не нашли подходящий пакет?
            </h2>
            <p className="text-neutral-600 mb-6 max-w-xl mx-auto">
              Мы можем составить индивидуальное предложение специально для вас
            </p>
            <a
              href="https://wa.me/996555123456?text=Здравствуйте! Хочу обсудить индивидуальный пакет отдыха"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zone-500 hover:bg-zone-600 text-white rounded-xl font-medium transition-all"
            >
              Обсудить в WhatsApp
            </a>
          </div>
        </section>

        {/* Contact Modal */}
        <AnimatePresence>
          {selectedPackage && selectedPackageData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm"
              onClick={() => setSelectedPackage(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-md w-full glass-card p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 transition-colors"
                >
                  ✕
                </button>

                <h3 className="text-xl font-display font-medium card-title mb-2">
                  Забронировать
                </h3>
                <p className="text-zone-500 mb-6">{selectedPackageData.title}</p>

                <p className="card-text text-sm mb-6">
                  Выберите удобный способ связи:
                </p>

                <div className="space-y-3">
                  <a
                    href={getContactLink(selectedPackageData, 'whatsapp')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-neutral-800 font-medium">WhatsApp</div>
                      <div className="text-neutral-500 text-sm">Быстрый ответ</div>
                    </div>
                  </a>

                  <a
                    href={getContactLink(selectedPackageData, 'telegram')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
                  >
                    <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-neutral-800 font-medium">Telegram</div>
                      <div className="text-neutral-500 text-sm">Написать в чат</div>
                    </div>
                  </a>

                  <a
                    href={getContactLink(selectedPackageData, 'phone')}
                    className="flex items-center gap-4 p-4 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
                  >
                    <div className="w-10 h-10 bg-zone-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-neutral-800 font-medium">Позвонить</div>
                      <div className="text-neutral-500 text-sm">+996 555 123 456</div>
                    </div>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );
}
