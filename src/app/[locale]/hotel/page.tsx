'use client';

import { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useZone } from '@/contexts/ZoneContext';
import { Bed, Palette, Car, Wifi, Shield } from 'lucide-react';

import { Footer } from '@/components/layout/Footer';
import { OnboardingHint, StickyCTA, FAQAccordion, RoomCard, PackageCard } from '@/components/features';
import { FloatingOrbs, EtnoPatternOverlay, GlowingAccent } from '@/components/animations/EtnoDecorations';
import { CountUp } from '@/components/animations/OptimizedAnimations';
import { SThreadAnimation, SThreadDivider } from '@/components/animations/SThreadAnimation';
import { ReviewsSlider } from '@/components/sections/ReviewsSlider';
import { useRooms, usePackages, useFAQ } from '@/hooks/useSanityData';

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

// Hotel features with Lucide icons
const HOTEL_FEATURES = [
  {
    Icon: Bed,
    title: 'Уютные номера',
    description: 'Комфортные номера с современным ремонтом и всем необходимым',
  },
  {
    Icon: Palette,
    title: 'Мастер-классы рядом',
    description: 'Совместите отдых с творчеством — мастерская в том же здании',
  },
  {
    Icon: Car,
    title: 'Бесплатная парковка',
    description: 'Охраняемая парковка для гостей отеля',
  },
  {
    Icon: Wifi,
    title: 'Бесплатный Wi-Fi',
    description: 'Высокоскоростной интернет во всех номерах и общих зонах',
  },
  {
    Icon: Shield,
    title: 'Безопасность',
    description: 'Видеонаблюдение, сейфы в номерах и круглосуточная охрана',
  },
];

// Amenities
const AMENITIES = [
  { icon: '📶', label: 'Бесплатный Wi-Fi' },
  { icon: '❄️', label: 'Кондиционер' },
  { icon: '📺', label: 'Smart TV' },
  { icon: '🚿', label: 'Душ / Ванна' },
  { icon: '☕', label: 'Чай и кофе' },
  { icon: '🧴', label: 'Косметика' },
];


export default function HotelPage() {
  const { setZone } = useZone();
  const t = useTranslations('hotel');
  const tCommon = useTranslations('common');
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const { data: rooms } = useRooms();
  const { data: packages } = usePackages();
  const { data: faqItems } = useFAQ('hotel');

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
          style={{ opacity: heroOpacity, scale: heroScale }}
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
                  Бутик-отель в сердце Кыргызстана
                </motion.span>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-6xl lg:text-7xl font-display font-medium text-white mb-6 text-balance"
              >
                Уют и{' '}
                <span className="bg-gradient-text">комфорт</span>
                <br />
                для вашего отдыха
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto"
              >
                Камерный отель с атмосферой домашнего уюта. Идеальное место для романтического
                уикенда, творческого отпуска или просто тихого отдыха.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
                <a
                  href="#rooms"
                  className="group relative px-8 py-4 bg-zone-500 text-white rounded-2xl font-medium transition-all duration-300 hover:bg-zone-400 hover:scale-105 hover:shadow-xl hover:shadow-zone-500/30"
                >
                  <span className="relative z-10">Смотреть номера</span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-zone-400 to-zone-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
                <a
                  href="#packages"
                  className="px-8 py-4 glass text-white rounded-2xl font-medium transition-all duration-300 hover:bg-white/15 hover:scale-105 hover:border-white/30"
                >
                  Специальные пакеты
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={fadeInUp}
                className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
              >
                {[
                  { value: 3, suffix: '', label: 'уютных номера' },
                  { value: 24, suffix: '/7', label: 'заселение' },
                  { value: 500, suffix: '+', label: 'довольных гостей' },
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
        <section className="py-24 bg-zone-950/50 etno-shyrdak">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.span variants={scaleIn} className="text-zone-400 text-sm font-medium tracking-wider uppercase inline-block">
                Почему мы
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-medium text-white mt-4">
                Преимущества отеля
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {HOTEL_FEATURES.map((feature) => (
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
                    <feature.Icon className="w-12 h-12 text-zone-500" strokeWidth={1.5} />
                  </motion.div>
                  <h3 className="text-xl font-display font-medium text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-400 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Rooms Section */}
        <section id="rooms" className="py-24 md:py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.span variants={scaleIn} className="text-zone-400 text-sm font-medium tracking-wider uppercase inline-block">
                Размещение
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-medium text-white mt-4">
                {t('rooms')}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-neutral-400 mt-4 max-w-2xl mx-auto">
                {t('roomsSubtitle')}
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            >
              {rooms.map((room) => (
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  key={room.id}
                  variants={fadeInUp}
                  className="glass-card overflow-hidden group hover-lift"
                >
                  {/* Image Gallery */}
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={room.images[0] || 'https://placehold.co/800x600/330a16/f4a7ba?text=Номер'}
                      alt={room.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-zone-500/90 text-white text-sm font-medium">
                      {room.price.toLocaleString()} сом/ночь
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-display font-medium text-white mb-2">
                      {room.title}
                    </h3>
                    <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                      {room.description}
                    </p>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {room.amenities.slice(0, 4).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-zone-900/50 text-zone-300 text-xs"
                        >
                          {amenity.label}
                        </span>
                      ))}
                    </div>

                    <a
                      href={getWhatsAppLink(room.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-zone-500 hover:bg-zone-600 text-white text-center rounded-xl font-medium transition-colors"
                    >
                      {tCommon('bookNow')}
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* All amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 max-w-3xl mx-auto"
            >
              <h3 className="text-center text-lg font-display text-white mb-6">
                Во всех номерах
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {AMENITIES.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 px-4 py-2 glass rounded-full"
                  >
                    <span>{item.icon}</span>
                    <span className="text-sm text-neutral-300">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Packages Section */}
        <section id="packages" className="py-24 md:py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.span variants={fadeInUp} className="text-zone-400 text-sm font-medium tracking-wider uppercase">
                Выгодно
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-medium text-white mt-4">
                {t('packages')}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-neutral-400 mt-4 max-w-2xl mx-auto">
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
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-zone-400 text-white text-xs font-medium z-10">
                      Популярный
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
                    <h3 className="text-xl font-display font-medium text-white mb-2">
                      {pkg.title}
                    </h3>
                    <p className="text-neutral-400 text-sm mb-4">
                      {pkg.description}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {pkg.includes.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-neutral-300">
                          <span className="text-zone-400">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-display font-bold text-zone-400">
                        {pkg.price.toLocaleString()} сом
                      </div>
                      <a
                        href={getWhatsAppLink(pkg.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-zone-500 hover:bg-zone-600 text-white rounded-xl text-sm font-medium transition-colors"
                      >
                        {tCommon('bookNow')}
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Этно-разделитель */}
        <div className="etno-divider" />

        {/* Reviews Section */}
        <section className="py-24 bg-zone-950/50 etno-kochkor">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.span variants={fadeInUp} className="text-zone-400 text-sm font-medium tracking-wider uppercase">
                Отзывы
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-medium text-white mt-4">
                Что говорят гости
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
        <section id="faq" className="py-24 md:py-32">
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
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-medium text-white mt-4">
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
                Готовы к отдыху?
              </h2>
              <p className="text-neutral-300 mb-8">
                Забронируйте номер и насладитесь уютом нашего отеля
              </p>
              <a
                href={getWhatsAppLink('Номер в отеле')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-zone-500 hover:bg-zone-600 text-white rounded-2xl font-medium transition-all hover-lift hover-glow"
              >
                <span>Забронировать в WhatsApp</span>
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
