'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useZone } from '@/contexts/ZoneContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FadeInOnScroll } from '@/components/animations/OptimizedAnimations';
import { EtnoPatternOverlay, GlowingAccent, SectionDivider } from '@/components/animations/EtnoDecorations';

// Mock data - будет из Sanity
const HISTORY_TIMELINE = [
  {
    year: '2017',
    title: 'Первая искра',
    description: 'Айгуль Сатарова посещает свой первый мастер-класс по керамике. То, что началось как хобби, становится страстью всей жизни.',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
    milestone: 'founding',
  },
  {
    year: '2018',
    title: 'Обучение мастерству',
    description: 'Год интенсивного обучения в Ташкенте и Москве. Изучение традиционных техник и современных подходов к керамике.',
    image: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=600&q=80',
    milestone: 'achievement',
  },
  {
    year: '2019',
    title: 'Рождение Skeramos',
    description: 'Открытие первой мастерской на улице Шукурова. Небольшое пространство с одним гончарным кругом и большой мечтой.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80',
    milestone: 'founding',
  },
  {
    year: '2020',
    title: 'Испытание и рост',
    description: 'Несмотря на сложности, мы не закрылись. Запустили онлайн-курсы и расширили команду до 3 мастеров.',
    image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=600&q=80',
    milestone: 'expansion',
  },
  {
    year: '2021',
    title: 'Первая выставка',
    description: 'Участие в Craft Bishkek — наши работы впервые увидела широкая публика. Получили приз зрительских симпатий.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=80',
    milestone: 'award',
  },
  {
    year: '2022',
    title: 'Расширение пространства',
    description: 'Переезд в новое помещение: 3 гончарных круга, зона для ручной лепки, собственная печь для обжига.',
    image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=600&q=80',
    milestone: 'expansion',
  },
  {
    year: '2023',
    title: 'Открытие отеля',
    description: 'Skeramos становится творческим домом — запуск мини-отеля с романтическими номерами и приватным кинозалом.',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80',
    milestone: 'expansion',
  },
  {
    year: '2024',
    title: 'Признание',
    description: 'Награда "Мастер года" от ArtKG. Более 2000 учеников прошли наши мастер-классы. 50+ корпоративных мероприятий.',
    image: 'https://images.unsplash.com/photo-1603665301175-57ba46f392bf?w=600&q=80',
    milestone: 'award',
  },
];

const MILESTONE_ICONS: Record<string, string> = {
  founding: '🌱',
  achievement: '⭐',
  expansion: '🏠',
  award: '🏆',
  event: '🎉',
};

