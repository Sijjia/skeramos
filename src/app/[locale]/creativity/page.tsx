'use client';

import { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useZone } from '@/contexts/ZoneContext';
import {
  Palette, GraduationCap, Home, Gift, Clock, Users,
  Sparkles, Heart, Camera, Package, Award, Smile, Coffee
} from 'lucide-react';

import { Footer } from '@/components/layout/Footer';
import { OnboardingHint, StickyCTA, FAQAccordion } from '@/components/features';
import { ContactModal } from '@/components/features/ContactModal';
import { FloatingOrbs, EtnoPatternOverlay, SectionDivider, GlowingAccent, ScrollFrameAnimation } from '@/components/animations';
import { FadeInOnScroll, CountUp } from '@/components/animations/OptimizedAnimations';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/animations/ScrollAnimations';
import { SThreadAnimation, SThreadDivider } from '@/components/animations/SThreadAnimation';
import { ReviewsSlider } from '@/components/sections/ReviewsSlider';
import { useMasterclasses, useCourses, useEvents, useFAQ, useMasters, useGallery, useSettings } from '@/hooks/useSanityData';
import { LucideIcon, Star } from 'lucide-react';

// Icon mapping for dynamic content from settings
const ICON_MAP: Record<string, LucideIcon> = {
  palette: Palette,
  graduation: GraduationCap,
  home: Home,
  gift: Gift,
  clock: Clock,
  users: Users,
  sparkles: Sparkles,
  heart: Heart,
  camera: Camera,
  package: Package,
  award: Award,
  smile: Smile,
  coffee: Coffee,
  star: Star,
};

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

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: smoothEase }
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
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
  const message = encodeURIComponent(`Здравствуйте! Хочу записаться на "${serviceName}"`);
  return `https://wa.me/${phone}?text=${message}`;
}

