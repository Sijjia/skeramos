'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useZone } from '@/contexts/ZoneContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FadeInOnScroll } from '@/components/animations/OptimizedAnimations';
import { EtnoPatternOverlay, GlowingAccent, SectionDivider } from '@/components/animations/EtnoDecorations';

// Mock data - будет из Sanity
const PACKAGES = [
  {
    id: '1',
    title: 'Романтический вечер',
    description: 'Идеальное свидание для двоих с кинозалом и уютной атмосферой',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
    price: 12000,
    originalPrice: 15000,
    includes: [
      'Комфортный номер на ночь',
      '2 часа кинозала',
      'Бутылка шампанского',
      'Фруктовая тарелка',
      'Романтическое оформление',
      'Поздний выезд до 14:00',
    ],
    featured: true,
    badge: 'Хит продаж',
  },
  {
    id: '2',
    title: 'Творческий уикенд',
    description: 'Совместите отдых в отеле с мастер-классом по керамике',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
    price: 15000,
    originalPrice: 18000,
    includes: [
      'Номер Комфорт на 2 ночи',
      'Мастер-класс на гончарном круге (2 чел)',
      'Завтрак оба дня',
      '1 час кинозала',
      'Готовое изделие в подарок',
    ],
    featured: false,
    badge: 'Уникально',
  },
  {
    id: '3',
    title: 'День рождения',
    description: 'Отметьте праздник в приватной обстановке с друзьями',
    image: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800&q=80',
    price: 20000,
    originalPrice: 25000,
    includes: [
      '3 часа кинозала',
      'Оформление шарами',
      'Торт на заказ (до 2 кг)',
      'Фотозона',
      'Караоке',
      'Напитки и закуски',
    ],
    featured: false,
    badge: 'Праздник',
  },
  {
    id: '4',
    title: 'Киномарафон',
    description: 'Ночь кино с друзьями: PlayStation, попкорн и любимые фильмы',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
    price: 18000,
    originalPrice: 22000,
    includes: [
      'Кинозал с 22:00 до 08:00',
      'PlayStation 5',
      'Безлимитный попкорн',
      'Напитки',
      'Пледы и подушки',
      'Завтрак утром',
    ],
    featured: false,
    badge: 'Ночь',
  },
  {
    id: '5',
    title: 'Девичник Делюкс',
    description: 'Незабываемый девичник с подругами в роскошной обстановке',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
    price: 25000,
    originalPrice: 32000,
    includes: [
      'Романтический люкс',
      '3 часа кинозала',
      'Просекко и закуски',
      'Мастер-класс по керамике',
      'Фотосессия (20 фото)',
      'Караоке',
      'Оформление',
    ],
    featured: true,
    badge: 'Люкс',
  },
  {
    id: '6',
    title: 'Семейный отдых',
    description: 'Выходные всей семьёй с развлечениями для детей и взрослых',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    price: 22000,
    originalPrice: 28000,
    includes: [
      'Семейный номер на 2 ночи',
      '2 часа кинозала',
      'Детский мастер-класс',
      'Завтраки',
      'Мультфильмы и игры',
      'Детские подарки',
    ],
    featured: false,
    badge: 'Семья',
  },
];

function getWhatsAppLink(packageName: string): string {
  const phone = '996555123456';
  const message = encodeURIComponent(`Здравствуйте! Хочу забронировать пакет "${packageName}"`);
  return `https://wa.me/${phone}?text=${message}`;
}