export default function HistoryPage() {
  const { setZone } = useZone();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Анимация "нити" — линия растягивается при скролле
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    setZone('creativity');
  }, [setZone]);

  return (
    <>
      <Header />
      <EtnoPatternOverlay pattern="shyrdak" opacity={0.02} />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <GlowingAccent position="center" zone="creativity" size={800} />

          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-2 rounded-full glass text-sm text-zone-300 font-medium mb-6">
                С 2019 года
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-medium text-white mb-6">
                Наша{' '}
                <span className="bg-gradient-to-r from-zone-300 to-gold-500 bg-clip-text text-transparent">
                  история
                </span>
              </h1>
              <p className="text-lg text-neutral-300 mb-8">
                От одного гончарного круга до творческого дома. Путь Skeramos —
                это история о страсти к керамике и любви к людям.
              </p>

              {/* Decorative spiral */}
              <div className="flex justify-center">
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  className="text-zone-500 animate-spin-slow"
                >
                  <path
                    d="M30 10 C40 10 50 20 50 30 C50 40 40 45 30 45 C22 45 18 38 18 30 C18 24 22 20 30 20 C36 20 40 25 40 30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        <SectionDivider variant="wave" className="opacity-50" />

        {/* Timeline */}
        <section ref={containerRef} className="py-16 md:py-24 relative">
          <div className="container mx-auto px-4">
            {/* Центральная линия-нить */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zone-900 transform -translate-x-1/2 hidden md:block">
              <motion.div
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-zone-500 via-gold-500 to-zone-500"
                style={{ height: lineHeight }}
              />
            </div>

            {/* Mobile line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-zone-900 md:hidden">
              <motion.div
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-zone-500 to-gold-500"
                style={{ height: lineHeight }}
              />
            </div>

            <div className="relative">
              {HISTORY_TIMELINE.map((item, index) => (
                <FadeInOnScroll
                  key={item.year}
                  delay={0.1}
                  direction={index % 2 === 0 ? 'left' : 'right'}
                >
                  <div
                    className={`
                      relative flex items-start mb-16 md:mb-24
                      ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}
                    `}
                  >
                    {/* Year dot - Desktop */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex flex-col items-center z-10">
                      <div className="w-12 h-12 rounded-full bg-zone-500 flex items-center justify-center text-2xl shadow-lg shadow-zone-500/30">
                        {MILESTONE_ICONS[item.milestone] || '📍'}
                      </div>
                      <span className="mt-2 text-zone-400 font-display font-bold text-lg">
                        {item.year}
                      </span>
                    </div>

                    {/* Year dot - Mobile */}
                    <div className="absolute left-8 transform -translate-x-1/2 flex md:hidden flex-col items-center z-10">
                      <div className="w-8 h-8 rounded-full bg-zone-500 flex items-center justify-center text-lg">
                        {MILESTONE_ICONS[item.milestone] || '📍'}
                      </div>
                    </div>

                    {/* Content card */}
                    <div
                      className={`
                        w-full md:w-5/12 ml-16 md:ml-0
                        ${index % 2 === 0 ? 'md:pr-20' : 'md:pl-20'}
                      `}
                    >
                      <div className="glass-card overflow-hidden gpu-lift">
                        {/* Image */}
                        <div className="relative aspect-video">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

                          {/* Year badge - Mobile */}
                          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-zone-500 text-white text-sm font-bold md:hidden">
                            {item.year}
                          </div>
                        </div>

                        {/* Text */}
                        <div className="p-6">
                          <h3 className="text-xl font-display font-medium text-white mb-3">
                            {item.title}
                          </h3>
                          <p className="text-neutral-300 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Empty space for the other side */}
                    <div className="hidden md:block md:w-5/12" />
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Future Section */}
        <section className="py-16 md:py-24 etno-tunduk">
          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-2xl mx-auto text-center">
              <span className="text-6xl mb-6 block">🔮</span>
              <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-6">
                Что дальше?
              </h2>
              <p className="text-neutral-300 mb-8">
                Мы продолжаем расти и мечтать. В планах — собственная линейка керамики,
                международные мастер-классы и создание сообщества керамистов Кыргызстана.
              </p>
              <p className="text-zone-400 text-lg">
                Присоединяйтесь к нашей истории — станьте её частью!
              </p>
            </FadeInOnScroll>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-8 text-center">
                  <span className="text-4xl mb-4 block">🎨</span>
                  <h3 className="text-xl font-display font-medium text-white mb-3">
                    Творить с нами
                  </h3>
                  <p className="text-neutral-400 mb-6 text-sm">
                    Запишитесь на мастер-класс и создайте своё первое изделие
                  </p>
                  <a
                    href="/creativity"
                    className="inline-block px-6 py-3 bg-zone-500 hover:bg-zone-600 text-white rounded-xl font-medium transition-colors"
                  >
                    Мастер-классы
                  </a>
                </div>

                <div className="glass-card p-8 text-center">
                  <span className="text-4xl mb-4 block">🏠</span>
                  <h3 className="text-xl font-display font-medium text-white mb-3">
                    Остаться с нами
                  </h3>
                  <p className="text-neutral-400 mb-6 text-sm">
                    Забронируйте номер и погрузитесь в атмосферу творчества
                  </p>
                  <a
                    href="/hotel"
                    className="inline-block px-6 py-3 bg-hotel-500 hover:bg-hotel-600 text-white rounded-xl font-medium transition-colors"
                  >
                    Номера отеля
                  </a>
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
