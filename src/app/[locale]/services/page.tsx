'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useZone } from '@/contexts/ZoneContext';
import { useServices, useMasterclasses, type ServiceUI, type MasterclassUI } from '@/hooks/useSanityData';

import { Footer } from '@/components/layout/Footer';
import { FadeInOnScroll } from '@/components/animations/OptimizedAnimations';
import { EtnoPatternOverlay, GlowingAccent, SectionDivider } from '@/components/animations/EtnoDecorations';

const ITEMS_PER_PAGE = 8;

// Extended ServiceUI with tags
interface ServiceWithTags extends ServiceUI {
  tags?: string[];
}

// Convert masterclass to service format
function masterclassToService(mc: MasterclassUI): ServiceWithTags {
  return {
    id: `mc_${mc.id}`,
    slug: mc.slug || mc.id,
    title: mc.title,
    shortDescription: mc.description,
    fullDescription: mc.description,
    image: mc.image,
    price: mc.price,
    duration: mc.duration,
    groupSize: mc.capacity,
    includes: [],
    category: 'masterclass' as const,
    externalLink: mc.externalLink,
    tags: mc.tags,
  };
}

export default function ServicesPage() {
  const { setZone } = useZone();
  const locale = useLocale();
  const t = useTranslations('services');
  const tCommon = useTranslations('common');
  const { data: servicesData, loading: servicesLoading } = useServices();
  const { data: masterclassesData, loading: masterclassesLoading } = useMasterclasses();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    setZone('creativity');
  }, [setZone]);

  // Combine services and masterclasses
  const loading = servicesLoading || masterclassesLoading;
  const masterclassesAsServices = masterclassesData.map(masterclassToService);
  const services: ServiceWithTags[] = [...servicesData, ...masterclassesAsServices];

  const totalPages = Math.ceil(services.length / ITEMS_PER_PAGE);
  const paginatedServices = services.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const selectedServiceData = services.find(s => s.id === selectedService);

  const getContactLink = (service: ServiceUI, method: 'whatsapp' | 'telegram' | 'phone') => {
    const message = encodeURIComponent(`Здравствуйте! Хочу записаться на "${service.title}"`);
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

      <EtnoPatternOverlay pattern="mixed" opacity={0.02} />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <GlowingAccent position="top-right" zone="creativity" size={500} />

          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-2 rounded-full glass text-sm text-zone-300 font-medium mb-6">
                {t('title')}
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-medium text-neutral-800 mb-6">
                {t('all')}{' '}
                <span className="bg-gradient-to-r from-zone-400 to-gold-500 bg-clip-text text-transparent">
                  {t('allServices')}
                </span>
              </h1>
              <p className="text-lg text-neutral-500">
                {t('subtitle')}
              </p>
            </FadeInOnScroll>
          </div>
        </section>

        <SectionDivider variant="wave" className="opacity-50" />

        {/* Services List */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-8 h-8 border-2 border-zone-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-neutral-400">{t('loading')}</p>
              </div>
            ) : services.length > 0 ? (
              <>
                <div className="space-y-16">
                  {paginatedServices.map((service, index) => (
                    <FadeInOnScroll
                      key={service.id}
                      direction={index % 2 === 0 ? 'left' : 'right'}
                      delay={0.1}
                    >
                      <article
                        className={`grid md:grid-cols-2 gap-8 items-center ${
                          index % 2 === 1 ? 'md:flex-row-reverse' : ''
                        }`}
                      >
                        {/* Image - чередование лево/право */}
                        <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden group">
                            <Image
                              src={service.image}
                              alt={service.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

                            {/* Price badge */}
                            <div className="absolute top-4 right-4 px-4 py-2 rounded-full glass">
                              <span className="text-neutral-700 font-medium">
                                {service.priceNote && `${service.priceNote} `}
                                {service.price.toLocaleString()} {t('price')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-zone-400 text-sm font-medium tracking-wider uppercase">
                              {service.category === 'masterclass' && t('masterclass')}
                              {service.category === 'course' && t('course')}
                              {service.category === 'event' && t('event')}
                            </span>
                            {/* Tags */}
                            {service.tags && service.tags.length > 0 && (
                              <>
                                {service.tags.map((tag, tagIdx) => (
                                  <span
                                    key={tagIdx}
                                    className="px-2 py-0.5 bg-zone-500/20 text-zone-300 text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </>
                            )}
                          </div>
                          <h2 className="text-2xl md:text-3xl font-display font-medium text-neutral-800 mb-4">
                            {service.title}
                          </h2>
                          <p className="text-neutral-600 mb-6">
                            {service.shortDescription}
                          </p>

                          {/* Meta */}
                          <div className="flex flex-wrap gap-4 text-sm text-neutral-500 mb-6">
                            <span className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {service.duration}
                            </span>
                            <span className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              {service.groupSize}
                            </span>
                          </div>

                          {/* Includes */}
                          {service.includes && service.includes.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                              {service.includes.slice(0, 3).map((item) => (
                                <span
                                  key={item}
                                  className="px-3 py-1 rounded-full bg-zone-500/10 text-zone-600 text-sm"
                                >
                                  {item}
                                </span>
                              ))}
                              {service.includes.length > 3 && (
                                <span className="px-3 py-1 rounded-full bg-zone-500/10 text-zone-500 text-sm">
                                  +{service.includes.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => setSelectedService(service.id)}
                              className="px-6 py-3 bg-zone-500 hover:bg-zone-600 text-white rounded-xl font-medium transition-all"
                            >
                              {tCommon('signUp')}
                            </button>
                            {service.externalLink ? (
                              <a
                                href={service.externalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-neutral-100 text-neutral-700 rounded-xl font-medium transition-all"
                              >
                                {tCommon('learnMore')}
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            ) : (
                              <Link
                                href={`/${locale}/services/${service.slug}`}
                                className="px-6 py-3 glass hover:bg-neutral-100 text-neutral-700 rounded-xl font-medium transition-all"
                              >
                                {tCommon('learnMore')}
                              </Link>
                            )}
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

                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <span className="text-6xl mb-4 block">🎨</span>
                <h3 className="text-xl text-neutral-800 mb-2">{t('servicesSoon')}</h3>
                <p className="text-neutral-500 mb-6">{t('preparingServices')}</p>
                <a
                  href={`https://wa.me/996555123456?text=${encodeURIComponent('Здравствуйте! Хочу узнать о ваших услугах')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium transition-all"
                >
                  {t('contactWhatsApp')}
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Contact Modal */}
        <AnimatePresence>
          {selectedService && selectedServiceData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm"
              onClick={() => {
                setSelectedService(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-md w-full glass-card p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setSelectedService(null);
                  }}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 transition-colors"
                >
                  x
                </button>

                <h3 className="text-xl font-display font-medium card-title mb-2">
                  {t('signUpFor')}
                </h3>
                <p className="text-zone-500 mb-6">{selectedServiceData.title}</p>

                <p className="card-text text-sm mb-6">
                  {tCommon('chooseContactMethod')}
                </p>

                <div className="space-y-3">
                  <a
                    href={getContactLink(selectedServiceData, 'whatsapp')}
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
                      <div className="text-neutral-500 text-sm">{t('quickResponse')}</div>
                    </div>
                  </a>

                  <a
                    href={getContactLink(selectedServiceData, 'telegram')}
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
                      <div className="text-neutral-500 text-sm">{t('writeToChat')}</div>
                    </div>
                  </a>

                  <a
                    href={getContactLink(selectedServiceData, 'phone')}
                    className="flex items-center gap-4 p-4 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
                  >
                    <div className="w-10 h-10 bg-zone-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-neutral-800 font-medium">{tCommon('call')}</div>
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