export default function PackagesPage() {
  const { setZone } = useZone();
  const locale = useLocale();

  useEffect(() => {
    setZone('hotel');
  }, [setZone]);

  return (
    <>
      <Header />
      <EtnoPatternOverlay pattern="shyrdak" opacity={0.02} />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <GlowingAccent position="top-left" zone="hotel" size={600} />
          <GlowingAccent position="bottom-right" zone="hotel" size={400} />

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
                Специальные{' '}
                <span className="bg-gradient-to-r from-zone-300 to-gold-500 bg-clip-text text-transparent">
                  пакеты
                </span>
              </h1>
              <p className="text-lg text-neutral-300 mb-8">
                Готовые решения для особых случаев. Экономия до 20% по сравнению с отдельным бронированием.
              </p>

              {/* Quick filter */}
              <div className="flex flex-wrap justify-center gap-3">
                {['Все', 'Романтика', 'Праздники', 'С мастер-классом'].map((filter) => (
                  <button
                    key={filter}
                    className="px-4 py-2 glass rounded-full text-sm text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        <SectionDivider variant="diamond" className="opacity-50" />

        {/* Packages Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PACKAGES.map((pkg, idx) => (
                <FadeInOnScroll key={pkg.id} delay={idx * 0.1}>
                  <article className={`glass-card overflow-hidden group hover-lift relative ${
                    pkg.featured ? 'ring-2 ring-zone-400' : ''
                  }`}>
                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-zone-500/90 text-white text-sm font-medium">
                      {pkg.badge}
                    </div>

                    {/* Discount badge */}
                    {pkg.originalPrice > pkg.price && (
                      <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-gold-500 text-white text-sm font-medium">
                        -{Math.round((1 - pkg.price / pkg.originalPrice) * 100)}%
                      </div>
                    )}

                    {/* Image */}
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={pkg.image}
                        alt={pkg.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-display font-medium text-white mb-2">
                        {pkg.title}
                      </h3>
                      <p className="text-neutral-400 text-sm mb-4">
                        {pkg.description}
                      </p>

                      {/* Includes */}
                      <ul className="space-y-2 mb-6">
                        {pkg.includes.slice(0, 4).map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                            <span className="text-zone-400 mt-0.5">✓</span>
                            {item}
                          </li>
                        ))}
                        {pkg.includes.length > 4 && (
                          <li className="text-zone-400 text-sm">
                            +{pkg.includes.length - 4} ещё
                          </li>
                        )}
                      </ul>

                      {/* Price */}
                      <div className="flex items-end gap-3 mb-4">
                        <span className="text-2xl font-display font-bold text-white">
                          {pkg.price.toLocaleString()} сом
                        </span>
                        {pkg.originalPrice > pkg.price && (
                          <span className="text-neutral-500 line-through text-sm mb-1">
                            {pkg.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* CTA */}
                      <a
                        href={getWhatsAppLink(pkg.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 bg-zone-500 hover:bg-zone-600 text-white text-center rounded-xl font-medium transition-colors"
                      >
                        Забронировать
                      </a>
                    </div>
                  </article>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Custom Package */}
        <section className="py-16 md:py-24 bg-zone-950/50 etno-tunduk">
          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-2xl mx-auto text-center">
              <span className="text-4xl mb-4 block">✨</span>
              <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-6">
                Нужен индивидуальный пакет?
              </h2>
              <p className="text-neutral-300 mb-8">
                Мы создадим уникальное предложение под ваши пожелания и бюджет.
                Свадьбы, юбилеи, корпоративы — любой формат.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://wa.me/996555123456?text=Здравствуйте! Хочу обсудить индивидуальный пакет"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-zone-500 hover:bg-zone-600 text-white rounded-2xl font-medium transition-all hover-lift"
                >
                  Обсудить в WhatsApp
                </a>
                <a
                  href="tel:+996555123456"
                  className="px-8 py-4 glass hover:bg-white/10 text-white rounded-2xl font-medium transition-colors"
                >
                  Позвонить
                </a>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* Why Packages */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <FadeInOnScroll className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-4">
                Почему выгодно брать пакет
              </h2>
            </FadeInOnScroll>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  icon: '💰',
                  title: 'Экономия до 20%',
                  description: 'Пакетная цена всегда выгоднее отдельного бронирования',
                },
                {
                  icon: '🎁',
                  title: 'Всё включено',
                  description: 'Не нужно думать о деталях — мы обо всём позаботимся',
                },
                {
                  icon: '⭐',
                  title: 'Гарантия качества',
                  description: 'Проверенные сценарии, которые уже порадовали сотни гостей',
                },
              ].map((item, idx) => (
                <FadeInOnScroll key={idx} delay={idx * 0.1}>
                  <div className="glass-card p-6 text-center">
                    <span className="text-4xl mb-4 block">{item.icon}</span>
                    <h3 className="text-lg font-display font-medium text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-neutral-400 text-sm">
                      {item.description}
                    </p>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
