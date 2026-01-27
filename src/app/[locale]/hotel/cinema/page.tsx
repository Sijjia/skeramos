'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useZone } from '@/contexts/ZoneContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FadeInOnScroll } from '@/components/animations/OptimizedAnimations';
import { EtnoPatternOverlay, GlowingAccent, SectionDivider } from '@/components/animations/EtnoDecorations';

const CINEMA_IMAGES = [
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&q=80',
];

const CINEMA_FEATURES = [
  {
    icon: '🎬',
    title: 'Экран 120"',
    description: 'Профессиональный проектор Full HD для кинематографического качества',
  },
  {
    icon: '🔊',
    title: 'Dolby 5.1',
    description: 'Объёмный звук, который погружает в атмосферу фильма',
  },
  {
    icon: '🛋️',
    title: 'Комфортные диваны',
    description: 'Мягкие диваны и кресла с пледами для уютного просмотра',
  },
  {
    icon: '🍿',
    title: 'Своя еда',
    description: 'Можно принести свои закуски или заказать у нас',
  },
  {
    icon: '🎮',
    title: 'PlayStation 5',
    description: 'Игровая консоль с библиотекой популярных игр',
  },
  {
    icon: '🎤',
    title: 'Караоке',
    description: 'Система караоке с большой коллекцией песен',
  },
];

const PRICING = [
  { duration: '1 час', price: 3000, popular: false },
  { duration: '2 часа', price: 5000, popular: true },
  { duration: '3 часа', price: 7000, popular: false },
  { duration: 'Ночь (22:00-08:00)', price: 15000, popular: false },
];

const OCCASIONS = [
  { icon: '💑', label: 'Романтический вечер' },
  { icon: '🎂', label: 'День рождения' },
  { icon: '👨‍👩‍👧‍👦', label: 'Семейный отдых' },
  { icon: '👯', label: 'Девичник' },
  { icon: '🎮', label: 'Игровая вечеринка' },
  { icon: '🎬', label: 'Киномарафон' },
];

function getWhatsAppLink(duration: string): string {
  const phone = '996555123456';
  const message = encodeURIComponent(`Здравствуйте! Хочу забронировать кинозал на ${duration}`);
  return `https://wa.me/${phone}?text=${message}`;
}

export default function CinemaPage() {
  const { setZone } = useZone();
  const locale = useLocale();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    setZone('hotel');
  }, [setZone]);

  // Image slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % CINEMA_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Header />
      <EtnoPatternOverlay pattern="tunduk" opacity={0.02} />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <GlowingAccent position="center" zone="hotel" size={800} />

          {/* Background slideshow */}
          <div className="absolute inset-0 -z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <Image
                  src={CINEMA_IMAGES[currentImage]}
                  alt="Кинозал"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
          </div>

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
              <h1 className="text-4xl md:text-6xl font-display font-medium text-white mb-6">
                Приватный{' '}
                <span className="bg-gradient-to-r from-zone-300 to-gold-500 bg-clip-text text-transparent">
                  кинозал
                </span>
              </h1>
              <p className="text-lg text-neutral-300 mb-8">
                Уютное пространство для просмотра фильмов, игр и караоке.
                Идеально для романтических вечеров и праздников.
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-zone-400">6</div>
                  <div className="text-sm text-neutral-400">человек</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-zone-400">120"</div>
                  <div className="text-sm text-neutral-400">экран</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-zone-400">5.1</div>
                  <div className="text-sm text-neutral-400">звук</div>
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        <SectionDivider variant="wave" className="opacity-50" />

        {/* Gallery */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-4">
              {CINEMA_IMAGES.map((img, idx) => (
                <FadeInOnScroll key={idx} delay={idx * 0.1}>
                  <div className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer">
                    <Image
                      src={img}
                      alt={`Кинозал ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24 bg-zone-950/50 etno-tunduk">
          <div className="container mx-auto px-4">
            <FadeInOnScroll className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-4">
                Что вас ждёт
              </h2>
            </FadeInOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {CINEMA_FEATURES.map((feature, idx) => (
                <FadeInOnScroll key={idx} delay={idx * 0.1}>
                  <div className="glass-card p-6 text-center hover-lift">
                    <span className="text-4xl mb-4 block">{feature.icon}</span>
                    <h3 className="text-lg font-display font-medium text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-400 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Occasions */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <FadeInOnScroll className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-4">
                Идеально для
              </h2>
            </FadeInOnScroll>

            <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
              {OCCASIONS.map((occasion, idx) => (
                <FadeInOnScroll key={idx} delay={idx * 0.05}>
                  <div className="px-6 py-3 glass rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-default">
                    <span className="mr-2">{occasion.icon}</span>
                    {occasion.label}
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 md:py-24 bg-zone-950/50 etno-shyrdak">
          <div className="container mx-auto px-4">
            <FadeInOnScroll className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-4">
                Стоимость
              </h2>
              <p className="text-neutral-400">Выберите удобный формат</p>
            </FadeInOnScroll>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {PRICING.map((item, idx) => (
                <FadeInOnScroll key={idx} delay={idx * 0.1}>
                  <div className={`glass-card p-6 text-center relative ${
                    item.popular ? 'ring-2 ring-zone-400' : ''
                  }`}>
                    {item.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-zone-400 text-white text-xs font-medium">
                        Популярно
                      </div>
                    )}
                    <div className="text-neutral-400 mb-2">{item.duration}</div>
                    <div className="text-3xl font-display font-bold text-white mb-4">
                      {item.price.toLocaleString()}
                      <span className="text-lg text-neutral-500"> сом</span>
                    </div>
                    <a
                      href={getWhatsAppLink(item.duration)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full py-3 rounded-xl font-medium transition-colors ${
                        item.popular
                          ? 'bg-zone-500 hover:bg-zone-600 text-white'
                          : 'glass hover:bg-white/10 text-white'
                      }`}
                    >
                      Забронировать
                    </a>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Rules */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-display font-medium text-white mb-6 text-center">
                Правила посещения
              </h2>
              <div className="glass-card p-6 space-y-4">
                {[
                  'Максимум 6 человек в зале',
                  'Можно приносить свою еду и напитки',
                  'Курение и вейпинг запрещены',
                  'Бережно относитесь к оборудованию',
                  'Бронирование за сутки',
                  'Отмена бесплатно за 6 часов',
                ].map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-zone-400 mt-1">✓</span>
                    <span className="text-neutral-300">{rule}</span>
                  </div>
                ))}
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 etno-kochkor">
          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-6">
                Готовы к киновечеру?
              </h2>
              <p className="text-neutral-300 mb-8">
                Забронируйте кинозал и создайте незабываемые воспоминания
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={getWhatsAppLink('2 часа')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-zone-500 hover:bg-zone-600 text-white rounded-2xl font-medium transition-all hover-lift"
                >
                  Забронировать в WhatsApp
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <Link
                  href={`/${locale}/hotel/packages`}
                  className="px-8 py-4 glass hover:bg-white/10 text-white rounded-2xl font-medium transition-colors"
                >
                  Пакеты с кинозалом
                </Link>
              </div>
            </FadeInOnScroll>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
