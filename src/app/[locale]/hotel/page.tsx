'use client';

import { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useZone } from '@/contexts/ZoneContext';
import { Bed, Palette, Car, Wifi, Shield } from 'lucide-react';

import { Footer } from '@/components/layout/Footer';
import { OnboardingHint, StickyCTA, FAQAccordion, PackageCard } from '@/components/features';
import { FloatingOrbs, EtnoPatternOverlay, GlowingAccent } from '@/components/animations/EtnoDecorations';
import { CountUp } from '@/components/animations/OptimizedAnimations';
import { SThreadAnimation, SThreadDivider } from '@/components/animations/SThreadAnimation';
import { ReviewsSlider } from '@/components/sections/ReviewsSlider';
import { usePackages, useFAQ, useSettings } from '@/hooks/useSanityData';

// Custom easing curve for smooth animations
const smoothEase = [0.25, 0.1, 0.25, 1] as const;

// Animation variants - более выразительные
const fadeInUp = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: smoothEase }
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: smoothEase }
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, rotateX: 10 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.6, ease: smoothEase }
  },
};

// Helper function to generate WhatsApp link
function getWhatsAppLink(serviceName: string): string {
  const phone = '996555123456';
  const message = encodeURIComponent(`Здравствуйте! Хочу забронировать "${serviceName}"`);
  return `https://wa.me/${phone}?text=${message}`;
}

// Icon mapping for hotel features
const ICON_MAP: Record<string, typeof Bed> = {
  bed: Bed,
  palette: Palette,
  car: Car,
  wifi: Wifi,
  shield: Shield,
};

// Default hotel features (fallback)
const DEFAULT_HOTEL_FEATURES = [
  {
    icon: 'bed',
    title: 'Уютные номера',
    description: 'Комфортные номера с современным ремонтом и всем необходимым',
  },
  {
    icon: 'palette',
    title: 'Мастер-классы рядом',
    description: 'Совместите отдых с творчеством — мастерская в том же здании',
  },
  {
    icon: 'car',
    title: 'Бесплатная парковка',
    description: 'Охраняемая парковка для гостей отеля',
  },
  {
    icon: 'wifi',
    title: 'Бесплатный Wi-Fi',
    description: 'Высокоскоростной интернет во всех номерах и общих зонах',
  },
  {
    icon: 'shield',
    title: 'Безопасность',
    description: 'Видеонаблюдение, сейфы в номерах и круглосуточная охрана',
  },
];


// Fallback packages when API is empty
const PACKAGES_FALLBACK = [
  {
    id: '1',
    title: 'Романтический уикенд',
    description: 'Идеальный отдых для двоих с ужином и мастер-классом',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
    includes: ['Проживание 2 ночи', 'Завтрак в номер', 'Мастер-класс для двоих', 'Ужин при свечах'],
    price: 15000,
    featured: true,
  },
  {
    id: '2',
    title: 'Творческий отпуск',
    description: 'Погрузитесь в мир керамики с полным курсом обучения',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80',
    includes: ['Проживание 3 ночи', 'Завтраки', '3 мастер-класса', 'Сертификат'],
    price: 20000,
    featured: false,
  },
  {
    id: '3',
    title: 'Семейный пакет',
    description: 'Отдых для всей семьи с детскими мастер-классами',
    image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=800&q=80',
    includes: ['Проживание 2 ночи', 'Завтраки', 'Детский МК', 'Кинозал 2 часа'],
    price: 18000,
    featured: false,
  },
];