// Fallback data for gallery when API is empty
const GALLERY_FALLBACK = [
  { id: '1', image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80', title: 'Ваза с орнаментом' },
  { id: '2', image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=600&q=80', title: 'Набор посуды' },
  { id: '3', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&q=80', title: 'Декоративная тарелка' },
  { id: '4', image: 'https://images.unsplash.com/photo-1605622371817-cc28e4a7dfc1?w=600&q=80', title: 'Кувшин' },
  { id: '5', image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=400&q=80', title: 'Пиала' },
  { id: '6', image: 'https://images.unsplash.com/photo-1609686764508-e8e5d3a9c77a?w=600&q=80', title: 'Скульптура' },
];

// Fallback data for masters when API is empty
const MASTERS_FALLBACK = [
  {
    id: '1',
    name: 'Айгуль Сатарова',
    role: 'Основатель, мастер керамики',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80',
    experience: '15 лет опыта',
    bio: '',
    specialties: ['Традиционная кыргызская керамика'],
    achievements: [],
  },
  {
    id: '2',
    name: 'Бакыт Токтогулов',
    role: 'Мастер гончарного круга',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    experience: '10 лет опыта',
    bio: '',
    specialties: ['Современные техники'],
    achievements: [],
  },
  {
    id: '3',
    name: 'Нургуль Асанова',
    role: 'Художник по росписи',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    experience: '8 лет опыта',
    bio: '',
    specialties: ['Авторская роспись'],
    achievements: [],
  },
];


// Advantages data with Lucide icons
const ADVANTAGES = [
  {
    Icon: Palette,
    title: 'Уникальный опыт',
    description: 'Создайте что-то своими руками и заберите на память',
  },
  {
    Icon: GraduationCap,
    title: 'Опытные мастера',
    description: 'Наши преподаватели — профессионалы с многолетним опытом',
  },
  {
    Icon: Home,
    title: 'Уютная атмосфера',
    description: 'Творческое пространство, где хочется создавать',
  },
  {
    Icon: Gift,
    title: 'Всё включено',
    description: 'Материалы, обжиг и упаковка входят в стоимость',
  },
  {
    Icon: Clock,
    title: 'Гибкий график',
    description: 'Занятия в удобное для вас время, включая выходные',
  },
  {
    Icon: Users,
    title: 'Для всех возрастов',
    description: 'Программы для детей, взрослых и семейных групп',
  },
];

// What you get data
const WHAT_YOU_GET = [
  { Icon: Sparkles, title: 'Все материалы включены', description: 'Глина, глазурь, инструменты' },
  { Icon: GraduationCap, title: 'Работа с мастером', description: 'Индивидуальное сопровождение' },
  { Icon: Camera, title: 'Фотосессия', description: 'Фото процесса и результата' },
  { Icon: Package, title: 'Упаковка изделия', description: 'Красивая подарочная упаковка' },
  { Icon: Award, title: 'Сертификат', description: 'Именной сертификат участника' },
  { Icon: Coffee, title: 'Чай и угощения', description: 'Напитки и сладости во время МК' },
  { Icon: Heart, title: 'Тёплая атмосфера', description: 'Музыка и уютная обстановка' },
  { Icon: Smile, title: 'Положительные эмоции', description: 'Гарантия хорошего настроения' },
];

export default function CreativityPage() {
  const { setZone } = useZone();
  const t = useTranslations('creativity');
  const tCommon = useTranslations('common');
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const { data: masterclasses } = useMasterclasses();
  const { data: courses } = useCourses();
  const { data: events } = useEvents();
  const { data: faqItems } = useFAQ('creativity');
  const { data: mastersData } = useMasters();
  const { data: galleryData } = useGallery();
  const { data: settings } = useSettings();

  // Use API data with fallback
  const masters = mastersData.length > 0
    ? mastersData.filter(m => m.active !== false)
    : MASTERS_FALLBACK;
  const galleryItems = galleryData.length > 0
    ? galleryData.slice(0, 4)
    : GALLERY_FALLBACK.slice(0, 4);

  // Use advantages from settings if available
  const advantages = settings.advantages && settings.advantages.length > 0
    ? settings.advantages.map(a => ({
        Icon: ICON_MAP[a.icon] || Star,
        title: a.title,
        description: a.description,
      }))
    : ADVANTAGES;

  // Use what you get from settings if available
  const whatYouGet = settings.whatYouGet && settings.whatYouGet.length > 0
    ? settings.whatYouGet.map(w => ({
        Icon: ICON_MAP[w.icon] || Star,
        title: w.title,
        description: w.description,
      }))
    : WHAT_YOU_GET;

  useEffect(() => {
    setZone('creativity');
  }, [setZone]);

  return (
    <>
      {/* Scroll-driven pottery animation - fixed background for entire page */}
      <ScrollFrameAnimation
        framePath="/frames/pottery"
        frameCount={168}
        filePrefix="ezgif-frame-"
        extension="jpg"
        opacity={0.1}
        scrollRange={[0, 1]}
        className="z-0"
      />

      <StickyCTA />
      <FloatingOrbs zone="creativity" count={2} />
      <EtnoPatternOverlay pattern="mixed" opacity={0.02} />

      <main className="min-h-screen bg-background etno-section">
        {/* Hero Section */}
        <motion.section
          style={{ opacity: heroOpacity }}
          className="relative min-h-screen flex items-center justify-center gradient-mesh noise-overlay"
        >
          {/* Background decorations - CSS only for performance */}
          <GlowingAccent position="top-left" zone="creativity" size={500} />
          <GlowingAccent position="bottom-right" zone="creativity" size={400} />

          {/* S-Thread Animation - signature Skeramos element */}
          <SThreadAnimation position="left" scale={1.2} opacity={0.12} />
          <SThreadAnimation position="right" scale={1} opacity={0.08} />

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
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
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
                  Гончарная мастерская в Бишкеке
                </motion.span>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-6xl lg:text-7xl font-display font-medium text-white mb-6 text-balance"
              >
                Лепим{' '}
                <span className="bg-gradient-text">счастье</span>
                <br />
                своими руками
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto"
              >
                Мастер-классы по керамике для всех уровней.
                <br />
                Погрузитесь в мир гончарного искусства и создайте уникальные изделия под руководством опытных мастеров.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
                <a
                  href="#masterclasses"
                  className="group relative px-8 py-4 bg-zone-500 text-white rounded-2xl font-medium transition-all duration-300 hover:bg-zone-400 hover:scale-105 hover:shadow-xl hover:shadow-zone-500/30"
                >
                  <span className="relative z-10">Выбрать мастер-класс</span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-zone-400 to-zone-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
                <a
                  href="#about"
                  className="px-8 py-4 glass text-white rounded-2xl font-medium transition-all duration-300 hover:bg-white/15 hover:scale-105 hover:border-white/30"
                >
                  Узнать больше
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={fadeInUp}
                className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
              >
                {[
                  { value: 2, suffix: '', label: 'года опыта' },
                  { value: 1000, suffix: '+', label: 'учеников' },
                  { value: 500, suffix: '+', label: 'мастер-классов' },
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

        {/* About Section */}
        <section id="about" className="py-24 md:py-32 relative etno-texture light-section">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80"
                    alt="Мастерская Skeramos"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>

                {/* Floating card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="absolute -bottom-6 -right-6 glass-card p-6 max-w-xs"
                >
                  <div className="text-4xl font-display font-bold text-zone-400 mb-2">С 2024</div>
                  <p className="card-muted text-sm">
                    Создаём пространство для творчества и вдохновения
                  </p>
                </motion.div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-zone-400 text-sm font-medium tracking-wider uppercase">
                  {tCommon('aboutUs')}
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-medium text-neutral-800 mt-4 mb-6">
                  {t('whereCeramicsBorn')}
                </h2>
                <div className="space-y-4 text-neutral-600">
                  <p>
                    <strong className="text-neutral-800">Skeramos</strong> — это не просто мастерская,
                    это пространство, где каждый может прикоснуться к древнему искусству керамики
                    и создать что-то уникальное своими руками.
                  </p>
                  <p>
                    Мы начинали с небольшой студии и мечты — дать людям возможность отключиться
                    от повседневной суеты и погрузиться в медитативный процесс работы с глиной.
                  </p>
                  <p>
                    Сегодня мы — одна из ведущих гончарных мастерских Бишкека, где прошли обучение
                    более 1000 человек.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-zone-500/20 flex items-center justify-center">
                      <span className="text-xl">🎯</span>
                    </div>
                    <div>
                      <div className="text-neutral-800 font-medium">Индивидуальный подход</div>
                      <div className="text-sm text-neutral-500">К каждому гостю</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-zone-500/20 flex items-center justify-center">
                      <span className="text-xl">✨</span>
                    </div>
                    <div>
                      <div className="text-neutral-800 font-medium">Качественные материалы</div>
                      <div className="text-sm text-neutral-500">Профессиональная глина</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Этно-разделитель */}
        <div className="etno-divider" />

        {/* Advantages Section */}
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
                {tCommon('ourAdvantages')}
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {advantages.map((adv) => (
                <motion.div
                  key={adv.title}
                  variants={cardVariants}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  className="glass-card p-8 text-center group cursor-pointer"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <motion.div
                    className="mb-4 flex justify-center"
                    whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    <adv.Icon className="w-12 h-12 text-zone-500" strokeWidth={1.5} />
                  </motion.div>
                  <h3 className="text-xl font-display font-medium card-title mb-2">
                    {adv.title}
                  </h3>
                  <p className="card-muted text-sm">
                    {adv.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* What You Get Section */}
        <section className="py-24 md:py-32 light-section">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.span variants={scaleIn} className="text-zone-400 text-sm font-medium tracking-wider uppercase inline-block">
                {t('included')}
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-medium text-neutral-800 mt-4">
                {tCommon('whatYouGet')}
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {whatYouGet.map((item) => (
                <motion.div
                  key={item.title}
                  variants={cardVariants}
                  className="glass-card p-6 text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-zone-500/10 flex items-center justify-center mx-auto mb-4">
                    <item.Icon className="w-7 h-7 text-zone-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-semibold card-title mb-1">{item.title}</h3>
                  <p className="text-sm card-muted">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Masters Section */}
        <section id="masters" className="py-24 md:py-32 light-section">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.span variants={scaleIn} className="text-zone-400 text-sm font-medium tracking-wider uppercase inline-block">
                {t('team')}
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-medium text-neutral-800 mt-4">
                {t('ourMasters')}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-neutral-500 mt-4 max-w-2xl mx-auto">
                {t('mastersSubtitle')}
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8"
            >
              {masters.slice(0, 3).map((master) => (
                <Link key={master.id} href={`/masters/${master.id}`}>
                  <motion.div
                    variants={cardVariants}
                    whileHover={{ y: -8 }}
                    className="group cursor-pointer"
                  >
                    <motion.div
                      className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-6"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Image
                        src={master.image}
                        alt={master.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                      {/* Hover overlay */}
                      <motion.div
                        className="absolute inset-0 bg-zone-500/20"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />

                      {/* Info on hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="glass-card p-4">
                          <p className="text-sm card-muted">{master.specialties?.[0] || ''}</p>
                        </div>
                      </div>
                    </motion.div>

                    <h3 className="text-xl font-display font-medium text-neutral-800">
                      {master.name}
                    </h3>
                    <p className="text-neutral-500">{master.role}</p>
                    <p className="text-zone-500 text-sm mt-1">{master.experience}</p>
                  </motion.div>
                </Link>
              ))}
            </motion.div>

            {/* Link to all masters */}
            {masters.length > 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <a
                  href="/masters"
                  className="inline-flex items-center gap-2 px-6 py-3 glass text-neutral-700 hover:text-zone-500 rounded-xl font-medium transition-colors"
                >
                  {t('allMasters')}
                  <span>→</span>
                </a>
              </motion.div>
            )}
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-24 bg-zone-500/10 etno-tunduk">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.span variants={scaleIn} className="text-zone-400 text-sm font-medium tracking-wider uppercase inline-block">
                {t('portfolio')}
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-medium text-neutral-800 mt-4">
                {tCommon('galleryOfWorks')}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-neutral-500 mt-4 max-w-2xl mx-auto">
                {t('gallerySubtitle')}
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {galleryItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.03, zIndex: 10 }}
                  className={`relative rounded-2xl overflow-hidden group cursor-pointer ${
                    index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                >
                  <div className="aspect-square">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent flex items-end p-6"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.h4
                      className="text-white font-display text-lg"
                      initial={{ y: 20 }}
                      whileHover={{ y: 0 }}
                    >
                      {item.title}
                    </motion.h4>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {/* Link to full gallery */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <a
                href="/gallery"
                className="inline-flex items-center gap-2 px-6 py-3 glass text-neutral-700 hover:text-zone-500 rounded-xl font-medium transition-colors"
              >
                {tCommon('viewFullGallery')}
                <span>→</span>
              </a>
            </motion.div>
          </div>
        </section>

        {/* Masterclasses Section */}
        <section id="masterclasses" className="py-24 md:py-32 light-section">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.span variants={scaleIn} className="text-zone-400 text-sm font-medium tracking-wider uppercase inline-block">
                Услуги
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-medium text-neutral-800 mt-4">
                {t('masterclasses')}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-neutral-500 mt-4 max-w-2xl mx-auto">
                {t('masterclassesSubtitle')}
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {masterclasses.map((mc) => (
                <motion.div
                  key={mc.id}
                  variants={cardVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass-card overflow-hidden group cursor-pointer"
                >
                  <motion.div
                    className="relative aspect-[4/3] overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Image
                      src={mc.image}
                      alt={mc.title}
                      fill
                      className="object-cover"
                    />
                    <motion.div
                      className="absolute top-4 right-4 px-3 py-1 rounded-full bg-zone-500/90 text-on-color text-sm font-medium"
                      whileHover={{ scale: 1.1 }}
                    >
                      {mc.price.toLocaleString()} сом
                    </motion.div>
                  </motion.div>

                  <div className="p-6">
                    <h3 className="text-lg font-display font-medium card-title mb-2 line-clamp-1">
                      {mc.title}
                    </h3>
                    <p className="card-muted text-sm mb-4 line-clamp-2">
                      {mc.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                      <span>⏱ {mc.duration}</span>
                      <span>👥 {mc.capacity}</span>
                    </div>

                    <motion.a
                      href={getWhatsAppLink(mc.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-zone-500 text-on-color text-center rounded-xl font-medium"
                      whileHover={{ scale: 1.02, backgroundColor: 'var(--zone-400)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {tCommon('signUp')}
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Link to all services */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <a
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 glass text-neutral-700 hover:text-zone-500 rounded-xl font-medium transition-colors"
              >
                {t('allServices')}
                <span>→</span>
              </a>
            </motion.div>
          </div>
        </section>

        {/* Этно-разделитель */}
        <div className="etno-divider" />

        {/* Reviews Section */}
        <section id="reviews" className="py-24 bg-zone-500/10 etno-kochkor">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.span variants={scaleIn} className="text-zone-400 text-sm font-medium tracking-wider uppercase inline-block">
                {tCommon('reviews')}
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-medium text-neutral-800 mt-4">
                {t('kindWords')}
              </motion.h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
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
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.span variants={scaleIn} className="text-zone-400 text-sm font-medium tracking-wider uppercase inline-block">
                FAQ
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-medium text-neutral-800 mt-4">
                {t('faq')}
              </motion.h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="max-w-3xl mx-auto"
            >
              <FAQAccordion items={faqItems} allowMultiple />

              {/* Contact button after FAQ */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <ContactModal
                  phone={settings.phone?.replace(/\D/g, '') || '996555123456'}
                  whatsappMessage="Здравствуйте! У меня есть вопрос по мастер-классам."
                  telegramUsername={settings.social?.telegram || 'skeramos'}
                  buttonText={t('haveQuestions')}
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* History Section */}
        <section className="py-24 bg-zone-500/10 etno-shyrdak">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="text-zone-400 text-sm font-medium tracking-wider uppercase">
                {t('since2024')}
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-medium text-neutral-800 mt-4 mb-6">
                {tCommon('ourHistory')}
              </h2>
              <p className="text-neutral-600 mb-8">
                От одного гончарного круга до творческого дома — узнайте, как мы росли
                и развивались вместе с нашими учениками.
              </p>
              <a
                href="/history"
                className="inline-flex items-center gap-2 px-8 py-4 glass hover:bg-neutral-100 text-neutral-700 rounded-2xl font-medium transition-all"
              >
                {t('learnHistory')}
                <span>→</span>
              </a>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 gradient-radial" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.h2
                className="text-3xl md:text-5xl font-display font-medium text-white mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {t('readyToCreate')}
              </motion.h2>
              <motion.p
                className="text-neutral-300 mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                {t('signUpAndDiscover')}
              </motion.p>
              <motion.a
                href={getWhatsAppLink('Мастер-класс')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-zone-500 text-white rounded-2xl font-medium"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05, backgroundColor: 'var(--zone-400)' }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{t('signUpWhatsApp')}</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </motion.a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
