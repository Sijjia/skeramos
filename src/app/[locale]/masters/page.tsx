'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useZone } from '@/contexts/ZoneContext';

import { Footer } from '@/components/layout/Footer';
import { FadeInOnScroll } from '@/components/animations/OptimizedAnimations';
import { EtnoPatternOverlay, GlowingAccent, SectionDivider } from '@/components/animations/EtnoDecorations';

// Mock data - будет заменено на данные из Sanity
const MASTERS = [
  {
    id: '1',
    slug: 'aigul-satarova',
    name: 'Айгуль Сатарова',
    role: 'Основатель, мастер керамики',
    photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&q=80',
    experience: '15 лет опыта',
    specialization: 'Традиционная кыргызская керамика',
    quote: 'Керамика — это медитация. Каждое изделие несёт частичку души мастера.',
    worksCount: 48,
  },
  {
    id: '2',
    slug: 'bakyt-toktogуlov',
    name: 'Бакыт Токтогулов',
    role: 'Мастер гончарного круга',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    experience: '10 лет опыта',
    specialization: 'Современные техники',
    quote: 'На гончарном круге время останавливается.',
    worksCount: 35,
  },
  {
    id: '3',
    slug: 'nurgul-asanova',
    name: 'Нургуль Асанова',
    role: 'Художник по росписи',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
    experience: '8 лет опыта',
    specialization: 'Авторская роспись',
    quote: 'В каждом орнаменте — история нашего народа.',
    worksCount: 62,
  },
];

export default function MastersPage() {
  const { setZone } = useZone();
  const locale = useLocale();

  useEffect(() => {
    setZone('creativity');
  }, [setZone]);

  return (
    <>
      
      <EtnoPatternOverlay pattern="tunduk" opacity={0.02} />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <GlowingAccent position="top-right" zone="creativity" size={600} />

          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-2 rounded-full glass text-sm text-zone-300 font-medium mb-6">
                Команда Skeramos
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-medium text-white mb-6">
                Наши{' '}
                <span className="bg-gradient-to-r from-zone-300 to-gold-500 bg-clip-text text-transparent">
                  мастера
                </span>
              </h1>
              <p className="text-lg text-neutral-300">
                Профессионалы, которые делятся своим мастерством и любовью к керамике.
                Каждый из них — мастер своего дела с уникальным стилем и подходом.
              </p>
            </FadeInOnScroll>
          </div>
        </section>

        <SectionDivider variant="wave" className="opacity-50" />

        {/* Masters Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MASTERS.map((master, index) => (
                <FadeInOnScroll
                  key={master.id}
                  delay={index * 0.1}
                  className="group"
                >
                  <Link href={`/${locale}/masters/${master.slug}`}>
                    <article className="glass-card overflow-hidden gpu-lift">
                      {/* Photo */}
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <Image
                          src={master.photo}
                          alt={master.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                        {/* Works count badge */}
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass text-white text-sm">
                          {master.worksCount} работ
                        </div>

                        {/* Quote on hover */}
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 p-6"
                          initial={{ opacity: 0, y: 20 }}
                          whileHover={{ opacity: 1, y: 0 }}
                        >
                          <p className="text-white/80 text-sm italic line-clamp-2">
                            "{master.quote}"
                          </p>
                        </motion.div>
                      </div>

                      {/* Info */}
                      <div className="p-6">
                        <h2 className="text-xl font-display font-medium text-white mb-1 group-hover:text-zone-300 transition-colors">
                          {master.name}
                        </h2>
                        <p className="text-neutral-400 text-sm mb-3">
                          {master.role}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-zone-400 text-sm">
                            {master.experience}
                          </span>
                          <span className="text-neutral-500 text-sm flex items-center gap-1 group-hover:text-zone-400 transition-colors">
                            Подробнее
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 etno-tunduk">
          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-6">
                Хотите учиться у наших мастеров?
              </h2>
              <p className="text-neutral-300 mb-8">
                Запишитесь на мастер-класс и создайте своё первое изделие под руководством профессионалов
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href={`/${locale}/creativity#masterclasses`}
                  className="px-8 py-4 bg-zone-500 hover:bg-zone-600 text-white rounded-2xl font-medium transition-all hover-lift"
                >
                  Выбрать мастер-класс
                </Link>
                <a
                  href="https://wa.me/996555123456?text=Здравствуйте! Хочу записаться на мастер-класс"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 glass hover:bg-white/10 text-white rounded-2xl font-medium transition-all"
                >
                  Написать в WhatsApp
                </a>
              </div>
            </FadeInOnScroll>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