export default function HotelPage() {
  const { setZone } = useZone();
  const locale = useLocale();
  const t = useTranslations('hotel');
  const tCommon = useTranslations('common');
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const { data: packagesData } = usePackages();
  const { data: faqItems } = useFAQ('hotel');
  const { data: settings } = useSettings();

  // Use API data with fallback
  const allPackages = packagesData.length > 0 ? packagesData : PACKAGES_FALLBACK;
  // Show only featured packages on homepage (max 3)
  const featuredPackages = allPackages.filter(pkg => pkg.featured).slice(0, 3);
  // If no featured packages, show first 3
  const packages = featuredPackages.length > 0 ? featuredPackages : allPackages.slice(0, 3);
  const hotelFeatures = settings.hotelAdvantages && settings.hotelAdvantages.length > 0
    ? settings.hotelAdvantages
    : DEFAULT_HOTEL_FEATURES;

  useEffect(() => {
    setZone('hotel');
  }, [setZone]);

  return (
    <>
      
      
      <StickyCTA />
      <FloatingOrbs zone="hotel" count={2} />
      <EtnoPatternOverlay pattern="tunduk" opacity={0.02} />

      <main className="min-h-screen bg-background etno-section">
        {/* Hero Section */}
        <motion.section
          style={{ opacity: heroOpacity }}
          className="relative min-h-screen flex items-center justify-center gradient-mesh noise-overlay"
        >
          {/* Decorative elements - optimized */}
          <GlowingAccent position="top-left" zone="hotel" size={500} />
          <GlowingAccent position="bottom-right" zone="hotel" size={600} />

          {/* S-Thread Animation - signature Skeramos element */}
          <SThreadAnimation position="right" scale={1.2} opacity={0.1} />
          <SThreadAnimation position="left" scale={0.8} opacity={0.06} />

          <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-4xl mx-auto text-center"
            >
              {/* Logo */}
              <motion.div
                variants={fadeInUp}
                className="mb-8 flex justify-center"
              >
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  className="relative w-24 h-24 md:w-32 md:h-32"
                >
                  <Image
                    src="/logo.png"
                    alt="Skeramos"
                    fill
                    className="object-contain brightness-0 invert"
                  />
                </motion.div>
              </motion.div>

              {/* Badge */}
              <motion.div variants={fadeInUp} className="mb-6">
                <motion.span
                  className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-zone-300 font-medium cursor-default"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  transition={{ duration: 0.2 }}
                >
                  {t('badge')}
                </motion.span>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-6xl lg:text-7xl font-display font-medium text-white mb-6 text-balance"
              >
                {t('heroTitle1')}{' '}
                <span className="bg-gradient-text">{t('heroTitle2')}</span>
                <br />
                {t('heroTitle3')}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto"
              >
                {t('heroDescription')}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
                <a
                  href="#packages"
                  className="group relative px-8 py-4 bg-zone-500 text-white rounded-2xl font-medium transition-all duration-300 hover:bg-zone-400 hover:scale-105 hover:shadow-xl hover:shadow-zone-500/30"
                >
                  <span className="relative z-10">{t('specialPackages')}</span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-zone-400 to-zone-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
                <a
                  href={getWhatsAppLink('Бронирование отеля')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 glass text-white rounded-2xl font-medium transition-all duration-300 hover:bg-white/15 hover:scale-105 hover:border-white/30"
                >
                  {t('bookBtn')}
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={fadeInUp}
                className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
              >
                {[
                  { value: 24, suffix: '/7', label: t('statsCheckin') },
                  { value: 500, suffix: '+', label: t('statsGuests') },
                  { value: 5, suffix: '★', label: t('statsRating') },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl md:text-4xl font-display font-bold text-zone-400">
                      <CountUp end={stat.value} suffix={stat.suffix} duration={2} />
                    </div>
                    <div className="text-sm text-neutral-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
            >
              <motion.div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
            </motion.div>
          </motion.div>
        </motion.section>

        {/* S-Thread разделитель */}
        <SThreadDivider />

        {/* Features Section */}
        <section className="py-24 bg-zone-500/10 etno-shyrdak">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.span variants={scaleIn} className="text-zone-400 text-sm font-medium tracking-wider uppercase inline-block">
                {t('whyUs')}
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-medium text-neutral-800 mt-4">
                {t('hotelAdvantages')}
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {hotelFeatures.map((feature) => {
                const IconComponent = ICON_MAP[feature.icon] || Bed;
                return (
                  <motion.div
                    key={feature.title}
                    variants={cardVariants}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="glass-card p-8 text-center group cursor-pointer"
                  >
                    <motion.div
                      className="mb-4 flex justify-center"
                      whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.4 }}
                    >
                      <IconComponent className="w-12 h-12 text-zone-500" strokeWidth={1.5} />
                    </motion.div>
                    <h3 className="text-xl font-display font-medium card-title mb-2">
                      {feature.title}
                    </h3>
                    <p className="card-muted text-sm">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Packages Section */}
        <section id="packages" className="py-24 md:py-32 light-section">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.span variants={fadeInUp} className="text-zone-400 text-sm font-medium tracking-wider uppercase">
                {t('profitably')}
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-medium text-neutral-800 mt-4">
                {t('packages')}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-neutral-500 mt-4 max-w-2xl mx-auto">
                {t('packagesSubtitle')}
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              {packages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  variants={fadeInUp}
                  className={`glass-card overflow-hidden hover-lift relative ${
                    pkg.featured ? 'ring-2 ring-zone-400' : ''
                  }`}
                >
                  {pkg.featured && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-zone-400 text-on-color text-xs font-medium z-10">
                      {t('popular')}
                    </div>
                  )}

                  <div className="relative aspect-[16/10]">
                    <Image
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-display font-medium card-title mb-2">
                      {pkg.title}
                    </h3>
                    <p className="card-muted text-sm mb-4">
                      {pkg.description}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {pkg.includes.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-neutral-600">
                          <span className="text-zone-500">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-display font-bold text-zone-500">
                        {pkg.price.toLocaleString()} сом
                      </div>
                      <a
                        href={getWhatsAppLink(pkg.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-zone-500 hover:bg-zone-600 text-on-color rounded-xl text-sm font-medium transition-colors"
                      >
                        {tCommon('bookNow')}
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Link to all packages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                href={`/${locale}/hotel/packages`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-zone-500/10 hover:bg-zone-500/20 text-zone-600 rounded-2xl font-medium transition-all duration-300 hover:scale-105 border border-zone-500/20"
              >
                <span>{t('allPackages')}</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Этно-разделитель */}
        <div className="etno-divider" />

        {/* Reviews Section */}
        <section className="py-24 bg-zone-500/10 etno-kochkor">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.span variants={fadeInUp} className="text-zone-400 text-sm font-medium tracking-wider uppercase">
                {tCommon('reviews')}
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-medium text-neutral-800 mt-4">
                {t('kindWords')}
              </motion.h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <ReviewsSlider autoPlay interval={6000} />
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 md:py-32 light-section">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.span variants={fadeInUp} className="text-zone-400 text-sm font-medium tracking-wider uppercase">
                FAQ
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-medium text-neutral-800 mt-4">
                {t('faq')}
              </motion.h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <FAQAccordion items={faqItems} allowMultiple />
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 gradient-radial" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-5xl font-display font-medium text-white mb-6">
                {t('readyToRest')}
              </h2>
              <p className="text-neutral-300 mb-8">
                {t('bookAndEnjoy')}
              </p>
              <a
                href={getWhatsAppLink('Номер в отеле')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-zone-500 hover:bg-zone-600 text-white rounded-2xl font-medium transition-all hover-lift hover-glow"
              >
                <span>{tCommon('bookInWhatsApp')}</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
