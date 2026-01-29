'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useZone } from '@/contexts/ZoneContext';
import { Award, Star, Users, MessageCircle } from 'lucide-react';

import { Footer } from '@/components/layout/Footer';
import { FadeInOnScroll } from '@/components/animations/OptimizedAnimations';
import { EtnoPatternOverlay, GlowingAccent, SectionDivider } from '@/components/animations/EtnoDecorations';

// Master type with achievements
interface Master {
  id: string;
  slug: string;
  name: string;
  role: string;
  photo: string;
  experience: string;
  specialization: string;
  quote: string;
  worksCount: number;
  achievements: string[];
  whatsapp?: string;
}

// Mock data - будет заменено на данные из Sanity
const MASTERS: Master[] = [
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
    achievements: [
      'Лауреат "Мастер года" 2024',
      'Участник выставки Craft Bishkek',
      'Обучение в Ташкенте и Москве',
      'Более 500 учеников',
    ],
    whatsapp: '996555123456',
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
    achievements: [
      'Специалист по центровке',
      'Ведущий корпоративных МК',
      'Сертификат ICA (Италия)',
    ],
    whatsapp: '996555123457',
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
    achievements: [
      'Художник-оформитель',
      'Автор уникальных орнаментов',
      'Участник 10+ выставок',
    ],
    whatsapp: '996555123458',
  },
];

function getWhatsAppLink(phone: string, masterName: string): string {
  const message = encodeURIComponent(`Здравствуйте! Хочу записаться на мастер-класс к ${masterName}`);
  return `https://wa.me/${phone}?text=${message}`;
}

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
                  <article className="glass-card overflow-hidden">
                    {/* Photo */}
                    <Link href={`/${locale}/masters/${master.slug}`}>
                      <div className="relative aspect-[4/3] overflow-hidden">
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
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="p-6">
                      <Link href={`/${locale}/masters/${master.slug}`}>
                        <h2 className="text-xl font-display font-medium text-white mb-1 group-hover:text-zone-300 transition-colors">
                          {master.name}
                        </h2>
                      </Link>
                      <p className="text-neutral-400 text-sm mb-2">
                        {master.role}
                      </p>
                      <p className="text-zone-400 text-sm mb-4">
                        {master.experience} | {master.specialization}
                      </p>

                      {/* Quote */}
                      <p className="text-neutral-300 text-sm italic mb-4 line-clamp-2">
                        "{master.quote}"
                      </p>

                      {/* Achievements */}
                      {master.achievements && master.achievements.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Award className="w-4 h-4 text-zone-500" />
                            <span className="text-sm text-neutral-400">Достижения</span>
                          </div>
                          <ul className="space-y-1">
                            {master.achievements.slice(0, 3).map((achievement, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-neutral-300">
                                <Star className="w-3 h-3 text-zone-500 mt-1 flex-shrink-0" />
                                <span>{achievement}</span>
                              </li>
                            ))}
                            {master.achievements.length > 3 && (
                              <li className="text-sm text-neutral-500">
                                +{master.achievements.length - 3} ещё...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t border-white/10">
                        <Link
                          href={`/${locale}/masters/${master.slug}`}
                          className="flex-1 py-2 text-center text-sm text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          Подробнее
                        </Link>
                        {master.whatsapp && (
                          <a
                            href={getWhatsAppLink(master.whatsapp, master.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
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
